import requests

# Configuration
api_url = "https://api.docuseal.co"
api_key = "5dkQoxBZ5MJ8SwzCVGgRVMvzAZvUmQaMni7AX337ySC"  # Replace with your actual API key
submission_id = 180931  # Replace with your actual submission ID

# Function to get submission status
def get_submission_status(submission_id):
    headers = {
        "X-Auth-Token": api_key,
        "Content-Type": "application/json"
    }
    response = requests.get(f"{api_url}/submissions/{submission_id}", headers=headers)
    print(f"Get Submission Status Response Status Code: {response.status_code}")
    print(f"Get Submission Status Response Content: {response.text}")

    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error: Failed to get submission status. Status code: {response.status_code}, Response: {response.text}")
        return None

# Main function
def main():
    submission_status = get_submission_status(submission_id)
    if submission_status:
        print(f"Submission status: {submission_status}")

if __name__ == "__main__":
    main()