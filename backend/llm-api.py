from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import requests
import json
import subprocess
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
import re
import textwrap
import smtplib
from email import encoders
from email.mime.base import MIMEBase
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class DocumentRequest(BaseModel):
    llm_prompt: str
    receiver_email: str
    document_type: int

class EnvironmentalRequest(BaseModel):
    user_query: str
    receiver_email: str

DOCUMENT_TYPES = {
    1: {"name": "NDA", "query": "Non-Disclosure Agreement requirements"},
    2: {"name": "Articles of Incorporation", "query": "Articles of Incorporation requirements"},
    3: {"name": "Employment Agreement", "query": "Employment Agreement requirements"},
    4: {"name": "Operating Agreement for LLC", "query": "LLC Operating Agreement requirements"},
    5: {"name": "Will", "query": "Last Will and Testament requirements"}
}

def get_descriptions_and_urls(api_key, query):
    headers = {"X-API-Key": api_key}
    params = {"query": query}
    response = requests.get(
        f"https://api.ydc-index.io/search?query={query}",
        params=params,
        headers=headers,
    )
    results = response.json()
    hits = results.get('hits', [])
    return [{"description": hit.get('description', ''), "url": hit.get('url', '')} for hit in hits]

def generate_system_prompt(results):
    prompt = "Here's some context from web searches:\n\n"
    for item in results:
        prompt += f"Description: {item['description']}\nURL: {item['url']}\n\n"
    prompt += "Please use this information to inform your response."
    return prompt

def invoke_bedrock_model(input_content, system_prompt):
    input_json = {
        "anthropic_version": "bedrock-2023-05-31",
        "max_tokens": 7000,
        "messages": [
            {
                "role": "user",
                "content": f"{system_prompt}\n\nUser query: {input_content}"
            }
        ]
    }
    
    with open("input.json", "w") as f:
        json.dump(input_json, f)
    
    command = [
        "aws", "bedrock-runtime", "invoke-model",
        "--model-id", "anthropic.claude-3-5-sonnet-20240620-v1:0",
        "--body", "fileb://input.json",
        "--content-type", "application/json",
        "--accept", "application/json",
        "--cli-binary-format", "raw-in-base64-out",
        "output.json"
    ]
    
    try:
        subprocess.run(command, check=True, capture_output=True, text=True)
        with open("output.json", "r") as f:
            output = json.load(f)
        return output
    except subprocess.CalledProcessError as e:
        print(f"Error occurred: {e}")
        print(f"Stdout: {e.stdout}")
        print(f"Stderr: {e.stderr}")
        return None
    
def get_environmental_context(api_key, query):
    headers = {"X-API-Key": api_key}
    params = {"query": query}
    response = requests.get(
        f"https://api.ydc-index.io/search?query={query}",
        params=params,
        headers=headers,
    )
    results = response.json()
    hits = results.get('hits', [])
    return [{"description": hit.get('description', ''), "url": hit.get('url', '')} for hit in hits[:5]]  # Return top 5 results


def generate_environmental_prompt(results, user_query):
    prompt = f"User Query: {user_query}\n\nHere's some context from web searches about EPA regulations and climate law:\n\n"
    for item in results:
        prompt += f"Description: {item['description']}\nURL: {item['url']}\n\n"
    prompt += "Please use this information to provide a comprehensive response to the user's query. Include relevant EPA regulations, climate laws, and guidelines. Also, provide a list of source URLs at the end of your response."
    return prompt

def extract_text_and_sources(response):
    content = response["content"][0]["text"]
    # Split the content into main text and sources
    parts = content.split("Source URLs:", 1)
    main_text = parts[0].strip()
    sources = parts[1].strip().split("\n") if len(parts) > 1 else []
    return main_text, sources

def format_response_with_hyperlinks(main_text, sources):
    formatted_text = main_text + "\n\nSources:\n"
    for i, source in enumerate(sources, 1):
        formatted_text += f"{i}. <a href='{source.strip()}'>{source.strip()}</a>\n"
    return formatted_text


def extract_text_from_response(response):
    content = response["content"][0]["text"]
    match = re.search(r'"""(.*?)"""|\"\"\"(.*?)\"\"\"', content, re.DOTALL)
    if match:
        return match.group(1) if match.group(1) else match.group(2)
    return None

