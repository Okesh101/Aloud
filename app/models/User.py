# app/models/User.py

from app.utils.extensions import db
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime, UTC

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(
        UUID(as_uuid=True), 
        primary_key=True, 
        default=uuid.uuid4,
        unique=True,
        nullable=False
    )
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    firstname = db.Column(db.String(100), nullable=False)
    lastname = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(UTC), nullable=False)

    # Helper method to set hashed password
    def set_password(self, password):
        from werkzeug.security import generate_password_hash
        self.password_hash = generate_password_hash(password)

    # Helper method to verify password during login
    def check_password(self, password):
        from werkzeug.security import check_password_hash
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            "id": str(self.id),
            "firstname": self.firstname,
            "lastname": self.lastname,
            "email": self.email
        }