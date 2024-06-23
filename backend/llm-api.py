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

app = FastAPI()

class NDARe
quest(BaseModel):
    llm_prompt: str
    sender_email: str

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
    text_width = width - 2 * margin  # Calculate the text width
    text_object = c.beginText(margin, height - margin)
    text_object.setFont("Helvetica", 12)
    
    lines = text.split('\n')
    line_height = 14  # Adjust based on font size
    y_position = height - margin

    # Adjust the wrapping width to better fit the text within the margins
    wrapping_width = int(text_width / 5.5)

    for line in lines:
        wrapped_lines = textwrap.wrap(line, width=wrapping_width)  # Wrap the line
        for wrapped_line in wrapped_lines:
            if y_position <= margin:  # If we run out of space, create a new page
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
    # Create a multipart message
    message = MIMEMultipart()
    message["From"] = sender_email
    message["To"] = receiver_email
    message["Subject"] = subject

    # Add body to email
    message.attach(MIMEText(body, "plain"))

    # Open PDF file in binary mode
    with open(pdf_path, "rb") as attachment:
        # Add file as application/octet-stream
        part = MIMEBase("application", "octet-stream")
        part.set_payload(attachment.read())

    # Encode file in ASCII characters to send by email    
    encoders.encode_base64(part)

    # Add header as key/value pair to attachment part
    part.add_header(
        "Content-Disposition",
        f"attachment; filename= {pdf_path.split('/')[-1]}",
    )

    # Add attachment to message
    message.attach(part)

    # Convert message to string
    text = message.as_string()

    # Log in to server using secure context and send email
    with smtplib.SMTP("smtp-mail.outlook.com", 587) as server:
        server.starttls()
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, receiver_email, text)
    
    print(f"Email sent successfully to {receiver_email}")

@app.post("/generate-nda")
async def generate_nda(request: NDARequest):
    YOUR_API_KEY = '99d9afe1-45c9-4187-8701-dace7668e61a<__>1PTsFeETU8N2v5f4qmtDZVGS'
    you_com_query = 'NDA requirements'

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
        nda_text = extract_text_from_response(response)
        
        if nda_text:
            # Save to PDF
            pdf_filename = "NDA.pdf"
            save_to_pdf(nda_text, pdf_filename)

            # Send email with PDF attachment
            sender_email = request.sender_email
            sender_password = "CalHacks2024"  # Note: In a production environment, use secure methods to store and retrieve passwords
            receiver_email = "jejacob@berkeley.edu"  # You might want to make this configurable as well
            subject = "NDA Document"
            body = "Please find attached the NDA document generated based on your request."

            try:
                send_email_with_pdf(sender_email, sender_password, receiver_email, subject, body, pdf_filename)
                return {"message": "NDA generated and sent successfully"}
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"An error occurred while sending the email: {str(e)}")

        else:
            if attempt == max_retries - 1:
                raise HTTPException(status_code=500, detail="Failed to generate NDA after multiple attempts")

    # This line should never be reached due to the error handling above, but including it for completeness
    raise HTTPException(status_code=500, detail="Unexpected error occurred")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)