from app.models.question_model import QuestionModel
from app.services.auth_service import AuthService
from app.services.checking import Checking
from bson import ObjectId
from markupsafe import escape
from flask import jsonify

class QuestionController:
    def __init__(self):
        self.quest_model = QuestionModel()
        self.auht_service = AuthService()
        self.checking_service = Checking()
    
    def add_question(self, data):

        required_fields = ['id_ujian', 'soal', 'jawaban_a', 'jawaban_b', 'jawaban_c', 'jawaban_d', 'kunci_jawaban']
        for field in required_fields:
            if not data.get(field):
                return {'status': 400, 'message': 'Semua field harus diisi'}

        data = {
            'id_ujian': escape(data['id_ujian']),
            'soal': escape(data['soal']),
            'jawaban_a': escape(data['jawaban_a']),
            'jawaban_b': escape(data['jawaban_b']),
            'jawaban_c': escape(data['jawaban_c']),
            'jawaban_d': escape(data['jawaban_d']),
            'kunci_jawaban': escape(data['kunci_jawaban']),
        }
        return self.quest_model.add_question(data)
    
    def update_question(self, data:dict) -> str:
        if not self.checking_service.is_valid_object_id(data['id']):
            return jsonify({'status': 400, 'message': 'Id Tidak Valid'})
        data = {
            "_id": ObjectId(data['id']),
            'soal': escape(data['soal']),
            'jawaban_a': escape(data['jawaban_a']),
            'jawaban_b': escape(data['jawaban_b']),
            'jawaban_c': escape(data['jawaban_c']),
            'jawaban_d': escape(data['jawaban_d']),
            'kunci_jawaban': escape(data['kunci_jawaban']),
        }
        return self.quest_model.update_question(data)
    
    def delete_question(self, id:str) -> dict:
        if not self.checking_service.is_valid_object_id(id):
            return {'status': 400, 'message': 'ID tidak valid'}
        return self.quest_model.delete_question(ObjectId(id))
    
    def get_question_count(self) -> int:
        return self.quest_model.get_question_count()
    
    def get_question_data(self, query):
        return self.quest_model.get_question_data(query)
    
    def get_question_data_by_exam_id(self, id:str) -> dict:
        if not self.checking_service.is_valid_object_id(id):
            return {'status': 400, 'message': 'Id Tidak Valid'}
        return self.get_question_data({'id_ujian': id})
    
    @staticmethod
    def get_quest_count_by_id(exam_id:str) -> int:
        cs = Checking()
        if not cs.is_valid_object_id(exam_id):
            return jsonify({'status': 400, 'message': 'Id Tidak Valid'})
        return QuestionModel.get_question_count({'id_ujian': exam_id})
    
    def get_question_data_by_id(self, id:str) -> dict:
        if not self.checking_service.is_valid_object_id(id):
            return jsonify({'status': 400, 'message': 'Id Tidak Valid'})
        return self.get_question_data({'_id': ObjectId(id)})
    
    def delete_all_question(self, id_exam:str) -> dict:
        if not self.checking_service.is_valid_object_id(id_exam):
            return {'status': 400, 'message': 'ID tidak valid'}
        return self.quest_model.delete_all_question({'id_ujian': id_exam})
    
