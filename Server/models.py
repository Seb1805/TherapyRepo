
import uuid
from typing import Optional, List, Dict
from pydantic import BaseModel, Field
from datetime import date

#------------- Example from the documentation - for reference -------------
class Book(BaseModel):
    id: str = Field(default_factory=uuid.uuid4, alias="_id")
    title: str = Field(...)
    author: str = Field(...)
    synopsis: str = Field(...)

    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "_id": "066de609-b04a-4b30-b46c-32537c7f1f6e",
                "title": "Don Quixote",
                "author": "Miguel de Cervantes",
                "synopsis": "..."
            }
        }

class BookUpdate(BaseModel):
    title: Optional[str]
    author: Optional[str]
    synopsis: Optional[str]

    class Config:
        schema_extra = {
            "example": {
                "title": "Don Quixote",
                "author": "Miguel de Cervantes",
                "synopsis": "Don Quixote is a Spanish novel by Miguel de Cervantes..."
            }
        }
        
#------------- Example from the documentation - for reference -------------

#User
class User(BaseModel):
    id: str = Field(default_factory=uuid.uuid4, alias="_id")
    email: str
    password: str
    role: str
    firstName: str
    lastName: str
    phoneNumber: str
    specialties: List[str]
    services: List[str]
    active: bool
    createdAt: date
    updatedAt: date

    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "_id": "066de609-b04a-4b30-b46c-32537c7f1f6e",
                "email": "user@example.com",
                "password": "password123",
                "role": "therapist",
                "firstName": "John",
                "lastName": "Doe",
                "phoneNumber": "1234567890",
                "specialties": ["specialty1", "specialty2"],
                "services": ["service1", "service2"],
                "active": True,
                "createdAt": "2023-01-01",
                "updatedAt": "2023-01-01"
            }
        }
        
class UserUpdate(BaseModel):
    id: str = Field(default_factory=uuid.uuid4, alias="_id")
    email: Optional[str]
    password: Optional[str]
    role: Optional[str]
    firstName: Optional[str]
    lastName: Optional[str]
    phoneNumber: Optional[str]
    specialties: Optional[List[str]]
    services: Optional[List[str]]
    active: Optional[bool]
    createdAt: date # Update this correctly
    updatedAt: date # Update this correctly
    
    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "_id": "066de609-b04a-4b30-b46c-32537c7f1f6e",
                "email": "user@example.com",
                "password": "password123",
                "role": "therapist",
                "firstName": "John",
                "lastName": "Doe",
                "phoneNumber": "1234567890",
                "specialties": ["specialty1", "specialty2"],
                "services": ["service1", "service2"],
                "active": True,
                "createdAt": "2023-01-01",
                "updatedAt": "2023-01-01"
            }
        } 
         
#Patient
class Patient(BaseModel):
    id: str = Field(default_factory=uuid.uuid4, alias="_id")
    journalNumber: str
    firstName: str
    lastName: str
    cpr: str
    contactInfo: Dict
    emergencyContact: Dict
    insurance: Dict
    consents: Dict
    journal: Dict
    appointments: List[str]
    exercises: List[str]
    createdAt: date
    updatedAt: date

    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "_id": "066de609-b04a-4b30-b46c-32537c7f1f6e",
                "journalNumber": "JN123456",
                "firstName": "Jane",
                "lastName": "Doe",
                "cpr": "123456-7890",
                "contactInfo": {},
                "emergencyContact": {},
                "insurance": {},
                "consents": {},
                "journal": {},
                "appointments": ["appointment1", "appointment2"],
                "exercises": ["exercise1", "exercise2"],
                "createdAt": "2023-01-01",
                "updatedAt": "2023-01-01"
            }
        }

#Patient
class PatientUpdate(BaseModel):
    journalNumber: str
    firstName: str
    lastName: str
    cpr: str
    contactInfo: Dict
    emergencyContact: Dict
    insurance: Dict
    consents: Dict
    journal: Dict
    appointments: List[str]
    exercises: List[str]
    createdAt: date
    updatedAt: date

    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "_id": "066de609-b04a-4b30-b46c-32537c7f1f6e",
                "journalNumber": "JN123456",
                "firstName": "Jane",
                "lastName": "Doe",
                "cpr": "123456-7890",
                "contactInfo": {},
                "emergencyContact": {},
                "insurance": {},
                "consents": {},
                "journal": {},
                "appointments": ["appointment1", "appointment2"],
                "exercises": ["exercise1", "exercise2"],
                "createdAt": "2023-01-01",
                "updatedAt": "2023-01-01"
            }
        }

