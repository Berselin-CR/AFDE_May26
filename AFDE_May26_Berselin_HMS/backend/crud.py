from sqlalchemy.orm import Session
from sqlalchemy import or_
from models import Ticket, TicketActivity
from schemas import TicketCreate, TicketUpdate


def get_all_tickets(db: Session):
    return db.query(Ticket).order_by(Ticket.created_at.desc()).all()


def get_ticket_by_id(db: Session, ticket_id: int):
    return db.query(Ticket).filter(Ticket.ticket_id == ticket_id).first()


def create_ticket(db: Session, ticket: TicketCreate):
    db_ticket = Ticket(
        employee_name=ticket.employee_name,
        department=ticket.department,
        issue_category=ticket.issue_category,
        description=ticket.description,
        priority=ticket.priority,
        status="Open",
    )
    db.add(db_ticket)
    db.commit()
    db.refresh(db_ticket)
    return db_ticket


def update_ticket(db: Session, ticket_id: int, ticket: TicketUpdate):
    db_ticket = get_ticket_by_id(db, ticket_id)
    if not db_ticket:
        return None
    update_data = ticket.model_dump(exclude_unset=True)
    changed_by = update_data.pop("changed_by", None)
    old_status = db_ticket.status
    for field, value in update_data.items():
        setattr(db_ticket, field, value)
    if "status" in update_data and update_data["status"] != old_status:
        db.add(TicketActivity(
            ticket_id=ticket_id,
            changed_by=changed_by or "Unknown",
            from_status=old_status,
            to_status=update_data["status"],
        ))
    db.commit()
    db.refresh(db_ticket)
    return db_ticket


def get_ticket_activities(db: Session, ticket_id: int):
    return (
        db.query(TicketActivity)
        .filter(TicketActivity.ticket_id == ticket_id)
        .order_by(TicketActivity.changed_at.asc())
        .all()
    )


def delete_ticket(db: Session, ticket_id: int):
    db_ticket = get_ticket_by_id(db, ticket_id)
    if not db_ticket:
        return False
    db.delete(db_ticket)
    db.commit()
    return True


def search_tickets(db: Session, keyword: str = None, category: str = None, status: str = None):
    query = db.query(Ticket)
    if keyword:
        query = query.filter(
            or_(
                Ticket.description.ilike(f"%{keyword}%"),
                Ticket.employee_name.ilike(f"%{keyword}%"),
                Ticket.department.ilike(f"%{keyword}%"),
            )
        )
    if category:
        query = query.filter(Ticket.issue_category == category)
    if status:
        query = query.filter(Ticket.status == status)
    return query.order_by(Ticket.created_at.desc()).all()
