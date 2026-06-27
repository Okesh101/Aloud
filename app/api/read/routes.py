# app/api/read/routes.py

from flask import Blueprint, jsonify, request, Response, stream_with_context
from sqlalchemy import desc, select
from app.utils.extensions import limiter, db, add_intent_markup
from app.models.Reading import Reading
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import UTC, datetime
from io import BytesIO
from pypdf import PdfReader
import pyttsx3
import edge_tts
import asyncio
import soundfile as sf
from app.services.ttsService import generate_speech

read_bp = Blueprint('read', __name__)


@read_bp.route('/text', methods=['POST'])
@jwt_required()
@limiter.limit('15 per minute')
def read_text_endpoint():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    text = data.get('text', '')

    if not text:
        return jsonify({
            "status": "ERROR",
            "message": 'No text provided',
            "code": 400
        }), 400

    # await speak(text)
    audio_array, sample_rate = generate_speech(text)
    # audio_array, sample_rate = generate_speech_python_api(text)

    buffer = BytesIO()
    sf.write(buffer, audio_array, sample_rate, format='WAV')
    buffer.seek(0)

    # Fetch existing reading for the user or create a new one
    user_has_read = db.session.execute(
        select(Reading)
        .filter_by(user_id=current_user_id)
        .order_by(desc(Reading.created_at))
        .limit(1)
    ).scalar_one_or_none()

    last_total_reads = 0
    last_today_reads = 0
    # Default to current date if no previous record exists
    last_updated_at = datetime.now(UTC).date()
    current_date = datetime.now(UTC).date()

    if user_has_read:
        last_total_reads = user_has_read.total_reads
        last_today_reads = user_has_read.today_reads
        last_updated_at = user_has_read.updated_at.date()

    new_reading = Reading(
        user_id=current_user_id,
        content=text[:120],  # Store only the first 55 characters for summary
        total_reads=last_total_reads + 1,
        today_reads=last_today_reads + 1 if last_updated_at == current_date else 1
    )

    # ORM Write: Save the new user to the database
    try:
        db.session.add(new_reading)
        db.session.commit()

        reading_data = new_reading.to_dict()

        response = Response(
            buffer.read(),
            mimetype='audio/wav',
            headers={
                "Content-Disposition": "inline",
                "Cache-Control": "no-cache",
                "X-STATUS": "SUCCESS",
                "X-CODE": "200",
                "X-Total-Reads": str(reading_data["total_reads"]),
                "X-Today-Reads": str(reading_data["today_reads"]),
                # "X-Content-Preview": str(reading_data["content"].encode('ascii', 'ignore')[:50].decode('ascii'))
            }
        )

        return response

    except Exception as e:
        db.session.rollback()
        print("ERROR!", str(e))
        return jsonify({
            "status": "ERROR",
            "message": f"DB error occurred: {str(e)}.",
            "code": 500
        }), 500


@read_bp.route('/pdf', methods=['POST'])
@jwt_required()
@limiter.limit('5 per minute')
def read_pdf_endpoint():
    if 'file' not in request.files:
        return jsonify({
            "status": "ERROR",
            "message": 'No file part in the request',
            "code": 400
        }), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({
            "status": "ERROR",
            "message": 'No selected file',
            "code": 400
        }), 400

    reader = PdfReader(file)

    text = ""
    for page in reader.pages:
        text += page.extract_text() or ""

    engine = pyttsx3.init()
    engine.save_to_file(text, "audiobook.mp3")
    engine.runAndWait()

    print("Audiobook Created!")

    # Here you would add the logic to process the PDF and convert it to speech
    # For now, we will just return the filename as a placeholder
    return jsonify({
        "status": "SUCCESS",
        "code": 200,
        "message": f'Received file: {file.filename}'
    }), 200


@read_bp.route('/visitor', methods=['POST'])
@limiter.limit('10 per 4 hours')
def read_visitor_text_endpoint():
    data = request.get_json()
    text = data.get('text', '')

    word_count = len(text.split())
    if word_count > 25:
        return jsonify({
            "status": "ERROR",
            "message": "Visitors can only submit up to 25 words at a time. Signup for best experience!",
            "code": 400,
            "length": word_count
        }), 400

    if not text:
        return jsonify({
            "status": "ERROR",
            "message": 'No text provided',
            "code": 400
        }), 400

    # Here you would add the logic to convert text to speech and play it for visitors
    # Clean async worker execution isolated from Flask thread state
    async def run_tts():
        final_text = add_intent_markup(text)
        communicate = edge_tts.Communicate(
            final_text, voice='en-US-JennyNeural')
        audio_data = bytearray()
        
        async for chunk in communicate.stream():
            if chunk['type'] == 'audio':
                audio_data.extend(chunk['data'])
        return bytes(audio_data)
    
    # For now, we will just return the text back as a placeholder
    try:
        print("Processing Text for Visitor: ", text)
        # asyncio.run handles loop lifecycle safely across threads
        audio_bytes = asyncio.run(run_tts())

        if not audio_bytes:
            raise ValueError("Empty audio payload received from TTS engine")

        return Response(
            audio_bytes,
            mimetype='audio/mpeg',
            headers={
                'Content-Disposition': 'inline; filename="speech.mp3"',
                'Cache-Control': 'no-cache'
            }
        )
    except Exception as e:
        print(f"TTS Engine Error: {e}")
        # Explicit 500 HTTP Status header so frontend handles fallback correctly
        return jsonify({
            "status": "ERROR",
            "code": 500,
            "message": f"Failed to generate speech: {str(e)}"
        }), 500


@read_bp.route('/stats', methods=['GET'])
@jwt_required()
@limiter.limit("20 per minute")
def get_dashboard_stats_endpoint():
    current_user_id = get_jwt_identity()

    # ORM query: Fetch all readings for the current user, ordered by creation date
    user_readings = db.session.execute(
        select(Reading)
        .filter_by(user_id=current_user_id)
        .order_by(desc(Reading.created_at))
    ).scalars().all()

    readings_data = [reading.to_dict() for reading in user_readings]

    return jsonify({
        "status": "SUCCESS",
        "code": 200,
        "recent_reads": readings_data,
        "total_reads": sum(r['total_reads'] for r in readings_data),
        "today_reads": sum(r['today_reads'] for r in readings_data if r['created_at'][:10] == datetime.now(UTC).date().isoformat()),
        "message": "Fetched user reading stats successfully!"
    }), 200