#JounralEntry
class JournalEntry(BaseModel):
    id: str = Field(default_factory=uuid.uuid4, alias="_id")
    therapistId: str
    date: date
    type: str
    notes: str
    diagnosis: str
    treatment: str
    treatmentPlan: str
    exerciseRecommendations: List[str]
    createdAt: date
    updatedAt: date

    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "_id": "066de609-b04a-4b30-b46c-32537c7f1f6e",
                "therapistId": "therapist123",
                "date": "2023-01-01",
                "type": "initial",
                "notes": "Patient shows improvement...",
                "diagnosis": "Diagnosis details...",
                "treatment": "Treatment details...",
                "treatmentPlan": "Treatment plan details...",
                "exerciseRecommendations": ["exercise1", "exercise2"],
                "createdAt": "2023-01-01",
                "updatedAt": "2023-01-01"
            }
        }
        
class JournalEntryUpdate(BaseModel):
    therapistId: str
    date: date
    type: str
    notes: str
    diagnosis: str
    treatment: str
    treatmentPlan: str
    exerciseRecommendations: List[str]
    createdAt: date
    updatedAt: date

    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "_id": "066de609-b04a-4b30-b46c-32537c7f1f6e",
                "therapistId": "therapist123",
                "date": "2023-01-01",
                "type": "initial",
                "notes": "Patient shows improvement...",
                "diagnosis": "Diagnosis details...",
                "treatment": "Treatment details...",
                "treatmentPlan": "Treatment plan details...",
                "exerciseRecommendations": ["exercise1", "exercise2"],
                "createdAt": "2023-01-01",
                "updatedAt": "2023-01-01"
            }
        }

#JournalDocument
class JournalDocument(BaseModel):
    id: str = Field(default_factory=uuid.uuid4, alias="_id")
    type: str
    filename: str
    uploadDate: date
    path: str
    createdAt: date
    updatedAt: date

    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "_id": "066de609-b04a-4b30-b46c-32537c7f1f6e",
                "type": "pdf",
                "filename": "document.pdf",
                "uploadDate": "2023-01-01",
                "path": "/documents/document.pdf",
                "createdAt": "2023-01-01",
                "updatedAt": "2023-01-01"
            }
        }

class JournalDocumentUpdate(BaseModel):
    id: str = Field(default_factory=uuid.uuid4, alias="_id")
    type: str
    filename: str
    uploadDate: date
    path: str
    createdAt: date
    updatedAt: date

    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "_id": "066de609-b04a-4b30-b46c-32537c7f1f6e",
                "type": "pdf",
                "filename": "document.pdf",
                "uploadDate": "2023-01-01",
                "path": "/documents/document.pdf",
                "createdAt": "2023-01-01",
                "updatedAt": "2023-01-01"
            }
        }


#Appointment
class Appointment(BaseModel):
    id: str = Field(default_factory=uuid.uuid4, alias="_id")
    patientId: str
    therapistId: str
    patientInfo: Dict
    therapistInfo: Dict
    type: str
    startTime: date
    endTime: date
    duration: int
    room: str
    status: str
    notes: str
    reminder: Dict
    invoiceItemId: str
    createdAt: date
    updatedAt: date

    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "_id": "066de609-b04a-4b30-b46c-32537c7f1f6e",
                "patientId": "patient123",
                "therapistId": "therapist123",
                "patientInfo": {},
                "therapistInfo": {},
                "type": "consultation",
                "startTime": "2023-01-01T10:00:00",
                "endTime": "2023-01-01T11:00:00",
                "duration": 60,
                "room": "Room 1",
                "status": "confirmed",
                "notes": "Appointment notes...",
                "reminder": {},
                "invoiceItemId": "invoiceItem123",
                "createdAt": "2023-01-01",
                "updatedAt": "2023-01-01"
            }
        }
    
