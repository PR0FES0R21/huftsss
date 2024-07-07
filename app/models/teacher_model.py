from app import mongo
from typing import Dict, Union, Optional, List, Any

class TeacherModel:
        
    def convert_object_id(self, data):
        if data and '_id' in data:
            data['_id'] = str(data['_id'])
        if data and 'id_mapel' in data:
            data['id_mapel'] = str(data['id_mapel'])
        return data
    
    def get_teacher_data(self, query: Optional[Dict[str, Any]]) -> List[Dict[str, Any]]:
        pipeline = [
            {
                "$lookup": {
                    'from': 'subjects',
                    'localField': 'id_mata_pelajaran',
                    'foreignField': '_id',
                    'as': 'subject_details'
                }
            },
            {
                "$unwind": "$subject_details"
            },
            {
                "$project": {
                    "nama": 1,
                    "nktam": 1,
                    "tanggal_lahir": 1,
                    "jenis_kelamin": 1,
                    "jabatan": 1,
                    "mata_pelajaran": "$subject_details.nama_mapel",
                    "nomor_telepon": 1,
                    "email": 1,
                    "peran": 1,
                    "profile_pengguna": 1,
                    "id_mapel": "$subject_details._id"
                }
            }
        ]
        if query != None:
            match_stage = {
                "$match": query
            }
            pipeline.insert(0, match_stage)   
    
        data_list = list(mongo.db.teachers.aggregate(pipeline))
        print(data_list)
        return [self.convert_object_id(data) for data in data_list]
    
    @staticmethod
    def get_user_count() -> int:
        return mongo.db.teachers.count_documents({})
    
    def add_teacher(self, data:dict) -> Dict[str, Union[str, int]]:
        if self.get_teacher_data({'nktam': data['nktam']}):
            return {'status':409, 'message': 'Guru dengan NIP tersebut sudah terdaftar'}
        else:
            result = mongo.db.teachers.insert_one(data)
            if result.inserted_id:
                return {'status': 200, 'message': 'Guru berhasil ditambahkan'} 
            return {'status': 400,'message': 'Gagal menambahkan guru'}
        
    def update_teacher(self, data:dict) -> Dict[str, Union[str, int]]:
        result = mongo.db.teachers.update_one({'_id': data['_id']}, {'$set': data})
        if result.modified_count > 0:
            return {'status': 200, 'message': 'Data guru berhasil diubah'}
        return {'status': 400, 'message': 'Tidak ada data yang diubah'}
    
    def delete_teacher(self, id:str) -> Dict[str, Union[str, int]]:
        result = mongo.db.teachers.delete_one({'_id': id})
        if result.deleted_count > 0:
            return {'status': 200, 'message': 'Data guru berhasil dihapus'}
        return {'status': 400, 'message': 'Tidak ada data yang dihapus'}
    
    def delete_all_teacher(self) -> Dict[str, Union[int, str]]:
        result = mongo.db.teachers.delete_many({})
        if result.deleted_count > 0:
            return {'status': 200, 'message': 'Data guru berhasil dihapus'}
        return {'status': 400, 'message': 'Tidak ada data yang dihapus'}