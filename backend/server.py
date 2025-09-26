from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, timezone
from enum import Enum


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Enums
class ThreatLevel(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class ExerciseStatus(str, Enum):
    DRAFT = "draft"
    PLANNED = "planned"
    ACTIVE = "active"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class ParticipantRole(str, Enum):
    INCIDENT_COMMANDER = "incident_commander"
    OPERATIONS_CHIEF = "operations_chief"
    PLANNING_CHIEF = "planning_chief"
    LOGISTICS_CHIEF = "logistics_chief"
    FINANCE_CHIEF = "finance_chief"
    SAFETY_OFFICER = "safety_officer"
    LIAISON_OFFICER = "liaison_officer"
    PUBLIC_INFO_OFFICER = "public_info_officer"
    OBSERVER = "observer"
    EVALUATOR = "evaluator"

# Exercise Models
class Exercise(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str
    start_date: datetime
    end_date: datetime
    status: ExerciseStatus = ExerciseStatus.DRAFT
    scenarios: List[str] = []
    goals: List[str] = []
    objectives: List[str] = []
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ExerciseCreate(BaseModel):
    name: str
    description: str
    start_date: datetime
    end_date: datetime
    scenarios: List[str] = []
    goals: List[str] = []
    objectives: List[str] = []

class ExerciseUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    status: Optional[ExerciseStatus] = None
    scenarios: Optional[List[str]] = None
    goals: Optional[List[str]] = None
    objectives: Optional[List[str]] = None

# MSEL Models
class MSELEvent(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    exercise_id: str = ""  # Optional - link to specific exercise
    event_number: int
    scenario_time: str  # Time format: "HH:MM" or descriptive like "T+30 minutes"
    event_type: str
    inject_mode: str
    from_entity: str
    to_entity: str
    message: str
    expected_response: str
    objective_capability_task: str
    notes: str = ""
    completed: bool = False
    actual_time: Optional[str] = None  # When event actually occurred
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class MSELEventCreate(BaseModel):
    exercise_id: str = ""
    event_number: int
    scenario_time: str
    event_type: str
    inject_mode: str
    from_entity: str
    to_entity: str
    message: str
    expected_response: str
    objective_capability_task: str
    notes: str = ""

class MSELEventUpdate(BaseModel):
    event_number: Optional[int] = None
    scenario_time: Optional[str] = None
    event_type: Optional[str] = None
    inject_mode: Optional[str] = None
    from_entity: Optional[str] = None
    to_entity: Optional[str] = None
    message: Optional[str] = None
    expected_response: Optional[str] = None
    objective_capability_task: Optional[str] = None
    notes: Optional[str] = None
    completed: Optional[bool] = None
    actual_time: Optional[str] = None

# HIRA Models
class HIRAEntry(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str
    notes: str = ""
    disaster_type: str
    latitude: float = 0.0
    longitude: float = 0.0
    # Risk Assessment Categories
    frequency: int  # 1-6
    fatalities: int  # 0-4
    injuries: int  # 0-3
    evacuation: int  # 0-3
    property_damage: int  # 0-3
    critical_infrastructure: int  # 0-3
    environmental_damage: int  # 0-3
    business_financial_impact: int  # 0-2
    psychosocial_impact: int  # 0-2
    # Change factors (checkboxes as boolean lists)
    change_in_frequency: List[bool] = [False, False, False, False]  # 4 checkboxes
    change_in_vulnerability: List[bool] = [False, False, False]  # 3 checkboxes
    # Image upload
    hazard_image: Optional[str] = None  # Base64 encoded image
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class HIRAEntryCreate(BaseModel):
    name: str
    description: str
    notes: str = ""
    disaster_type: str
    latitude: float = 0.0
    longitude: float = 0.0
    frequency: int
    fatalities: int
    injuries: int
    evacuation: int
    property_damage: int
    critical_infrastructure: int
    environmental_damage: int
    business_financial_impact: int
    psychosocial_impact: int
    change_in_frequency: List[bool] = [False, False, False, False]
    change_in_vulnerability: List[bool] = [False, False, False]
    hazard_image: Optional[str] = None

# Participant Models
class Participant(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    phone: str
    address: str = ""
    organization: str = ""
    role: ParticipantRole
    experience_level: str = ""
    certifications: List[str] = []
    # Enhanced fields
    firstName: str = ""
    lastName: str = ""
    position: str = ""
    city: str = ""
    provinceState: str = ""
    country: str = "Canada"
    homePhone: str = ""
    cellPhone: str = ""
    involvedInExercise: bool = False
    profileImage: Optional[str] = None  # Base64 encoded image
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ParticipantCreate(BaseModel):
    name: str
    email: str
    phone: str
    address: str = ""
    organization: str = ""
    role: ParticipantRole
    experience_level: str = ""
    certifications: List[str] = []
    # Enhanced fields
    firstName: str = ""
    lastName: str = ""
    position: str = ""
    city: str = ""
    provinceState: str = ""
    country: str = "Canada"
    homePhone: str = ""
    cellPhone: str = ""
    involvedInExercise: bool = False
    profileImage: Optional[str] = None

# Helper functions
def prepare_for_mongo(data):
    if isinstance(data, dict):
        for key, value in data.items():
            if isinstance(value, datetime):
                data[key] = value.isoformat()
    return data

def parse_from_mongo(item):
    if isinstance(item, dict):
        for key, value in item.items():
            if isinstance(value, str) and 'T' in value:
                try:
                    item[key] = datetime.fromisoformat(value.replace('Z', '+00:00'))
                except:
                    pass
    return item

# MSEL Routes
@api_router.get("/msel", response_model=List[MSELEvent])
async def get_msel_events():
    events = await db.msel_events.find().to_list(1000)
    return [MSELEvent(**parse_from_mongo(event)) for event in events]

@api_router.get("/msel/{exercise_id}", response_model=List[MSELEvent])
async def get_msel_events_by_exercise(exercise_id: str):
    events = await db.msel_events.find({"exercise_id": exercise_id}).to_list(1000)
    return [MSELEvent(**parse_from_mongo(event)) for event in events]

@api_router.get("/msel/event/{event_id}", response_model=MSELEvent)
async def get_msel_event(event_id: str):
    event = await db.msel_events.find_one({"id": event_id})
    if not event:
        raise HTTPException(status_code=404, detail="MSEL event not found")
    return MSELEvent(**parse_from_mongo(event))

@api_router.post("/msel", response_model=MSELEvent)
async def create_msel_event(event_data: MSELEventCreate):
    event = MSELEvent(**event_data.dict())
    event_mongo = prepare_for_mongo(event.dict())
    await db.msel_events.insert_one(event_mongo)
    return event

@api_router.put("/msel/event/{event_id}", response_model=MSELEvent)
async def update_msel_event(event_id: str, event_data: MSELEventUpdate):
    update_dict = {k: v for k, v in event_data.dict().items() if v is not None}
    update_dict["updated_at"] = datetime.now(timezone.utc)
    update_mongo = prepare_for_mongo(update_dict)
    
    result = await db.msel_events.update_one(
        {"id": event_id},
        {"$set": update_mongo}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="MSEL event not found")
    
    return await get_msel_event(event_id)

@api_router.delete("/msel/event/{event_id}")
async def delete_msel_event(event_id: str):
    result = await db.msel_events.delete_one({"id": event_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="MSEL event not found")
    return {"message": "MSEL event deleted successfully"}

# HIRA Routes
@api_router.get("/hira", response_model=List[HIRAEntry])
async def get_hira_entries():
    entries = await db.hira_entries.find().to_list(1000)
    return [HIRAEntry(**parse_from_mongo(entry)) for entry in entries]

@api_router.get("/hira/{entry_id}", response_model=HIRAEntry)
async def get_hira_entry(entry_id: str):
    entry = await db.hira_entries.find_one({"id": entry_id})
    if not entry:
        raise HTTPException(status_code=404, detail="HIRA entry not found")
    return HIRAEntry(**parse_from_mongo(entry))

@api_router.post("/hira", response_model=HIRAEntry)
async def create_hira_entry(entry_data: HIRAEntryCreate):
    entry = HIRAEntry(**entry_data.dict())
    entry_mongo = prepare_for_mongo(entry.dict())
    await db.hira_entries.insert_one(entry_mongo)
    return entry

@api_router.put("/hira/{entry_id}", response_model=HIRAEntry)
async def update_hira_entry(entry_id: str, entry_data: HIRAEntryCreate):
    update_mongo = prepare_for_mongo(entry_data.dict())
    result = await db.hira_entries.update_one(
        {"id": entry_id},
        {"$set": update_mongo}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="HIRA entry not found")
    return await get_hira_entry(entry_id)

@api_router.delete("/hira/{entry_id}")
async def delete_hira_entry(entry_id: str):
    result = await db.hira_entries.delete_one({"id": entry_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="HIRA entry not found")
    return {"message": "HIRA entry deleted successfully"}

# Participant Routes
@api_router.get("/participants", response_model=List[Participant])
async def get_participants():
    participants = await db.participants.find().to_list(1000)
    return [Participant(**parse_from_mongo(participant)) for participant in participants]

@api_router.post("/participants", response_model=Participant)
async def create_participant(participant_data: ParticipantCreate):
    participant = Participant(**participant_data.dict())
    participant_mongo = prepare_for_mongo(participant.dict())
    await db.participants.insert_one(participant_mongo)
    return participant

@api_router.get("/participants/{participant_id}", response_model=Participant)
async def get_participant(participant_id: str):
    participant = await db.participants.find_one({"id": participant_id})
    if not participant:
        raise HTTPException(status_code=404, detail="Participant not found")
    return Participant(**parse_from_mongo(participant))

@api_router.put("/participants/{participant_id}", response_model=Participant)
async def update_participant(participant_id: str, participant_data: ParticipantCreate):
    update_mongo = prepare_for_mongo(participant_data.dict())
    result = await db.participants.update_one(
        {"id": participant_id},
        {"$set": update_mongo}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Participant not found")
    return await get_participant(participant_id)

@api_router.delete("/participants/{participant_id}")
async def delete_participant(participant_id: str):
    result = await db.participants.delete_one({"id": participant_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Participant not found")
    return {"message": "Participant deleted successfully"}

# Health check
@api_router.get("/")
async def root():
    return {"message": "EXRSIM API is running"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()