from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, validator
from typing import List, Optional, Union
import uuid
from datetime import datetime, timezone, time
from enum import Enum


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Helper functions for time handling
def time_to_string(time_obj: Optional[time]) -> str:
    """Convert time object to string format for storage"""
    if time_obj is None:
        return ""
    # Convert to 12-hour format with AM/PM
    hour = time_obj.hour
    minute = time_obj.minute
    am_pm = "AM" if hour < 12 else "PM"
    hour_12 = hour if hour <= 12 else hour - 12
    hour_12 = 12 if hour_12 == 0 else hour_12
    return f"{hour_12}:{minute:02d} {am_pm}"

def string_to_time(time_str: str) -> Optional[time]:
    """Convert string format to time object"""
    if not time_str or time_str == "":
        return None
    try:
        # Parse formats like "10:30 AM" or "2:15 PM"
        time_str = time_str.strip()
        if " " in time_str:
            time_part, am_pm = time_str.rsplit(" ", 1)
            hour_str, minute_str = time_part.split(":")
            hour = int(hour_str)
            minute = int(minute_str)
            
            # Convert to 24-hour format
            if am_pm.upper() == "PM" and hour != 12:
                hour += 12
            elif am_pm.upper() == "AM" and hour == 12:
                hour = 0
                
            return time(hour, minute)
        else:
            # Handle format without AM/PM (assume 24-hour format)
            hour_str, minute_str = time_str.split(":")
            return time(int(hour_str), int(minute_str))
    except (ValueError, AttributeError):
        return None

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

