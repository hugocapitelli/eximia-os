"""
Harven.AI - Pydantic Request/Response Models
=============================================
Centralized model definitions for API requests and responses.
"""

from typing import Optional, List
from pydantic import BaseModel


# ============================================
# AUTH MODELS
# ============================================

class LoginRequest(BaseModel):
    ra: str
    password: str


# ============================================
# USER MODELS
# ============================================

class UserCreate(BaseModel):
    name: str
    email: str
    ra: str
    role: str  # 'student', 'teacher', 'admin'
    password: str
    title: Optional[str] = None


class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None
    title: Optional[str] = None
    ra: Optional[str] = None


# ============================================
# DISCIPLINE MODELS
# ============================================

class DisciplineCreate(BaseModel):
    name: str
    code: str
    department: str


class DisciplineUpdate(BaseModel):
    name: Optional[str] = None
    code: Optional[str] = None
    department: Optional[str] = None


# ============================================
# COURSE MODELS
# ============================================

class CourseCreate(BaseModel):
    title: str
    instructor: str
    category: str
    description: str = ""


class CourseUpdate(BaseModel):
    title: Optional[str] = None
    instructor: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None


# ============================================
# CHAPTER MODELS
# ============================================

class ChapterCreate(BaseModel):
    title: str
    description: Optional[str] = ""
    order: int = 0


# ============================================
# CONTENT MODELS
# ============================================

class ContentCreate(BaseModel):
    title: str
    type: str = "text"
    body: Optional[str] = None
    content_url: Optional[str] = None
    order: int = 0


class ContentUpdate(BaseModel):
    title: Optional[str] = None
    type: Optional[str] = None
    body: Optional[str] = None
    content_url: Optional[str] = None
    text_content: Optional[str] = None
    order: Optional[int] = None


# ============================================
# QUESTION MODELS
# ============================================

class QuestionCreate(BaseModel):
    text: str
    type: str = "multiple_choice"
    options: Optional[List[str]] = None
    correct_answer: Optional[str] = None
    explanation: Optional[str] = None


class QuestionUpdate(BaseModel):
    text: Optional[str] = None
    type: Optional[str] = None
    options: Optional[List[str]] = None
    correct_answer: Optional[str] = None
    explanation: Optional[str] = None


# ============================================
# AI SERVICE MODELS
# ============================================

class QuestionGenerationRequest(BaseModel):
    text: str
    num_questions: int = 5
    question_type: str = "multiple_choice"
    difficulty: str = "medium"


class SocraticDialogueRequest(BaseModel):
    student_response: str
    context: Optional[str] = None
    content_id: Optional[str] = None
    learning_objective: Optional[str] = None
    difficulty: Optional[str] = "medium"


class AIDetectionRequest(BaseModel):
    text: str
    threshold: float = 0.7


class TranscriptionRequest(BaseModel):
    content_id: str
    audio_url: Optional[str] = None


# ============================================
# NOTIFICATION MODELS
# ============================================

class NotificationCreate(BaseModel):
    user_id: str
    title: str
    message: str
    type: str = "info"


# ============================================
# ACTIVITY MODELS
# ============================================

class ActivityCreate(BaseModel):
    type: str
    description: str
    points: int = 0
    metadata: Optional[dict] = None


# ============================================
# CHAT MODELS
# ============================================

class ChatMessageCreate(BaseModel):
    role: str  # 'user' or 'assistant'
    content: str


class ChatSessionCreate(BaseModel):
    content_id: str
    title: Optional[str] = None


# ============================================
# ADMIN MODELS
# ============================================

class SystemSettings(BaseModel):
    platform_name: Optional[str] = None
    primary_color: Optional[str] = None
    secondary_color: Optional[str] = None
    logo_url: Optional[str] = None
    login_logo_url: Optional[str] = None
    login_background_url: Optional[str] = None


class GlobalAction(BaseModel):
    action: str
    target: Optional[str] = None
    params: Optional[dict] = None
