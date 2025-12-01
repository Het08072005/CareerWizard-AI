
from typing import List, Optional
from pydantic import BaseModel, field_validator, computed_field

class InterviewAnswer(BaseModel):
    explanation: str
    code: Optional[str] = None

class InterviewCreate(BaseModel):
    role: str
    skills: str
    category: str
    title: str
    difficulty: str
    tags: List[str]
    answer: InterviewAnswer

class InterviewResponse(BaseModel):
    id: int
    role: str
    skills: str
    category: str
    title: str
    difficulty: str
    tags: List[str]
    answer_explanation: str
    answer_code: Optional[str] = None

    class Config:
        from_attributes = True
    
    @computed_field
    @property
    def answer(self) -> InterviewAnswer:
        """Map answer_explanation and answer_code to answer object"""
        return InterviewAnswer(explanation=self.answer_explanation, code=self.answer_code)





















# from typing import List, Optional
# from pydantic import BaseModel, field_validator, computed_field

# class InterviewAnswer(BaseModel):
#     explanation: str
#     code: Optional[str] = None

# class InterviewCreate(BaseModel):
#     role: str
#     skills: str
#     category: str
#     title: str
#     difficulty: str
#     tags: List[str]
#     answer: InterviewAnswer

# class InterviewResponse(BaseModel):
#     id: int
#     role: str
#     skills: str
#     category: str
#     title: str
#     difficulty: str
#     tags: List[str]
#     answer_explanation: str
#     answer_code: Optional[str] = None

#     class Config:
#         from_attributes = True
    
#     @computed_field
#     @property
#     def answer(self) -> InterviewAnswer:
#         """Map answer_explanation and answer_code to answer object"""
#         return InterviewAnswer(explanation=self.answer_explanation, code=self.answer_code)

