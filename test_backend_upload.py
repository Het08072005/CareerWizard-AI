import requests

url = "http://localhost:8000/api/admin/upload_resource"

files = {
    'file': ('test_image.png', b'fake image data', 'image/png')
}
data = {
    'day': 1,
    'original_name': 'test_image.png'
}

response = requests.post(url, files=files, data=data)
print(f"Status: {response.status_code}")
print(f"Response: {response.text}")
