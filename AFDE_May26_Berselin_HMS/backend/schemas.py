from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from enum import Enum


class PriorityEnum(str, Enum):
    low = "Low"
    medium = "Medium"
    high = "High"
    critical = "Critical"


class StatusEnum(str, Enum):
    open = "Open"
    in_progress = "In Progress"
    resolved = "Resolved"
    rejected = "Rejected"


class CategoryEnum(str, Enum):
    vpn = "VPN Issue"
    password = "Password Reset"
    software = "Software Installation"
    laptop = "Laptop Issue"
    email = "Email Access"
    network = "Network Connectivity"
    hardware = "Hardware Request"
    other = "Other"


class TicketCreate(BaseModel):
    employee_name: str = Field(..., min_length=1, max_length=100)
    department: str = Field(..., min_length=1, max_length=100)
    issue_category: CategoryEnum
    description: str = Field(..., min_length=5)
    priority: PriorityEnum = PriorityEnum.medium


class TicketUpdate(BaseModel):
    employee_name: Optional[str] = None
    department: Optional[str] = None
    issue_category: Optional[CategoryEnum] = None
    description: Optional[str] = None
    priority: Optional[PriorityEnum] = None
    status: Optional[StatusEnum] = None
    resolution_notes: Optional[str] = None
    changed_by: Optional[str] = None


class TicketActivityResponse(BaseModel):
    id: int
    changed_by: str
    from_status: Optional[str]
    to_status: str
    changed_at: datetime

    class Config:
        from_attributes = True


class TicketResponse(BaseModel):
    ticket_id: int
    employee_name: str
    department: str
    issue_category: str
    description: str
    priority: str
    status: str
    resolution_notes: Optional[str]
    created_at: Optional[datetime]

    class Config:
        from_attributes = True
