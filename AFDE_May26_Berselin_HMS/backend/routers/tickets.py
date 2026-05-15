from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from schemas import TicketCreate, TicketUpdate, TicketResponse, TicketActivityResponse
import crud

router = APIRouter(prefix="/api/tickets", tags=["Tickets"])


def require_support_admin(x_role: str = Header(default="")):
    if x_role.lower() != "support_admin":
        raise HTTPException(status_code=403, detail="Support Admin access required")


@router.get("/", response_model=List[TicketResponse])
def get_tickets(db: Session = Depends(get_db)):
    return crud.get_all_tickets(db)


@router.get("/{ticket_id}", response_model=TicketResponse)
def get_ticket(ticket_id: int, db: Session = Depends(get_db)):
    ticket = crud.get_ticket_by_id(db, ticket_id)
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return ticket


@router.post("/", response_model=TicketResponse, status_code=201)
def create_ticket(ticket: TicketCreate, db: Session = Depends(get_db)):
    return crud.create_ticket(db, ticket)


@router.put("/{ticket_id}", response_model=TicketResponse, dependencies=[Depends(require_support_admin)])
def update_ticket(ticket_id: int, ticket: TicketUpdate, db: Session = Depends(get_db)):
    updated = crud.update_ticket(db, ticket_id, ticket)
    if not updated:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return updated


@router.delete("/{ticket_id}", dependencies=[Depends(require_support_admin)])
def delete_ticket(ticket_id: int, db: Session = Depends(get_db)):
    deleted = crud.delete_ticket(db, ticket_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return {"message": f"Ticket {ticket_id} deleted successfully"}


@router.get("/{ticket_id}/activities", response_model=List[TicketActivityResponse])
def get_ticket_activities(ticket_id: int, db: Session = Depends(get_db)):
    return crud.get_ticket_activities(db, ticket_id)
