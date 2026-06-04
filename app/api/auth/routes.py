# app/api/auth/routes.py

from flask import Blueprint, jsonify, request
from app.utils.extensions import db, limiter
from sqlalchemy import select
from app.models.User import User
from app.models.TokenBlocklist import TokenBlocklist
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt, get_jwt_identity

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/signup', methods=['POST'])
def signup_endpoint():
    data = request.get_json()

    # Validation
    if not all([data, data.get('firstname'), data.get('lastname'), data.get('email'), data.get('password')]):
        return jsonify({
            "status": "ERROR",
            "message": "Missing required fields",
            "code": 400
        }), 400

    # ORM Read: Check if user already exists by email
    user = db.session.execute(select(User).filter_by(email=data['email'])).scalar_one_or_none()

    if user:
        return jsonify({
            "status": "ERROR",
            "message": "Email already registered",
            "code": 409
        }), 409
    
    # Create a new instance of the User class
    new_user = User(
        email=data['email'],
        firstname=data['firstname'],
        lastname=data['lastname']
    )
    new_user.set_password(data['password'])

    # ORM Write: Save the new user to the database
    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({
            "status": "CREATED",
            "user": new_user.to_dict(),
            "message": "User registered successfully!",
            "code": 201
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "status": "ERROR",
            "message": f"DB error occurred: {e}.",
            "code": 500
            }), 500
    

@auth_bp.route("/login", methods=["POST"])
@limiter.limit('5 per minute')
def login_endpoint():
    data = request.get_json()

    if not all([data, data.get('email'), data.get('password')]):
        return jsonify({
            "status": "ERROR",
            "message": "Missing required fields",
            "code": 400
        }), 400
    
    # ORM query: Find user by email
    user = db.session.execute(select(User).filter_by(email=data['email'])).scalar_one_or_none()
    
    if not user or not user.check_password(data['password']):
        return jsonify({
            "status": "ERROR",
            "message": "Invalid credentials",
            "code": 401
        }), 401
    
    # Generate a JWT token containing the user's secure UUID string as the identity
    access_token = create_access_token(identity=str(user.id))
    refresh_token = create_refresh_token(identity=str(user.id))
    

    return jsonify({
        "status": "SUCCESS",
        "message": "Login successful!",
        "access_token": access_token,
        "refresh_token": refresh_token,
        "user": user.to_dict(),
        "code": 200
    }), 200


# A Protected Route (Only accessible with a valid token)
@auth_bp.route("/me", methods=["GET"])
@jwt_required()  # This decorator blocks anyone without a valid JWT token
def get_profile_endpoint():
    # Extract the user ID stored inside the token payload
    current_user_id = get_jwt_identity()

    # Query the user from PostgreSQL using the ORM
    user = db.session.get(User, current_user_id)
    # user = User.query.get(current_user_id)

    if not user:
        return jsonify({
            "status": "ERROR",
            "code": 404,
            "message": "User not found"
        }), 404

    return jsonify({
        "status": "SUCCESS",
        "data": user.to_dict(),
        "code": 200,
        "message": "Profile data retrieved successfully"
    }), 200


@auth_bp.route("/logout", methods=['POST'])
@jwt_required()
def logout_endpoint():
    token_claims = get_jwt()
    jti = token_claims['jti']

    revoked_token = TokenBlocklist(jti=jti)
    db.session.add(revoked_token)
    db.session.commit()

    return jsonify({
        "status": "SUCCESS",
        "code": 200,
        "message": "User logged out successfully. Token revoked"
    })


@auth_bp.route("/refresh", methods=['POST'])
@jwt_required(refresh=True)
def refresh_endpoint():
    # 1. Grab the user's identity (UUID string) from the valid refresh token
    current_user_id = get_jwt_identity()

    # 2. Issue a fresh, short-lived access token
    new_access_token = create_access_token(identity=current_user_id)

    return jsonify({
        "status": "SUCCESS",
        "access_token": new_access_token
    }), 200