# app/utils/extensions.py

from flask_sqlalchemy import SQLAlchemy
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
import re

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=['200 per day', '50 per hour']
)


def create_ssml(text, voice='en-US-JennyNeural'):
    text = text.strip()

    ssml = f"""<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
        <voice name="{voice}">
            <prosody rate="0%" pitch="0%">
                {add_intent_markup(text)}
            </prosody>
        </voice>
    </speak>"""

    return ssml


# def add_intent_markup(text):
#     """Add intent-based markup to text"""

#     # Add pauses for punctuation
#     text = re.sub(r'\. ', '. <break time="400ms"/> ', text)
#     text = re.sub(r'\? ', '? <break time="500ms"/> ', text)
#     text = re.sub(r'! ', '! <break time="500ms"/> ', text)
#     text = re.sub(r', ', ', <break time="200ms"/> ', text)
#     text = re.sub(r'; ', '; <break time="300ms"/> ', text)
#     text = re.sub(r': ', ': <break time="300ms"/> ', text)

#     # Add emphasis for important phrases
#     emphasis_patterns = [
#         (r'(please|kindly|urgently|importantly|critically)',
#          r'<emphasis level="strong">\1</emphasis>'),
#         (r'(very|really|extremely|absolutely) (\w+)',
#          r'\1 <emphasis level="strong">\2</emphasis>'),
#         (r'(must|need to|have to|should) (\w+)',
#          r'<emphasis level="moderate">\1 \2</emphasis>'),
#     ]

#     for pattern, replacement in emphasis_patterns:
#         text = re.sub(pattern, replacement, text, flags=re.IGNORECASE)

#     # Add pauses around quotes
#     text = re.sub(
#         r'"([^"]*)"', r'<break time="100ms"/> "\1" <break time="100ms"/>', text)

#     # Add emphasis for numbers and dates
#     text = re.sub(r'(\d+)(\s+)(\w+)',
#                   r'<emphasis level="moderate">\1</emphasis>\2\3', text)

#     # Add silence for paragraph breaks
#     text = re.sub(r'\n\n', r' <break time="800ms"/> ', text)
#     text = re.sub(r'\n', r' <break time="400ms"/> ', text)

#     return text


def add_intent_markup(text: str) -> str:
    """Improve natural speech for edge-tts using only punctuation."""

    text = text.strip()

    # Normalize whitespace
    text = re.sub(r'\s+', ' ', text)

    # Longer pauses
    text = re.sub(r'\.\s+', '.\n\n', text)
    text = re.sub(r'!\s+', '!\n\n', text)
    text = re.sub(r'\?\s+', '?\n\n', text)

    # Slight pauses
    text = re.sub(r';\s+', ';\n', text)
    text = re.sub(r':\s+', ':\n', text)

    # Keep commas with spacing
    text = re.sub(r',\s*', ', ', text)

    # Dramatic ellipsis
    text = re.sub(r'\.{3,}', '... ', text)

    # Add slight pauses around quoted speech
    text = re.sub(r'"([^"]+)"', r'"\1"', text)

    return text
