# import sys
# from app.voice.tts import speak
# from app.initializer import initializer, test_internet_connection
# from app.voice.stt import listen_and_transcribe
# from app.services.llm_service import get_ai_response
from flask import Flask, jsonify
from flask_limiter.errors import RateLimitExceeded
from flask_cors import CORS
from dotenv import load_dotenv
from app.utils.extensions import db, migrate, jwt, limiter
from app.config.config import DevelopmentConfig, ProductionConfig
from werkzeug.exceptions import MethodNotAllowed, NotFound
import os


load_dotenv()

IS_PRODUCTION = os.getenv("FLASK_ENV") == "production"
PORT = int(os.getenv("PORT", 5000))


def create_app():
    app = Flask(__name__)
    CORS(app, supports_credentials=True)
    
    if IS_PRODUCTION:
        app.config.from_object(ProductionConfig)
    else:
        app.config.from_object(DevelopmentConfig)

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    limiter.init_app(app)

    from app.api.read.routes import read_bp
    from app.api.auth.routes import auth_bp

    app.register_blueprint(read_bp, url_prefix='/api/v1/read')
    app.register_blueprint(auth_bp, url_prefix='/api/v1/auth')

    @app.errorhandler(RateLimitExceeded)
    def handle_rate_limit_exceeded(e):
        return jsonify({
            "status" :"ERROR",
            "code": 429,
            "message": f"Rate Limit Exceeded! Allowed limit: {e.description}."
        }), 429
    

    @app.errorhandler(MethodNotAllowed)
    def handle_method_not_allowed(e):
        return jsonify({
            "status": "ERROR",
            "code": 405,
            "message": "The HTTP Method used is not allowed for this endpoint."
        }), 405
    

    @app.errorhandler(NotFound)
    def handle_not_found(e):
        return jsonify({
            "status": "ERROR",
            "code": 404,
            "message": "The requested URL or resource was not found on this server."
        }), 404

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=False if IS_PRODUCTION else True, host="0.0.0.0", port=PORT)