class AppointmentUpdate(BaseModel):
    id: str = Field(default_factory=uuid.uuid4, alias="_id")
    patientId: str
    therapistId: str
    patientInfo: Dict
    therapistInfo: Dict
    type: str
    startTime: date
    endTime: date
    duration: int
    room: str
    status: str
    notes: str
    reminder: Dict
    invoiceItemId: str
    createdAt: date
    updatedAt: date

    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "_id": "066de609-b04a-4b30-b46c-32537c7f1f6e",
                "patientId": "patient123",
                "therapistId": "therapist123",
                "patientInfo": {},
                "therapistInfo": {},
                "type": "consultation",
                "startTime": "2023-01-01T10:00:00",
                "endTime": "2023-01-01T11:00:00",
                "duration": 60,
                "room": "Room 1",
                "status": "confirmed",
                "notes": "Appointment notes...",
                "reminder": {},
                "invoiceItemId": "invoiceItem123",
                "createdAt": "2023-01-01",
                "updatedAt": "2023-01-01"
            }
        }
        
#GroupClass
class GroupClass(BaseModel):
    id: str = Field(default_factory=uuid.uuid4, alias="_id")
    name: str
    description: str
    therapistId: str
    therapistInfo: Dict
    maxParticipants: int
    room: str
    schedule: Dict
    participants: List[Dict]
    createdAt: date
    updatedAt: date

    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "_id": "066de609-b04a-4b30-b46c-32537c7f1f6e",
                "name": "Yoga Class",
                "description": "A relaxing yoga class...",
                "therapistId": "therapist123",
                "therapistInfo": {},
                "maxParticipants": 10,
                "room": "Room 2",
                "schedule": {},
                "participants": [{}],
                "createdAt": "2023-01-01",
                "updatedAt": "2023-01-01"
            }
        }

class GroupClassUpdate(BaseModel):
    id: str = Field(default_factory=uuid.uuid4, alias="_id")
    name: str
    description: str
    therapistId: str
    therapistInfo: Dict
    maxParticipants: int
    room: str
    schedule: Dict
    participants: List[Dict]
    createdAt: date
    updatedAt: date

    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "_id": "066de609-b04a-4b30-b46c-32537c7f1f6e",
                "name": "Yoga Class",
                "description": "A relaxing yoga class...",
                "therapistId": "therapist123",
                "therapistInfo": {},
                "maxParticipants": 10,
                "room": "Room 2",
                "schedule": {},
                "participants": [{}],
                "createdAt": "2023-01-01",
                "updatedAt": "2023-01-01"
            }
        }        

#Invoice
class Invoice(BaseModel):
    id: str = Field(default_factory=uuid.uuid4, alias="_id")
    invoiceNumber: str
    patientId: str
    patientInfo: Dict
    dates: Dict
    status: str
    amounts: Dict
    payment: Dict
    insurance: Dict
    items: List[Dict]
    notes: str
    createdAt: date
    updatedAt: date

    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "_id": "066de609-b04a-4b30-b46c-32537c7f1f6e",
                "invoiceNumber": "INV123456",
                "patientId": "patient123",
                "patientInfo": {},
                "dates": {},
                "status": "paid",
                "amounts": {},
                "payment": {},
                "insurance": {},
                "items": [{}],
                "notes": "Invoice notes...",
                "createdAt": "2023-01-01",
                "updatedAt": "2023-01-01"
            }
        }
        
class InvoiceUpdate(BaseModel):
    id: str = Field(default_factory=uuid.uuid4, alias="_id")
    invoiceNumber: str
    patientId: str
    patientInfo: Dict
    dates: Dict
    status: str
    amounts: Dict
    payment: Dict
    insurance: Dict
    items: List[Dict]
    notes: str
    createdAt: date
    updatedAt: date

    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "_id": "066de609-b04a-4b30-b46c-32537c7f1f6e",
                "invoiceNumber": "INV123456",
                "patientId": "patient123",
                "patientInfo": {},
                "dates": {},
                "status": "paid",
                "amounts": {},
                "payment": {},
                "insurance": {},
                "items": [{}],
                "notes": "Invoice notes...",
                "createdAt": "2023-01-01",
                "updatedAt": "2023-01-01"
            }
        }

#Exercise
class Exercise(BaseModel):
    id: str = Field(default_factory=uuid.uuid4, alias="_id")
    name: str
    category: str
    description: str
    instructions: List[str]
    difficulty: str
    imageUrl: str
    videoUrl: str
    createdBy: str
    createdAt: date
    updatedAt: date

    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "_id": "066de609-b04a-4b30-b46c-32537c7f1f6e",
                "name": "Push-up",
                "category": "Strength",
                "description": "A basic push-up exercise...",
                "instructions": ["Step 1", "Step 2"],
                "difficulty": "Medium",
                "imageUrl": "http://example.com/image.jpg",
                "videoUrl": "http://example.com/video.mp4",
                "createdBy": "therapist123",
                "createdAt": "2023-01-01",
                "updatedAt": "2023-01-01"
            }
        }

