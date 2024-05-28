import jwt
import datetime
from datetime import datetime, timedelta, timezone
import hashlib
from werkzeug.utils import secure_filename
from flask import current_app
import json
from bson import ObjectId
import base64
from app import mongo

class AuthService:
        
        def generate_token(self, user_id: str) -> ObjectId:
            try:
                payload = {
                    'exp': datetime.now(timezone.utc) + timedelta(days=1),
                    'iat': datetime.now(timezone.utc),
                    'id': user_id
                }
                token = jwt.encode(payload, current_app.config.get('SECRET_KEY'), algorithm='HS256')
                return token
            
            except Exception as e:
                return str(e)

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
        
        def decode_token(self, token):
            try:
                payload = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms='HS256')
                return payload
            except jwt.ExpiredSignatureError:
                return 'Token Expired'
            except jwt.InvalidTokenError:
                return 'Invalid Token'
            except Exception as e:
                return str(e)
            
        def encode_dict_to_base64(self, data) -> str:
            json_data = json.dumps(data)
            base64_data = base64.b64encode(json_data.encode('utf-8')).decode('utf-8')
            return base64_data
        
        @staticmethod
        def tracking(data):
            mongo.db.tracking.insert_one(data)
        