def save_to_pdf(text, filename):
    c = canvas.Canvas(filename, pagesize=letter)
    width, height = letter
    margin = 40
    text_width = width - 2 * margin
    text_object = c.beginText(margin, height - margin)
    text_object.setFont("Helvetica", 12)
    
    lines = text.split('\n')
    line_height = 14
    y_position = height - margin

    wrapping_width = int(text_width / 5.5)

    for line in lines:
        wrapped_lines = textwrap.wrap(line, width=wrapping_width)
        for wrapped_line in wrapped_lines:
            if y_position <= margin:
                c.drawText(text_object)
                c.showPage()
                text_object = c.beginText(margin, height - margin)
                text_object.setFont("Helvetica", 12)
                y_position = height - margin
            text_object.setTextOrigin(margin, y_position)
            y_position -= line_height
            text_object.textLine(wrapped_line)

    c.drawText(text_object)
    c.save()

def send_email_with_pdf(sender_email, sender_password, receiver_email, subject, body, pdf_path):
    message = MIMEMultipart()
    message["From"] = sender_email
    message["To"] = receiver_email
    message["Subject"] = subject

    message.attach(MIMEText(body, "plain"))

    with open(pdf_path, "rb") as attachment:
        part = MIMEBase("application", "octet-stream")
        part.set_payload(attachment.read())

    encoders.encode_base64(part)

    part.add_header(
        "Content-Disposition",
        f"attachment; filename= {pdf_path.split('/')[-1]}",
    )

    message.attach(part)

    text = message.as_string()

    with smtplib.SMTP("smtp-mail.outlook.com", 587) as server:
        server.starttls()
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, receiver_email, text)
    
    print(f"Email sent successfully to {receiver_email}")

@app.post("/generate-document")
async def generate_document(request: DocumentRequest):
    YOUR_API_KEY = '99d9afe1-45c9-4187-8701-dace7668e61a<__>1PTsFeETU8N2v5f4qmtDZVGS'
    
    if request.document_type not in DOCUMENT_TYPES:
        raise HTTPException(status_code=400, detail="Invalid document type")
    
    document_info = DOCUMENT_TYPES[request.document_type]
    you_com_query = document_info["query"]

    # Get context from You.com
    results = get_descriptions_and_urls(YOUR_API_KEY, you_com_query)
    
    # Generate system prompt
    system_prompt = generate_system_prompt(results)
    
    # Retry logic
    max_retries = 3
    for attempt in range(max_retries):
        # Invoke Bedrock model
        response = invoke_bedrock_model(request.llm_prompt, system_prompt)
        
        # Extract text enclosed in triple quotes
        document_text = extract_text_from_response(response)
        
        if document_text:
            # Save to PDF
            pdf_filename = f"{document_info['name']}.pdf"
            save_to_pdf(document_text, pdf_filename)

            # Send email with PDF attachment
            sender_email = "aequitasai@outlook.com"  # This should be your configured sender email
            sender_password = "CalHacks2024"  # This should be securely stored, not hardcoded
            receiver_email = request.receiver_email
            subject = f"{document_info['name']} Document"
            body = f"Please find attached the {document_info['name']} document generated based on your request."

            try:
                send_email_with_pdf(sender_email, sender_password, receiver_email, subject, body, pdf_filename)
                return {"message": f"{document_info['name']} generated and sent successfully"}
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"An error occurred while sending the email: {str(e)}")

        else:
            if attempt == max_retries - 1:
                raise HTTPException(status_code=500, detail=f"Failed to generate {document_info['name']} after multiple attempts")

    # This line should never be reached due to the error handling above, but including it for completeness
    raise HTTPException(status_code=500, detail="Unexpected error occurred")

@app.post("/environmental-guidance")
async def environmental_guidance(request: EnvironmentalRequest):
    YOUR_API_KEY = '99d9afe1-45c9-4187-8701-dace7668e61a<__>1PTsFeETU8N2v5f4qmtDZVGS'
    you_com_query = f"EPA regulations and climate law related to {request.user_query}"

    # Get context from You.com
    results = get_environmental_context(YOUR_API_KEY, you_com_query)
    
    # Generate environmental prompt
    environmental_prompt = generate_environmental_prompt(results, request.user_query)
    
    # Invoke Bedrock model
    response = invoke_bedrock_model(environmental_prompt)
    
    if response:
        main_text, sources = extract_text_and_sources(response)
        formatted_response = format_response_with_hyperlinks(main_text, sources)
        
        return {"message": formatted_response}
    else:
        raise HTTPException(status_code=500, detail="Failed to generate environmental guidance")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)