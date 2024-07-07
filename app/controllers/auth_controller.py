from app.models.admin_model import AdminModel
from app.services.auth_service import AuthService
from app.models.student_model import StudentModel
from app.models.teacher_model import TeacherModel
from markupsafe import escape
from flask_login import login_user
from app.models.user import User
from flask import request, session, jsonify
from app.services.tracking import Tracking

class AuthController:
    def __init__(self):
        self.admin_model = AdminModel()
        self.student_model = StudentModel()
        self.teacher_model = TeacherModel()
        self.auth_service = AuthService()

    def login_validation(self, username, password):
        
        username = escape(username)
        password = escape(password)
        password_hash = self.auth_service.hash_password(password)

        is_valid_admin = self.admin_model.get_admin_data({'nktam': username, 'password': password_hash})
        is_valid_student = self.student_model.get_student_data({'nis': username, 'password': password_hash})
        is_valid_teacher = self.teacher_model.get_teacher_data({'nktam': username, 'password': password_hash})
        
        if not is_valid_admin and not is_valid_student and not is_valid_teacher:
            return {
                'status': 400,
                'message': 'Username atau Password Salah'
            }
        
        valid_entity = is_valid_admin if is_valid_admin else (is_valid_student if is_valid_student else is_valid_teacher)
        position = valid_entity['jabatan'] if valid_entity['peran'] == 'admin' or valid_entity['peran'] == 'teacher' else valid_entity['kelas']
        user = User(valid_entity['_id'], valid_entity['peran'], valid_entity['nama'], position)
        login_user(user)

        data = {
            'user_id': valid_entity['_id'],
            'nama': valid_entity['nama'],
            'role': valid_entity['peran'],
            'actifity': 'Login',
            'user_profile': valid_entity['profile_pengguna']
        }
        Tracking().tracking_user_logger(request.headers.get('User-Agent'), data)

        return jsonify({
            'status': 200,
            'message': 'Berhasil Masuk',
            'redirect': f'/{valid_entity["peran"]}'
        })
    # 66462cec79aeaea0452e37d3 6652f2dca32bc76bfb8b9c74
