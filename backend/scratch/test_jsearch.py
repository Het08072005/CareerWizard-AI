import requests
import os
from dotenv import load_dotenv

load_dotenv()

url = "https://jsearch.p.rapidapi.com/search"

querystring = {"query":"Python Developer in India","num_pages":"1"}

headers = {
	"X-RapidAPI-Key": os.environ["RAPIDAPI_KEY"],
	"X-RapidAPI-Host": "jsearch.p.rapidapi.com"
}

try:
    response = requests.get(url, headers=headers, params=querystring)
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print("Success! Found jobs:")
        for job in data.get('data', [])[:3]:
            print(f"- {job.get('job_title')} at {job.get('employer_name')}")
    else:
        print("Response Text:", response.text)
except Exception as e:
    print(f"An error occurred: {e}")
