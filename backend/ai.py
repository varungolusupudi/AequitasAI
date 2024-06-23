import requests
import json
import subprocess
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
import re
import textwrap

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

def main():
    YOUR_API_KEY = '99d9afe1-45c9-4187-8701-dace7668e61a<__>1PTsFeETU8N2v5f4qmtDZVGS'
    user_query = 'generate a NDA for John Doe and Aequitas AI. John Doe is a contractor who is not to infringe trade secrets make sure to include everything else that is necessary enclose your response in triple quotes so I can convert to pdf easily the signing will be at the end make sure the places to sign make it in depth'
    you_com_query = 'NDA requirements'

    # Get context from You.com
    results = get_descriptions_and_urls(YOUR_API_KEY, you_com_query)
    
    # Generate system prompt
    system_prompt = generate_system_prompt(results)
    
    # Retry logic
    max_retries = 3
    for attempt in range(max_retries):
        # Invoke Bedrock model
        response = invoke_bedrock_model(user_query, system_prompt)
        
        # Extract text enclosed in triple quotes
        nda_text = extract_text_from_response(response)
        
        if nda_text:
            # Print the output to the terminal
            print("Extracted text:")
            print(nda_text)

            # Save to PDF
            save_to_pdf(nda_text, "NDA.pdf")
            print("NDA saved to NDA.pdf")
            break
        else:
            print(f"No text found in triple quotes. Retrying... (Attempt {attempt + 1} of {max_retries})")
    else:
        print("Failed to extract text in triple quotes after several attempts.")

if __name__ == "__main__":
    main()