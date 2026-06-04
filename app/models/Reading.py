# app/models/Reading.py

from app.utils.extensions import db
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime, UTC, timezone

class Reading(db.Model):
    __tablename__ = 'readings'

    id = db.Column(
        UUID(as_uuid=True), 
        primary_key=True, 
        default=uuid.uuid4,
        unique=True,
        nullable=False
    )
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    total_reads = db.Column(db.Integer, default=0, nullable=False)
    today_reads = db.Column(db.Integer, default=0, nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(UTC), nullable=False)
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(UTC), onupdate=lambda: datetime.now(UTC), nullable=False)


    def to_dict(self):
        return {
            "id": str(self.id),
            # "user_id": str(self.user_id),
            "content": f"{self.content[:100]}...",  # Truncate content for summary
            "total_reads": self.total_reads,
            "today_reads": self.today_reads,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat()
        }


