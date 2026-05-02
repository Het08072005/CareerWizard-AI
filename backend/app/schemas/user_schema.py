from pydantic import BaseModel

class SignupRequest(BaseModel):
    name: str
    email: str
    password: str
    role: str = None

class LoginRequest(BaseModel):
    email: str
    password: str
