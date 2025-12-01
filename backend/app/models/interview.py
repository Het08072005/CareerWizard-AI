from sqlalchemy import Column, Integer, String, Text, ARRAY
from app.db.database import Base

class InterviewQuestion(Base):
    __tablename__ = "interview_questions"

    id = Column(Integer, primary_key=True, index=True)

    role = Column(String(100), nullable=False)          # Frontend / Backend / AI
    skills = Column(String(255), nullable=False)        # "React, HTML, CSS"
    category = Column(String(100), nullable=False)      # Fundamentals, Async, Coding

    title = Column(Text, nullable=False)                # Question title
    difficulty = Column(String(20), nullable=False)     # easy/medium/hard

    tags = Column(ARRAY(String), nullable=True)         # ['JavaScript','Async']

    answer_explanation = Column(Text, nullable=False)
    answer_code = Column(Text, nullable=True)














# from sqlalchemy import Column, Integer, String, Text, ARRAY
# from app.db.database import Base

# class InterviewQuestion(Base):
#     __tablename__ = "interview_questions"

#     id = Column(Integer, primary_key=True, index=True)

#     role = Column(String(100), nullable=False)          # Frontend / Backend / AI
#     skills = Column(String(255), nullable=False)        # "React, HTML, CSS"
#     category = Column(String(100), nullable=False)      # Fundamentals, Async, Coding

#     title = Column(Text, nullable=False)                # Question title
#     difficulty = Column(String(20), nullable=False)     # easy/medium/hard

#     tags = Column(ARRAY(String), nullable=True)         # ['JavaScript','Async']

#     answer_explanation = Column(Text, nullable=False)
#     answer_code = Column(Text, nullable=True)
