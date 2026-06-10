import requests
import datetime
import urllib.parse
import os
from dotenv import load_dotenv

load_dotenv('backend/.env')
supabase_url = os.getenv('SUPABASE_URL')
supabase_key = os.getenv('SUPABASE_KEY')
bucket_name = 'careerwizard'

file_path = f"day1/test_upload_{int(datetime.datetime.now().timestamp())}.txt"
encoded_path = urllib.parse.quote(file_path)
storage_url = f"{supabase_url}/storage/v1/object/{bucket_name}/{encoded_path}"

headers = {
    "Authorization": f"Bearer {supabase_key}",
    "apikey": supabase_key,
    "Content-Type": "text/plain"
}

response = requests.post(storage_url, headers=headers, data=b"Test file content")
print(f"Status: {response.status_code}")
print(f"Response: {response.text}")
