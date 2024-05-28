from app.models.admin_model import AdminModel
from app.services.checking import Checking
from app.models.student_model import StudentModel
from app.models.teacher_model import TeacherModel
from app.models.question_model import QuestionModel
from app.services.auth_service import AuthService
from bson import ObjectId
from flask import jsonify

class AdminController:

    def __init__(self):
        self.admin_model = AdminModel()
        self.auth_service = AuthService()

    def get_admin_data(self, query):
        return self.admin_model.get_admin_data(query)
    
    def get_admin_by_id(self, id):
        if not Checking().is_valid_object_id(id):
            return jsonify({'status': 400, 'message': 'Id Tidak Valid'})
        return self.get_admin_data({'_id': ObjectId(id)})
        
    def get_user_count(self, entities):
        if entities == 'teacher':
            return TeacherModel.get_user_count()
        elif entities == 'student':
            return StudentModel.get_user_count()
        
    def get_user_logger(self):
            return self.admin_model.get_user_logger()


        
    def test(self, user_id):
        return self.admin_model.test(user_id)
    