# Exercise Builder Models
class ExerciseBuilder(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    # Step 1: Exercise
    exercise_image: Optional[str] = None
    exercise_name: str
    exercise_type: str  # Table Top, Drill, Functional, Full Scale Exercise, No-Notice Exercise, Real World Event
    exercise_description: str
    location: str
    start_date: datetime
    start_time: str
    end_date: datetime
    end_time: str
    
    # Step 2: Scope
    scope_description: str = ""
    scope_hazards: str = ""
    scope_geographic_area: str = ""
    scope_functions: str = ""
    scope_organizations: str = ""
    scope_personnel: str = ""
    scope_exercise_type: str = ""  # Copy from exercise_type
    
    # Step 3: Purpose
    purpose_description: str = ""
    
    # Step 4: Scenario
    scenario_image: Optional[str] = None
    scenario_name: str = ""
    scenario_description: str = ""
    scenario_latitude: float = 0.0
    scenario_longitude: float = 0.0
    
    # Step 5: Goals
    goals: List[dict] = Field(default_factory=list)
    
    # Step 6: Objectives
    objectives: List[dict] = Field(default_factory=list)
    
    # Step 7: Events
    events: List[dict] = Field(default_factory=list)
    
    # Step 8: Functions
    functions: List[dict] = Field(default_factory=list)
    
    # Step 9: Injections (MSEL integration)
    injections: List[dict] = Field(default_factory=list)
    
    # Step 10: Organizations
    organizations: List[dict] = Field(default_factory=list)
    
    # Step 11: Team Coordinators
    coordinators: List[dict] = Field(default_factory=list)
    
    # Step 12: Code Words
    codeWords: List[dict] = Field(default_factory=list)
    
    # Step 13: Callsigns
    callsigns: List[dict] = Field(default_factory=list)
    
    # Step 14: Communication Frequencies
    frequencies: List[dict] = Field(default_factory=list)
    
    # Step 15: Assumptions
    assumptions: List[dict] = Field(default_factory=list)
    
    # Step 16: Artificialities
    artificialities: List[dict] = Field(default_factory=list)
    
    # Step 17: Safety Concerns
    safetyConcerns: List[dict] = Field(default_factory=list)
    
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ExerciseBuilderCreate(BaseModel):
    exercise_image: Optional[str] = None
    exercise_name: str
    exercise_type: str
    exercise_description: str
    location: str
    start_date: datetime
    start_time: str
    end_date: datetime
    end_time: str
    scope_description: str = ""
    scope_hazards: str = ""
    scope_geographic_area: str = ""
    scope_functions: str = ""
    scope_organizations: str = ""
    scope_personnel: str = ""
    scope_exercise_type: str = ""
    purpose_description: str = ""
    scenario_image: Optional[str] = None
    scenario_name: str = ""
    scenario_description: str = ""
    scenario_latitude: float = 0.0
    scenario_longitude: float = 0.0
    goals: List[dict] = Field(default_factory=list)
    objectives: List[dict] = Field(default_factory=list)
    events: List[dict] = Field(default_factory=list)
    functions: List[dict] = Field(default_factory=list)
    injections: List[dict] = Field(default_factory=list)
    organizations: List[dict] = Field(default_factory=list)
    coordinators: List[dict] = Field(default_factory=list)
    codeWords: List[dict] = Field(default_factory=list)
    callsigns: List[dict] = Field(default_factory=list)
    frequencies: List[dict] = Field(default_factory=list)
    assumptions: List[dict] = Field(default_factory=list)
    artificialities: List[dict] = Field(default_factory=list)
    safetyConcerns: List[dict] = Field(default_factory=list)

class ExerciseBuilderUpdate(BaseModel):
    exercise_image: Optional[str] = None
    exercise_name: Optional[str] = None
    exercise_type: Optional[str] = None
    exercise_description: Optional[str] = None
    location: Optional[str] = None
    start_date: Optional[datetime] = None
    start_time: Optional[str] = None
    end_date: Optional[datetime] = None
    end_time: Optional[str] = None
    scope_description: Optional[str] = None
    scope_hazards: Optional[str] = None
    scope_geographic_area: Optional[str] = None
    scope_functions: Optional[str] = None
    scope_organizations: Optional[str] = None
    scope_personnel: Optional[str] = None
    scope_exercise_type: Optional[str] = None
    purpose_description: Optional[str] = None
    scenario_image: Optional[str] = None
    scenario_name: Optional[str] = None
    scenario_description: Optional[str] = None
    scenario_latitude: Optional[float] = None
    scenario_longitude: Optional[float] = None
    goals: Optional[List[dict]] = None
    objectives: Optional[List[dict]] = None
    events: Optional[List[dict]] = None
    functions: Optional[List[dict]] = None
    injections: Optional[List[dict]] = None
    organizations: Optional[List[dict]] = None
    coordinators: Optional[List[dict]] = None
    codeWords: Optional[List[dict]] = None
    callsigns: Optional[List[dict]] = None
    frequencies: Optional[List[dict]] = None
    assumptions: Optional[List[dict]] = None
    artificialities: Optional[List[dict]] = None
    safetyConcerns: Optional[List[dict]] = None

# Exercise Components Models
class ExerciseGoal(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    exercise_id: str
    name: str
    description: str
    achieved: str = "No"  # Yes, Partial, No
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ExerciseObjective(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    exercise_id: str
    name: str
    description: str
    achieved: str = "No"  # Yes, Partial, No
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ExerciseEvent(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    exercise_id: str
    event_image: Optional[str] = None
    name: str
    description: str
    anticipated_actions: str
    latitude: float = 0.0
    longitude: float = 0.0
    start_date: datetime
    start_time: str
    end_date: datetime
    end_time: str
    tier_scale: str  # Tier 1: Incident, Tier 2: Emergency, Tier 3: Disaster
    escalation_value: str  # None, Low, Confirm, Warning, Danger
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ExerciseFunction(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    exercise_id: str
    name: str
    description: str
    achieved: str = "No"  # Yes, Partial, No
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ExerciseOrganization(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    exercise_id: str
    org_image: Optional[str] = None
    name: str
    description: str
    home_base: str
    contact_first_name: str
    contact_last_name: str
    contact_cell_phone: str
    contact_email: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ExerciseCodeWord(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    exercise_id: str
    code_image: Optional[str] = None
    code_word: str
    definition: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ExerciseCallsign(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    exercise_id: str
    callsign_image: Optional[str] = None
    callsign: str
    definition: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ExerciseCommFreq(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    exercise_id: str
    freq_image: Optional[str] = None
    name: str
    description: str
    frequency: str
    tone: str  # 71.9, 74.4, etc.
    offset: str  # Negative, Positive, Simplex
    channel: str
    radio_type: str  # Handheld, Mobile, Base Station, Repeater
    location: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ExerciseAssumption(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    exercise_id: str
    assumption_image: Optional[str] = None
    name: str
    assumption: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ExerciseArtificiality(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    exercise_id: str
    artificiality_image: Optional[str] = None
    name: str
    artificiality: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ExerciseSafety(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    exercise_id: str
    safety_image: Optional[str] = None
    name: str
    safety_concern: str
    safety_officer_first_name: str = ""
    safety_officer_last_name: str = ""
    safety_officer_cell_phone: str = ""
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

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
    role: str = ""  # Changed from ParticipantRole enum to string for flexibility
    experience_level: str = ""
    certifications: List[str] = []
    # Enhanced fields
    firstName: str = ""
    lastName: str = ""
    position: str = ""
    assignedTo: str = ""
    city: str = ""
    provinceState: str = ""
    country: str = "Canada"
    homePhone: str = ""
    cellPhone: str = ""
    latitude: str = ""
    longitude: str = ""
    involvedInExercise: bool = False
    profileImage: Optional[str] = None  # Base64 encoded image
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ParticipantCreate(BaseModel):
    name: str
    email: str
    phone: str
    address: str = ""
    organization: str = ""
    role: str = ""  # Changed from ParticipantRole enum to string for flexibility
    experience_level: str = ""
    certifications: List[str] = []
    # Enhanced fields
    firstName: str = ""
    lastName: str = ""
    position: str = ""
    assignedTo: str = ""
    city: str = ""
    provinceState: str = ""
    country: str = "Canada"
    homePhone: str = ""
    cellPhone: str = ""
    latitude: str = ""
    longitude: str = ""
    involvedInExercise: bool = False
# Scribe Template Models
class ScribeTemplateEvent(BaseModel):
    time: Optional[Union[time, str]] = None
    event: str = ""
    observations: str = ""
    
    @validator('time', pre=True)
    def parse_time(cls, v):
        if v is None or v == "":
            return None
        if isinstance(v, time):
            return v
        if isinstance(v, str):
            return string_to_time(v)
        return v
    
    class Config:
        json_encoders = {
            time: time_to_string
        }

class ScribeTemplateCommunication(BaseModel):
    time: Optional[Union[time, str]] = None
    from_person: str = ""
    to_person: str = ""
    message: str = ""
    method: str = ""  # Radio, Phone, Face-to-face, etc.
    content: str = ""  # Longtext field for detailed content
    
    @validator('time', pre=True)
    def parse_time(cls, v):
        if v is None or v == "":
            return None
        if isinstance(v, time):
            return v
        if isinstance(v, str):
            return string_to_time(v)
        return v
    
    class Config:
        json_encoders = {
            time: time_to_string
        }

class ScribeTemplateDecision(BaseModel):
    time: Optional[Union[time, str]] = None
    decision: str = ""
    decision_maker: str = ""
    rationale: str = ""
    
    @validator('time', pre=True)
    def parse_time(cls, v):
        if v is None or v == "":
            return None
        if isinstance(v, time):
            return v
        if isinstance(v, str):
            return string_to_time(v)
        return v
    
    class Config:
        json_encoders = {
            time: time_to_string
        }

class ScribeTemplateIssue(BaseModel):
    time: Optional[Union[time, str]] = None
    issue: str = ""
    severity: str = ""  # Low, Medium, High, Critical
    resolution: str = ""
    
    @validator('time', pre=True)
    def parse_time(cls, v):
        if v is None or v == "":
            return None
        if isinstance(v, time):
            return v
        if isinstance(v, str):
            return string_to_time(v)
        return v
    
    class Config:
        json_encoders = {
            time: time_to_string
        }

class ScribeTemplateParticipantObs(BaseModel):
    participant: str = ""
    role: str = ""
    performance: str = ""
    notes: str = ""

class ScribeTemplate(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    exercise_id: str
    scribe_name: str = ""
    scribe_signature: str = ""
    exercise_start_time: Optional[Union[time, str]] = None
    exercise_end_time: Optional[Union[time, str]] = None
    
    @validator('exercise_start_time', pre=True)
    def parse_start_time(cls, v):
        if v is None or v == "":
            return None
        if isinstance(v, time):
            return v
        if isinstance(v, str):
            return string_to_time(v)
        return v
    
    @validator('exercise_end_time', pre=True)
    def parse_end_time(cls, v):
        if v is None or v == "":
            return None
        if isinstance(v, time):
            return v
        if isinstance(v, str):
            return string_to_time(v)
        return v
    
    class Config:
        json_encoders = {
            time: time_to_string
        }
    
    # Timeline & Key Events
    timeline_events: List[ScribeTemplateEvent] = Field(default_factory=list)
    
    # Communications Log
    communications: List[ScribeTemplateCommunication] = Field(default_factory=list)
    
    # Decision Points & Actions
    decisions: List[ScribeTemplateDecision] = Field(default_factory=list)
    
    # Issues & Challenges
    issues: List[ScribeTemplateIssue] = Field(default_factory=list)
    
    # Participant Performance
    participant_observations: List[ScribeTemplateParticipantObs] = Field(default_factory=list)
    
    # Additional Notes
    additional_notes: str = ""
    
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ScribeTemplateCreate(BaseModel):
    exercise_id: str
    scribe_name: str = ""
    scribe_signature: str = ""
    exercise_start_time: Optional[Union[time, str]] = None
    exercise_end_time: Optional[Union[time, str]] = None
    timeline_events: List[ScribeTemplateEvent] = Field(default_factory=list)
    communications: List[ScribeTemplateCommunication] = Field(default_factory=list)
    decisions: List[ScribeTemplateDecision] = Field(default_factory=list)
    issues: List[ScribeTemplateIssue] = Field(default_factory=list)
    participant_observations: List[ScribeTemplateParticipantObs] = Field(default_factory=list)
    additional_notes: str = ""
    
    @validator('exercise_start_time', pre=True)
    def parse_start_time(cls, v):
        if v is None or v == "":
            return None
        if isinstance(v, time):
            return v
        if isinstance(v, str):
            return string_to_time(v)
        return v
    
    @validator('exercise_end_time', pre=True)
    def parse_end_time(cls, v):
        if v is None or v == "":
            return None
        if isinstance(v, time):
            return v
        if isinstance(v, str):
            return string_to_time(v)
        return v
    
    class Config:
        json_encoders = {
            time: time_to_string
        }

class ScribeTemplateUpdate(BaseModel):
    scribe_name: Optional[str] = None
    scribe_signature: Optional[str] = None
    exercise_start_time: Optional[Union[time, str]] = None
    exercise_end_time: Optional[Union[time, str]] = None
    timeline_events: Optional[List[ScribeTemplateEvent]] = None
    communications: Optional[List[ScribeTemplateCommunication]] = None
    decisions: Optional[List[ScribeTemplateDecision]] = None
    issues: Optional[List[ScribeTemplateIssue]] = None
    participant_observations: Optional[List[ScribeTemplateParticipantObs]] = None
    additional_notes: Optional[str] = None
    
    @validator('exercise_start_time', pre=True)
    def parse_start_time(cls, v):
        if v is None or v == "":
            return None
        if isinstance(v, time):
            return v
        if isinstance(v, str):
            return string_to_time(v)
        return v
    
    @validator('exercise_end_time', pre=True)
    def parse_end_time(cls, v):
        if v is None or v == "":
            return None
        if isinstance(v, time):
            return v
        if isinstance(v, str):
            return string_to_time(v)
        return v
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

# Exercise Builder Routes
@api_router.get("/exercise-builder", response_model=List[ExerciseBuilder])
async def get_exercises():
    exercises = await db.exercise_builder.find().to_list(1000)
    return [ExerciseBuilder(**parse_from_mongo(exercise)) for exercise in exercises]

@api_router.get("/exercise-builder/{exercise_id}", response_model=ExerciseBuilder)
async def get_exercise(exercise_id: str):
    exercise = await db.exercise_builder.find_one({"id": exercise_id})
    if not exercise:
        raise HTTPException(status_code=404, detail="Exercise not found")
    return ExerciseBuilder(**parse_from_mongo(exercise))

@api_router.post("/exercise-builder", response_model=ExerciseBuilder)
async def create_exercise(exercise_data: ExerciseBuilderCreate):
    exercise = ExerciseBuilder(**exercise_data.dict())
    # Auto-copy exercise type to scope
    exercise.scope_exercise_type = exercise.exercise_type
    exercise_mongo = prepare_for_mongo(exercise.dict())
    await db.exercise_builder.insert_one(exercise_mongo)
    return exercise

@api_router.put("/exercise-builder/{exercise_id}", response_model=ExerciseBuilder)
async def update_exercise(exercise_id: str, exercise_data: ExerciseBuilderCreate):
    update_dict = exercise_data.dict()
    update_dict["updated_at"] = datetime.now(timezone.utc)
    # Auto-copy exercise type to scope if provided
    if update_dict.get("exercise_type"):
        update_dict["scope_exercise_type"] = update_dict["exercise_type"]
    update_mongo = prepare_for_mongo(update_dict)
    
    result = await db.exercise_builder.update_one(
        {"id": exercise_id},
        {"$set": update_mongo}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Exercise not found")
    
    return await get_exercise(exercise_id)

@api_router.delete("/exercise-builder/{exercise_id}")
async def delete_exercise(exercise_id: str):
    result = await db.exercise_builder.delete_one({"id": exercise_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Exercise not found")
    return {"message": "Exercise deleted successfully"}

# Exercise Components Routes
@api_router.get("/exercise-goals/{exercise_id}", response_model=List[ExerciseGoal])
async def get_exercise_goals(exercise_id: str):
    goals = await db.exercise_goals.find({"exercise_id": exercise_id}).to_list(1000)
    return [ExerciseGoal(**parse_from_mongo(goal)) for goal in goals]

@api_router.post("/exercise-goals", response_model=ExerciseGoal)
async def create_exercise_goal(goal_data: dict):
    goal = ExerciseGoal(**goal_data)
    goal_mongo = prepare_for_mongo(goal.dict())
    await db.exercise_goals.insert_one(goal_mongo)
    return goal

@api_router.get("/exercise-objectives/{exercise_id}", response_model=List[ExerciseObjective])
async def get_exercise_objectives(exercise_id: str):
    objectives = await db.exercise_objectives.find({"exercise_id": exercise_id}).to_list(1000)
    return [ExerciseObjective(**parse_from_mongo(obj)) for obj in objectives]

@api_router.post("/exercise-objectives", response_model=ExerciseObjective)
async def create_exercise_objective(objective_data: dict):
    objective = ExerciseObjective(**objective_data)
    objective_mongo = prepare_for_mongo(objective.dict())
    await db.exercise_objectives.insert_one(objective_mongo)
    return objective

@api_router.get("/exercise-events/{exercise_id}", response_model=List[ExerciseEvent])
async def get_exercise_events(exercise_id: str):
    events = await db.exercise_events.find({"exercise_id": exercise_id}).to_list(1000)
    return [ExerciseEvent(**parse_from_mongo(event)) for event in events]

@api_router.post("/exercise-events", response_model=ExerciseEvent)
async def create_exercise_event(event_data: dict):
    event = ExerciseEvent(**event_data)
    event_mongo = prepare_for_mongo(event.dict())
    await db.exercise_events.insert_one(event_mongo)
    return event

@api_router.get("/exercise-functions/{exercise_id}", response_model=List[ExerciseFunction])
async def get_exercise_functions(exercise_id: str):
    functions = await db.exercise_functions.find({"exercise_id": exercise_id}).to_list(1000)
    return [ExerciseFunction(**parse_from_mongo(func)) for func in functions]

@api_router.post("/exercise-functions", response_model=ExerciseFunction)
async def create_exercise_function(function_data: dict):
    function = ExerciseFunction(**function_data)
    function_mongo = prepare_for_mongo(function.dict())
    await db.exercise_functions.insert_one(function_mongo)
    return function

@api_router.get("/exercise-organizations/{exercise_id}", response_model=List[ExerciseOrganization])
async def get_exercise_organizations(exercise_id: str):
    orgs = await db.exercise_organizations.find({"exercise_id": exercise_id}).to_list(1000)
    return [ExerciseOrganization(**parse_from_mongo(org)) for org in orgs]

@api_router.post("/exercise-organizations", response_model=ExerciseOrganization)
async def create_exercise_organization(org_data: dict):
    org = ExerciseOrganization(**org_data)
    org_mongo = prepare_for_mongo(org.dict())
    await db.exercise_organizations.insert_one(org_mongo)
    return org

# Get Team Coordinators (from participants with specific role)
@api_router.get("/team-coordinators/{exercise_id}")
async def get_team_coordinators(exercise_id: str):
    # Find participants marked as involved in exercise and with coordinator roles
    participants = await db.participants.find({
        "involvedInExercise": True,
        "$or": [
            {"role": "incident_commander"},
            {"role": "operations_chief"},
            {"role": "planning_chief"},
            {"role": "logistics_chief"},
            {"role": "finance_chief"},
            {"position": {"$regex": "coordinator", "$options": "i"}}
        ]
    }).to_list(1000)
    return [Participant(**parse_from_mongo(p)) for p in participants]

# Get Safety Officer
@api_router.get("/safety-officer")
async def get_safety_officer():
    safety_officer = await db.participants.find_one({
        "involvedInExercise": True,
        "$or": [
            {"role": "safety_officer"},
            {"position": {"$regex": "safety officer", "$options": "i"}}
        ]
    })
    if safety_officer:
        return Participant(**parse_from_mongo(safety_officer))
    return None
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

# Scribe Template endpoints
@api_router.post("/scribe-templates", response_model=ScribeTemplate)
async def create_scribe_template(template: ScribeTemplateCreate):
    try:
        template_dict = template.dict()
        template_dict['id'] = str(uuid.uuid4())
        template_dict['created_at'] = datetime.now(timezone.utc)
        template_dict['updated_at'] = datetime.now(timezone.utc)
        
        # Convert time objects to strings for MongoDB storage
        mongo_data = prepare_scribe_data_for_mongo(template_dict)
        
        result = await db.scribe_templates.insert_one(mongo_data)
        
        if result.inserted_id:
            created_template = await db.scribe_templates.find_one({"id": template_dict['id']})
            # Convert back to time objects for response
            response_data = parse_scribe_data_from_mongo(created_template)
            return ScribeTemplate(**response_data)
        else:
            raise HTTPException(status_code=400, detail="Failed to create scribe template")
    except Exception as e:
        logger.error(f"Error creating scribe template: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/scribe-templates", response_model=List[ScribeTemplate])
async def get_scribe_templates():
    try:
        templates = await db.scribe_templates.find().to_list(length=None)
        # Convert time strings back to time objects for each template
        parsed_templates = [parse_scribe_data_from_mongo(template) for template in templates]
        return [ScribeTemplate(**template) for template in parsed_templates]
    except Exception as e:
        logger.error(f"Error fetching scribe templates: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/scribe-templates/exercise/{exercise_id}", response_model=List[ScribeTemplate])
async def get_scribe_templates_by_exercise(exercise_id: str):
    try:
        templates = await db.scribe_templates.find({"exercise_id": exercise_id}).to_list(length=None)
        # Convert time strings back to time objects for each template
        parsed_templates = [parse_scribe_data_from_mongo(template) for template in templates]
        return [ScribeTemplate(**template) for template in parsed_templates]
    except Exception as e:
        logger.error(f"Error fetching scribe templates for exercise {exercise_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/scribe-templates/{template_id}", response_model=ScribeTemplate)
async def get_scribe_template(template_id: str):
    try:
        template = await db.scribe_templates.find_one({"id": template_id})
        if not template:
            raise HTTPException(status_code=404, detail="Scribe template not found")
        # Convert time strings back to time objects
        response_data = parse_scribe_data_from_mongo(template)
        return ScribeTemplate(**response_data)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching scribe template {template_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.put("/scribe-templates/{template_id}", response_model=ScribeTemplate)
async def update_scribe_template(template_id: str, template_update: ScribeTemplateUpdate):
    try:
        update_data = {k: v for k, v in template_update.dict().items() if v is not None}
        update_data['updated_at'] = datetime.now(timezone.utc)
        
        # Convert time objects to strings for MongoDB storage
        mongo_update_data = prepare_scribe_data_for_mongo(update_data)
        
        result = await db.scribe_templates.update_one(
            {"id": template_id},
            {"$set": mongo_update_data}
        )
        
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Scribe template not found")
        
        updated_template = await db.scribe_templates.find_one({"id": template_id})
        # Convert time strings back to time objects for response
        response_data = parse_scribe_data_from_mongo(updated_template)
        return ScribeTemplate(**response_data)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating scribe template {template_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.delete("/scribe-templates/{template_id}")
async def delete_scribe_template(template_id: str):
    try:
        result = await db.scribe_templates.delete_one({"id": template_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Scribe template not found")
        return {"message": "Scribe template deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting scribe template {template_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))

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

def prepare_scribe_data_for_mongo(data: dict) -> dict:
    """Convert time objects to strings for MongoDB storage"""
    prepared_data = data.copy()
    
    # Convert main time fields
    if 'exercise_start_time' in prepared_data:
        prepared_data['exercise_start_time'] = time_to_string(prepared_data['exercise_start_time'])
    if 'exercise_end_time' in prepared_data:
        prepared_data['exercise_end_time'] = time_to_string(prepared_data['exercise_end_time'])
    
    # Convert nested time fields
    for field_name in ['timeline_events', 'communications', 'decisions', 'issues']:
        if field_name in prepared_data and prepared_data[field_name]:
            for item in prepared_data[field_name]:
                if 'time' in item:
                    item['time'] = time_to_string(item['time'])
    
    return prepared_data

def parse_scribe_data_from_mongo(data: dict) -> dict:
    """Convert string time fields back to time objects"""
    parsed_data = data.copy()
    
    # Convert main time fields
    if 'exercise_start_time' in parsed_data:
        parsed_data['exercise_start_time'] = string_to_time(parsed_data['exercise_start_time'])
    if 'exercise_end_time' in parsed_data:
        parsed_data['exercise_end_time'] = string_to_time(parsed_data['exercise_end_time'])
    
    # Convert nested time fields
    for field_name in ['timeline_events', 'communications', 'decisions', 'issues']:
        if field_name in parsed_data and parsed_data[field_name]:
            for item in parsed_data[field_name]:
                if 'time' in item:
                    item['time'] = string_to_time(item['time'])
    
    return parsed_data

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()