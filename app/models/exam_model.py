from app import mongo
from bson import ObjectId

class ExamModel:
    
    def convert_objectId(self, data):
        for key in data:
            if isinstance(data[key], ObjectId):
                data[key] = str(data[key])
        return data
    
    def convert_object_id(self, data):
        if data and '_id' in data:
            data['_id'] = str(data['_id'])
        return data
    
    def get_exam_data(self, query = None) -> list:
        if query is None:
            data_list = list(mongo.db.exams.find())
            return [self.convert_object_id(data) for data in data_list]
            
        data_list = mongo.db.exams.find_one(query)
        return self.convert_object_id(data_list)
    
    @staticmethod
    def get_exam_count() -> int:
        return mongo.db.exams.count_documents({})
    
    def add_exam(self, data:dict) -> dict:
        if self.get_exam_data({'exam_name': data['nama_ujian']}):
            return {'status':409, 'message': 'Ujian dengan nama tersebut sudah terdaftar'}
        else:
            result = mongo.db.exams.insert_one(data)
            if result.inserted_id:
                return {'status': 200, 'message': 'Ujian berhasil ditambahkan'} 
            return {'status': 400,'message': 'Gagal menambahkan ujian'}
        
    def update_exam(self, data:dict) -> dict:
        result = mongo.db.exams.update_one({'_id': data['_id']}, {'$set': data})
        if result.modified_count > 0:
            return {'status': 200, 'message': 'Data ujian berhasil diubah'}
        return{'status': 400,'message': 'Tidak ada data yang diubah'}
    
    def delete_exam(self, id:str) -> dict:
        result = mongo.db.exams.delete_one({'_id': id})
        if result.deleted_count > 0:
            return {'status': 200, 'message': 'Data ujian berhasil dihapus'}
        return{'status': 400,'message': 'Tidak ada data yang dihapus'}
    
    def delete_all_exam(self) -> dict:
        result = mongo.db.exams.delete_many({})
        if result.deleted_count > 0:
            return {'status': 200, 'message': 'Data ujian berhasil dihapus'}
        return {'status': 400, 'message': 'Tidak ada data yang dihapus'}
    
    def get_exam_data_by_category(self, pipelines):
        result = list(mongo.db.exams.aggregate(pipelines))
        return [self.convert_objectId(data) for data in result]
    
    def get_exam_data_by_category_done(self, pipelines):
        result = list(mongo.db.exam_logs.aggregate(pipelines))
        return [self.convert_objectId(data) for data in result]
    
    def get_exam_logs_data(self, query):
        return mongo.db.exam_logs.find_one(query)    
    
    def insert_exam_logs_data(self, data):
        result = mongo.db.exam_logs.insert_one(data)
        if result.inserted_id:
            return {'status': 200}
        return {'status': 400}
    
    def add_user_launch_exam(self, data):
        result = mongo.db.exam_record.insert_one(data)
        if result.inserted_id:
            return {'status': 200, 'inserted_id': result.inserted_id}
        return {'status': 400, 'message': 'Gagal Menginisiasi'}
    
    def get_user_launch_exam(self, data):
        result = mongo.db.exam_logs.find_one(data)
        if result:
            return {'status': 200, 'inserted_id': str(result['_id'])}
        
    def validate_record_data(self, query):
        data_list = mongo.db.exam_record.find_one(query)
        if data_list:
            return self.convert_objectId(data_list)
        return None
    
    def exam_adition_confirmation(self, id, end_time):
        result = mongo.db.exam_record.update_one({'_id': id}, {'$set': {'end_time': end_time}})
        if result.modified_count > 0:
            return {'status': 200}
        return {'status': 400}
    
    def save_exam_history(self, data):
        result = mongo.db.exam_history.insert_many(data)
        if result.inserted_ids:
            return {'status': 200, 'message': 'Ujian Diselesaikan'}
        return {'status': 400, 'message': 'Terjadi Kesalahan'}
    
    def set_active_exam(self, id_exam):
        result = mongo.db.exams.update_one({'_id': id_exam}, {'$set': {'status_pengerjaan': 1}})
        print(result.modified_count)
        if result.modified_count > 0:
            return {'status': 200, 'message': 'Ujian Aktif'}
        return {'status': 400, 'message': 'Terjadi Kesalahan'}
