
from app import mongo
from bson import ObjectId
from typing import Dict, Union, Optional, List, Any

class StudentModel:

    def convert_object_id(self, data):
        if data and '_id' in data:
            data['_id'] = str(data['_id'])
        return data
    
    def get_student_data(self, query = None) -> List[Dict[str, Any]]:
        if query is None:
            data_list = list(mongo.db.students.find())
            return [self.convert_object_id(data) for data in data_list]
            
        data_list = mongo.db.students.find_one(query)
        return self.convert_object_id(data_list)
    
    @staticmethod
    def get_user_count() -> int:
        return mongo.db.students.count_documents({})
    
    def add_student(self, data:dict) -> Dict[str, Any]:
        if self.get_student_data({'nis': data['nis']}):
            return {'status':409, 'message': 'Siswa dengan NIS tersebut sudah terdaftar'}
        else:
            result = mongo.db.students.insert_one(data)
            if result.inserted_id:
                return {'status': 200, 'message': 'Siswa berhasil ditambahkan'} 
            return {'status': 400,'message': 'Gagal menambahkan siswa'}
        
    def update_student(self, data:dict) -> Dict[str, Union[str, int]]:
        result = mongo.db.students.update_one({'_id': data['_id']}, {'$set': data})
        if result.modified_count > 0:
            return {'status': 200, 'message': 'Data siswa berhasil diubah'}
        return{'status': 400,'message': 'Tidak ada data yang diubah'}
    
    def delete_student(self, id:ObjectId) -> Dict[str, Union[str, int]]:
        result = mongo.db.students.delete_one({'_id': id})
        if result.deleted_count > 0:
            return {'status': 200, 'message': 'Data siswa berhasil dihapus'}
        return {'status': 400, 'message': 'Tidak ada data yang dihapus'}
    
    def delete_all_student(self) -> Dict[str, Union[int, str]]:
        result = mongo.db.students.delete_many({})
        if result.deleted_count > 0:
            return {'status': 200, 'message': 'Data siswa berhasil dihapus'}
        return {'status': 400, 'message': 'Tidak ada data yang dihapus'}

    def get_student_data_with_query(self, query):
        if not query:
            return {'status': 400, 'message': 'Terjadi Kesalahan'}
        data_list = list(mongo.db.students.find(query))
        return [self.convert_object_id(data) for data in data_list]