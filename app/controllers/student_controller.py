from app.models.student_model import StudentModel
from app.services.auth_service import AuthService
from app.services.checking import Checking
from flask import jsonify
from bson import ObjectId
from markupsafe import escape

class StudentController:
    def __init__(self):
        self.student_model = StudentModel()
        self.auth_service = AuthService()

    def get_student_data(self, query, program_keahlian=None, jenjang_kelas=None):
        if program_keahlian and not jenjang_kelas:
            return self.student_model.get_student_data_with_query({'program_keahlian': program_keahlian})
        elif jenjang_kelas and not program_keahlian:
            return self.student_model.get_student_data_with_query({'kelas': jenjang_kelas})
        elif program_keahlian and jenjang_kelas:
            return self.student_model.get_student_data_with_query({'program_keahlian': program_keahlian, 'kelas': jenjang_kelas})
        else:
            return self.student_model.get_student_data(query)


    def get_student_data_by_id(self, id):
        if not Checking().is_valid_object_id(id):
            return jsonify({'status': 400, 'message': 'Id Tidak Valid'})
        return self.get_student_data({'_id': ObjectId(id)})
    
    def get_user_count(self):
        return self.student_model.get_user_count()
    
    def add_student(self, student):
        password = escape(student['nis'])
        password_hash = self.auth_service.hash_password(password)
        email = escape(student['email'])

        if not Checking().is_valid_email(email):
            return {'status': 400, 'message': 'Email tidak valid'}

        data = {
            "nama": escape(student['nama']),
            "nis": escape(student['nis']),
            "tempat_lahir": escape(student['tempat_lahir']),
            "tanggal_lahir": escape(student['tanggal_lahir']),
            "jenis_kelamin": escape(student['jenis_kelamin']),
            "kelas": escape(student['kelas']),
            "nomor_telepon": escape(student['nomor_telepon']),
            "email": escape(student['email']),
            "program_keahlian": escape(student['program_keahlian']),
            "jenjang_kelas": escape(student['jenjang_kelas']),
            "peran": "student",
            "profile_pengguna": "default_profile.jpg",
            "password": password_hash
        }
        return self.student_model.add_student(data)
    
    def update_student(self, student):
        if not Checking().is_valid_object_id(student['id']):
            return {'status': 400, 'message': 'Id Tidak Valid'}
        
        data = {
            "_id": ObjectId(student['id']),
            "nama": escape(student['nama']),
            "nis": escape(student['nis']),
            "tempat_lahir": escape(student['tempat_lahir']),
            "tanggal_lahir": escape(student['tanggal_lahir']),
            "jenis_kelamin": escape(student['jenis_kelamin']),
            "kelas": escape(student['kelas']),
            "nomor_telepon": escape(student['nomor_telepon']),
            "email": escape(student['email']),
            "program_keahlian": escape(student['program_keahlian']),
            "jenjang_kelas": escape(student['jenjang_kelas'])
        }
        return self.student_model.update_student(data)
    
    def delete_student(self, id):
        if not Checking().is_valid_object_id(id):
            return {'status': 400, 'message': 'Id Tidak Valid'}
        return self.student_model.delete_student(ObjectId(id))
    
    def delete_all_student(self):
        return self.student_model.delete_all_student()