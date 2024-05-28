from app import mongo

class QuestionModel:

    def convert_object_id(self, data):
        if data and '_id' in data:
            data['_id'] = str(data['_id'])
        return data
    
    def add_question(self, data:dict) -> dict:
        result = mongo.db.questions.insert_one(data)
        if result.inserted_id:
            return {'status': 200, 'message': 'Soal berhasil ditambahkan'} 
        return {'status': 400,'message': 'Gagal menambahkan soal'}
    
    @staticmethod
    def get_question_count(query:dict=None) -> int:
        if not query:
            return mongo.db.questions.count_documents({})
        return mongo.db.questions.count_documents(query)
    
    def get_question_data(self, query = None) -> list:
        if query is None:
            data_list = list(mongo.db.questions.find())
            return [self.convert_object_id(data) for data in data_list]
            
        data_list = list(mongo.db.questions.find(query))
        return [self.convert_object_id(data) for data in data_list]
    
    def update_question(self, data:dict) -> dict:
        result = mongo.db.questions.update_one({'_id': data['_id']}, {'$set': data})
        if result.modified_count > 0:
            return {'status': 200, 'message': 'Data soal berhasil diubah'}
        return{'status': 400,'message': 'Tidak ada data yang diubah'}
    
    def delete_question(self, id:str) -> dict:
        result = mongo.db.questions.delete_one({'_id': id})
        if result.deleted_count > 0:
            return {'status': 200, 'message': 'Data soal berhasil dihapus'}
        return{'status': 400,'message': 'Tidak ada data yang dihapus'}
    
    def delete_all_question(self, query:dict=None) -> dict:
        if query is None:
            query = {}
        elif not isinstance(query, dict):
            return {'status': 400, 'message': 'Query harus berupa dictionary'}
        result = mongo.db.questions.delete_many(query)
        if result.deleted_count > 0:
            return {'status': 200, 'message': 'Data soal berhasil dihapus'}
        return {'status': 400, 'message': 'Tidak ada data yang dihapus'}

