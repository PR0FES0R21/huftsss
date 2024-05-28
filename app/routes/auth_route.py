from flask import Blueprint, render_template, request, jsonify
from app.controllers.auth_controller import AuthController
import json
import base64

auth_view = Blueprint('auth_views', __name__)

class AuthView:

    def __init__(self, auth_views, auth_controller):
        self.auth_views = auth_views
        self.auth_controller = auth_controller
        self.register_views()

    def register_views(self):
        self.auth_views.add_url_rule('/login', view_func=self.login, methods=['GET', 'POST'])
        self.auth_views.add_url_rule('/logout', view_func=self.logout, methods=['GET'])

    def login(self):
        
        if request.method == 'POST':
            username = request.form['username']
            password = request.form['password']

            encoded_data = request.headers.get('X-Data')
            # Melakukan decode dari Base64 dan mendekripsi data JSON
            if encoded_data:
                decoded_data = json.loads(base64.b64decode(encoded_data).decode('utf-8'))
            else:
                decoded_data = None

            if not username or not password:
                return jsonify({'status': 400, 'message': 'Username atau Password tidak boleh kosong'})
            
            return self.auth_controller.login_validation(username, password, decoded_data)
            
        return render_template('auth/login.html')

    def logout(self):
        return self.auth_controller.logout()
    
instance_auth_view = AuthView(auth_view, AuthController())