from app.models.teacher_model import TeacherModel
from bson.objectid import ObjectId
from app.services.checking import Checking
from flask import jsonify
from app.services.auth_service import AuthService
from markupsafe import escape

class TeacherController:
    def __init__(self):
        self.teacher_model = TeacherModel()
        self.auth_service = AuthService()
        self.check_service = Checking()

    def get_teacher_data(self, query):
        return self.teacher_model.get_teacher_data(query)
    
    def get_teacher_count(self):
        return self.teacher_model.get_user_count()
    
    def get_teacher_data_by_id(self, id):
        if not self.check_service.is_valid_object_id(id):
            return jsonify({'status': 400, 'message': 'Id Tidak Valid'})
        return jsonify(self.get_teacher_data({'_id': ObjectId(id)}))
    
    def add_teacher(self, teacher):
        password = escape(teacher['nktam'])
        password_hash = self.auth_service.hash_password(password)
        email = escape(teacher['emailGuru'])

        if not self.check_service.is_valid_email(email):
            return {'status': 400, 'message': 'Email tidak valid'}

        data = {
            "nama": escape(teacher['nama']),
            "nktam": escape(teacher['nktam']),
            "tanggal_lahir": escape(teacher['tanggalLahirGuru']),
            "jenis_kelamin": escape(teacher['jkGuru']),
            "jabatan": escape(teacher['jabatan']),
            "mata_pelajaran": escape(teacher['mataPelajaran']),
            "nomor_telepon": escape(teacher['nomorTeleponGuru']),
            "email": escape(teacher['emailGuru']),
            "peran": "teacher",
            "profile_pengguna": "default_profile.jpg",
            "password": password_hash
        }
        return self.teacher_model.add_teacher(data)
    
    def update_teacher(self, teacher):
        if not self.check_service.is_valid_object_id(teacher['idGuru']):
            return {'status': 400, 'message': 'Id Tidak Valid'}
        
        data = {
            "_id": ObjectId(teacher['idGuru']),
            "nama": escape(teacher['nama']),
            "nktam": escape(teacher['nktam']),
            "tanggal_lahir": escape(teacher['tanggalLahirGuru']),
            "jenis_kelamin": escape(teacher['jkGuru']),
            "jabatan": escape(teacher['jabatan']),
            "mata_pelajaran": escape(teacher['mataPelajaran']),
            "nomor_telepon": escape(teacher['nomorTeleponGuru']),
            "email": escape(teacher['emailGuru']),
            "peran": "teacher",
            "profile_pengguna": "default_profile.jpg",
        }
        return self.teacher_model.update_teacher(data)
    
    def delete_teacher(self, id):
        if not self.check_service.is_valid_object_id(id):
            return {'status': 400, 'message': 'Id Tidak Valid'}
        return self.teacher_model.delete_teacher(ObjectId(id))
    
    def delete_all_teacher(self):
        return self.teacher_model.delete_all_teacher()