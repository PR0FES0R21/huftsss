from app import mongo
from flask import jsonify

class SubjectModel:

    def convert_object_id(self, data):
        if data and '_id' in data:
            data['_id'] = str(data['_id'])
        return data
    
    def add_subject(self, data:dict) -> dict:
        result = mongo.db.subjects.insert_one(data)
        if result.inserted_id:
            return {'status': 200, 'message': 'Mata pelajaran berhasil ditambahkan'} 
        return {'status': 400,'message': 'Gagal menambahkan mata pelajaran'}
    
    def get_subject_data(self, query = None) -> list:
        if query is None:
            data_list = list(mongo.db.subjects.find())
            return jsonify([self.convert_object_id(data) for data in data_list])
            
        data_list = list(mongo.db.subjects.find(query))
        return jsonify([self.convert_object_id(data) for data in data_list])
    
    def update_subject(self, data:dict) -> dict:
        result = mongo.db.subjects.update_one({'_id': data['_id']}, {'$set': data})
        if result.modified_count > 0:
            return {'status': 200, 'message': 'Data mata pelajaran berhasil diubah'}
        return{'status': 400,'message': 'Tidak ada data yang diubah'}
    
    def delete_subject(self, id:str) -> dict:
        result = mongo.db.subjects.delete_one({'_id': id})
        if result.deleted_count > 0:
            return {'status': 200, 'message': 'Data mata pelajaran berhasil dihapus'}
        return{'status': 400,'message': 'Tidak ada data yang dihapus'}
    
    def get_subject_count(self) -> int:
        return mongo.db.subjects.count_documents({})
    
    def delete_all_subject(self) -> dict:
        result = mongo.db.subjects.delete_many({})
        if result.deleted_count > 0:
            return {'status': 200, 'message': 'Data mata pelajaran berhasil dihapus'}
        return {'status': 400, 'message': 'Tidak ada data yang dihapus'}