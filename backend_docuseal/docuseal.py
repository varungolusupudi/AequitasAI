import requests
import base64
import os

# Configuration
api_url = "https://api.docuseal.co"
api_key = "5dkQoxBZ5MJ8SwzCVGgRVMvzAZvUmQaMni7AX337ySC"  # Replace with your actual API key
document_path = r"C:\Users\Dan\Documents\Dummy.pdf"  # Predefined document path
recipient_email = "joyce_kim1@berkeley.edu"  # Predefined recipient email

# Function to read and encode PDF
def encode_pdf(file_path):
    try:
        with open(file_path, "rb") as file:
            return base64.b64encode(file.read()).decode('utf-8')
    except FileNotFoundError:
        print(f"Error: File {file_path} not found.")
        return None

# Function to create a template from the PDF with a signature field
def create_template(encoded_file, template_name="Test Template"):
    headers = {
        "X-Auth-Token": api_key,
        "Content-Type": "application/json"
    }
    payload = {
        "name": template_name,
        "documents": [
            {
                "name": "Contract Agreement",
                "file": encoded_file,
                "fields": [
                    {
                        "name": "Signature",
                        "type": "signature",
                        "role": "First Party",
                        "areas": [
                            {
                                "page": 1,
                                "x": 0.5,
                                "y": 0.5,
                                "w": 0.2,
                                "h": 0.1
                            }
                        ]
                    }
                ]
            }
        ]
    }
    response = requests.post(f"{api_url}/templates/pdf", headers=headers, json=payload)
    print(f"Create Template Response Status Code: {response.status_code}")
    print(f"Create Template Response Content: {response.text}")

    if response.status_code == 201 or response.status_code == 200:
        return response.json().get("id")
    else:
        print(f"Error: Failed to create template. Status code: {response.status_code}, Response: {response.text}")
        return None

# Function to create a submission
def create_submission(template_id, recipient_email):
    headers = {
        "X-Auth-Token": api_key,
        "Content-Type": "application/json"
    }
    payload = {
        "template_id": template_id,
        "send_email": True,
        "submitters": [
            {
                "role": "First Party",
                "email": recipient_email
            }
        ]
    }
    response = requests.post(f"{api_url}/submissions", headers=headers, json=payload)
    print(f"Create Submission Response Status Code: {response.status_code}")
    print(f"Create Submission Response Content: {response.text}")

    if response.status_code == 201 or response.status_code == 200:
        return response.json()
    else:
        print(f"Error: Failed to create submission. Status code: {response.status_code}, Response: {response.text}")
        return None

# Main function
def main():
    # Check if the document path exists
    if not os.path.exists(document_path):
        print("File not found!")
        return

    # Read and encode the PDF
    encoded_file = encode_pdf(document_path)
    if not encoded_file:
        return

    # Create template
    template_id = create_template(encoded_file)
    if not template_id:
        return

    print(f"Template created with ID: {template_id}")

    # Create submission
    submission_response = create_submission(template_id, recipient_email)
    if not submission_response:
        return

    print(f"Submission created: {submission_response}")

if __name__ == "__main__":
    main()
