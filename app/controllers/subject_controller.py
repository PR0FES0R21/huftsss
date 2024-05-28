from app.models.subject_model import SubjectModel
from bson import ObjectId
from app.services.checking import Checking

class SubjectController:
    def __init__(self):
        self.subject_model = SubjectModel()
        self.checking_service = Checking()
    
    def get_subject_data(self, query):
        return self.subject_model.get_subject_data(query)
    
    def add_subject(self, data:dict) -> dict:
        data = {
            'kode_mapel': data['kode-mapel'],
            'nama_mapel': data['nama-mapel'],
            'jenjang': data['jenjang'],
            'program_keahlian': data['jurusan'],
            'kkm': data['kkm'],
        }
        return self.subject_model.add_subject(data)
    
    def get_subject_by_id(self, id:str) -> dict:
        if not self.checking_service.is_valid_object_id(id):
            return {'status': 400, 'message': 'Id Tidak Valid'}
        return self.get_subject_data({'_id': ObjectId(id)})
    
    def update_subject(self, data:dict) -> dict:
        print(data)
        if not self.checking_service.is_valid_object_id(data['id']):
            return {'status': 400, 'message': 'Id Tidak Valid'}
        
        data = {
            "_id": ObjectId(data['id']),
            'kode_mapel': data['kode-mapel'],
            'nama_mapel': data['nama-mapel'],
            'jenjang': data['jenjang'],
            'program_keahlian': data['jurusan'],
            'kkm': data['kkm'],
        }
        return self.subject_model.update_subject(data)
    
    def delete_subject(self, id:str) -> dict:
        if not self.checking_service.is_valid_object_id(id):
            return {'status': 400, 'message': 'ID tidak valid'}
        return self.subject_model.delete_subject(ObjectId(id))
    
    def get_subject_count(self) -> int:
        return self.subject_model.get_subject_count()
    
    def delete_all_subject(self) -> dict:
        return self.subject_model.delete_all_subject()
    