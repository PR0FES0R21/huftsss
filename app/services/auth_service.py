import datetime
from datetime import datetime, timedelta, timezone
import hashlib
from werkzeug.utils import secure_filename
from flask import current_app
import json
from bson import ObjectId
import base64

class AuthService:

        def hash_password(self, password):
            return hashlib.sha256(password.encode()).hexdigest()
        
        def save_image(self, image):
            if image.content_length > 4 * 1024 * 1024:
                return 413
            
            if image.mimetype not in ['image/jpeg', 'image/png', 'image/jpg']:
                return 415
            
            filename = secure_filename(image.filename)
            image.save(f'current_app.config.get("UPLOAD_FOLDER")/{filename}')

            return True
            
        def encode_dict_to_base64(self, data) -> str:
            json_data = json.dumps(data)
            base64_data = base64.b64encode(json_data.encode('utf-8')).decode('utf-8')
            return base64_data
        