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

            if not username or not password:
                return jsonify({'status': 400, 'message': 'Silahkan Masukan Username Atau Password'})
            
            return self.auth_controller.login_validation(username, password)
            
        return render_template('auth/login.html')

    def logout(self):
        return self.auth_controller.logout()
    
instance_auth_view = AuthView(auth_view, AuthController())