class ExerciseUpdate(BaseModel):
    id: str = Field(default_factory=uuid.uuid4, alias="_id")
    name: str
    category: str
    description: str
    instructions: List[str]
    difficulty: str
    imageUrl: str
    videoUrl: str
    createdBy: str
    createdAt: date
    updatedAt: date

    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "_id": "066de609-b04a-4b30-b46c-32537c7f1f6e",
                "name": "Push-up",
                "category": "Strength",
                "description": "A basic push-up exercise...",
                "instructions": ["Step 1", "Step 2"],
                "difficulty": "Medium",
                "imageUrl": "http://example.com/image.jpg",
                "videoUrl": "http://example.com/video.mp4",
                "createdBy": "therapist123",
                "createdAt": "2023-01-01",
                "updatedAt": "2023-01-01"
            }
        }

#PatientExercise
class PatientExercise(BaseModel):
    id: str = Field(default_factory=uuid.uuid4, alias="_id")
    patientId: str
    patientInfo: Dict
    exerciseId: str
    exerciseInfo: Dict
    journalEntryId: str
    assignedBy: str
    assignedByName: str
    assignedDate: date
    prescription: Dict
    notes: str
    createdAt: date
    updatedAt: date

    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "_id": "066de609-b04a-4b30-b46c-32537c7f1f6e",
                "patientId": "patient123",
                "patientInfo": {},
                "exerciseId": "exercise123",
                "exerciseInfo": {},
                "journalEntryId": "journalEntry123",
                "assignedBy": "therapist123",
                "assignedByName": "John Doe",
                "assignedDate": "2023-01-01",
                "prescription": {},
                "notes": "Exercise notes...",
                "createdAt": "2023-01-01",
                "updatedAt": "2023-01-01"
            }
        }

class PatientExercise(BaseModel):
    id: str = Field(default_factory=uuid.uuid4, alias="_id")
    patientId: str
    patientInfo: Dict
    exerciseId: str
    exerciseInfo: Dict
    journalEntryId: str
    assignedBy: str
    assignedByName: str
    assignedDate: date
    prescription: Dict
    notes: str
    createdAt: date
    updatedAt: date

    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "_id": "066de609-b04a-4b30-b46c-32537c7f1f6e",
                "patientId": "patient123",
                "patientInfo": {},
                "exerciseId": "exercise123",
                "exerciseInfo": {},
                "journalEntryId": "journalEntry123",
                "assignedBy": "therapist123",
                "assignedByName": "John Doe",
                "assignedDate": "2023-01-01",
                "prescription": {},
                "notes": "Exercise notes...",
                "createdAt": "2023-01-01",
                "updatedAt": "2023-01-01"
            }
        }

class ClinicSettings(BaseModel):
    id: str = Field(default_factory=uuid.uuid4, alias="_id")
    clinicName: str
    address: Dict
    contactInfo: Dict
    bankInfo: Dict
    cvr: str
    vatExempt: bool
    businessHours: List[Dict]
    services: List[str]
    updatedAt: date

    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "_id": "066de609-b04a-4b30-b46c-32537c7f1f6e",
                "clinicName": "Health Clinic",
                "address": {},
                "contactInfo": {},
                "bankInfo": {},
                "cvr": "12345678",
                "vatExempt": False,
                "businessHours": [{}],
                "services": ["service1", "service2"],
                "updatedAt": "2023-01-01"
            }
        }

class BusinessHour(BaseModel):
    day: int
    open: str
    close: str

    class Config:
        schema_extra = {
            "example": {
                "day": 1,
                "open": "08:00",
                "close": "17:00"
            }
        }

class Service(BaseModel):
    id: str = Field(default_factory=uuid.uuid4, alias="_id")
    clinicId: str
    type: str
    duration: int
    price: float

    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "_id": "066de609-b04a-4b30-b46c-32537c7f1f6e",
                "clinicId": "clinic123",
                "type": "Consultation",
                "duration": 60,
                "price": 100.0
            }
        }