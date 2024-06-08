from app import mongo

class ClassModel:
    def __init__(self):
        self.db = mongo.db
        self.collection = self.db.kelas

    def convert_object_id(self, data):
        if data and '_id' in data:
            data['_id'] = str(data['_id'])
        return data

    def add_class(self, data:dict) -> dict:
        result = mongo.db.clases.insert_one(data)
        if result.inserted_id:
            return {'status': 200, 'message': 'Data Berhasil Ditambahkan'}
        return {'status': 400, 'message': 'Data Gagal Ditambahkan'}
    
    def get_class_data(self, query:dict = None) -> list:
        if query is None:
            data_list = list(mongo.db.clases.find())
        else:
            data_list = list(mongo.db.clases.find(query))
        return [self.convert_object_id(data) for data in data_list]
    
    def get_class_count(self) -> int:
        return mongo.db.clases.count_documents({})
    
    def update_class(self, data:dict) -> dict:
        result = mongo.db.clases.update_one({'_id': data['_id']}, {'$set': data})
        if result.modified_count > 0:
            return {'status': 200, 'message': 'Data Berhasil Diubah'}
        return {'status': 400, 'message': 'Tidak Ada Data Yang Diubah'}
    
    def delete_class(self, id:str) -> dict:
        result = mongo.db.clases.delete_one({'_id': id})
        if result.deleted_count > 0:
            return {'status': 200, 'message': 'Data Berhasil Dihapus'}
        return {'status': 400, 'message': 'Tidak Ada Data Yang Dihapus'}
    
    def delete_all_class(self) -> dict:
        result = mongo.db.clases.delete_many({})
        if result.deleted_count > 0:
            return {'status': 200, 'message': 'Data Berhasil Dihapus'}
        return {'status': 400, 'message': 'Tidak Ada Data Yang Dihapus'}
        