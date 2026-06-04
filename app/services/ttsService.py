# app/services/ttsService.py

import subprocess
import tempfile
import wave
import numpy as np
import os
from config_read import read_yaml

yaml = read_yaml()
model_path = yaml["voice_model"]["path"]

def generate_speech(text):
    """Generate speech from text using Piper TTS"""
    
    if not text or not text.strip():
        raise ValueError("Empty text provided")
    
    # Create temporary file for output
    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp_file:
        temp_path = tmp_file.name
    
    try:
        # Run Piper to generate audio
        result = subprocess.run(
            [
                'piper', 
                '--model', model_path,
                '--output_file', temp_path,
                '--length_scale', '1.0',
            ],
            input=text.encode('utf-8'),
            capture_output=True,
            check=False  # Don't raise exception automatically
        )
        
        # Check if Piper succeeded
        if result.returncode != 0:
            error_msg = result.stderr.decode('utf-8') if result.stderr else "Unknown error"
            raise RuntimeError(f"Piper failed with error: {error_msg}")
        
        # Check if file was created and has content
        if not os.path.exists(temp_path):
            raise RuntimeError("Piper did not create output file")
        
        file_size = os.path.getsize(temp_path)
        if file_size == 0:
            raise RuntimeError("Piper created empty audio file")
        
        # Read the WAV file
        with wave.open(temp_path, 'rb') as wav:
            sample_rate = wav.getframerate()
            n_frames = wav.getnframes()
            frames = wav.readframes(n_frames)
            audio_array = np.frombuffer(frames, dtype=np.int16)
        
        # Verify we got audio data
        if len(audio_array) == 0:
            raise RuntimeError("No audio data generated")
        
        return audio_array, sample_rate
        
    except Exception as e:
        raise RuntimeError(f"Speech generation failed: {str(e)}")
    
    finally:
        # Clean up temp file
        if os.path.exists(temp_path):
            os.unlink(temp_path)


# Alternative: Use piper's Python API directly (better approach)
def generate_speech_python_api(text):
    """Use Piper's Python API directly (avoid subprocess issues)"""
    from piper import PiperVoice
    
    # Load voice once (do this outside the function for better performance)
    voice = PiperVoice.load(model_path)
    
    # Generate audio to memory
    audio_data = bytearray()
    
    for audio_bytes in voice.synthesize_stream(text):
        audio_data.extend(audio_bytes)
    
    # Convert to numpy array
    audio_array = np.frombuffer(audio_data, dtype=np.int16)
    sample_rate = voice.config.sample_rate
    
    return audio_array, sample_rate