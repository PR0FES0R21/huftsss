from app.models.class_model import ClassModel as cm
from markupsafe import escape
from app.services.checking import Checking
from bson import ObjectId

class ClassController:
    def __init__(self):
        self.class_model = cm()
        self.checking_service = Checking()

    def add_class(self, data):
        required_fields = ['nama-kelas', 'wali-kelas', 'jenjang', 'jurusan', 'ruang-kelas']
        if not all(field in data for field in required_fields):
            return {'status': 400, 'message': 'Semua field harus diisi'}
        data = {
            'nama_kelas': escape(data['nama-kelas']),
            'wali_kelas': escape(data['wali-kelas']), 
            'jenjang': escape(data['jenjang']),
            'program_keahlian': escape(data['jurusan']),
            'ruang_kelas': escape(data['ruang-kelas']),
            'jumlah_siswa': escape(data['jumlah-siswa']),
        }
        return self.class_model.add_class(data)

    def get_class_data(self, query=None):
        return self.class_model.get_class_data(query)

    def get_class_by_id(self, id:str):
        if not self.checking_service.is_valid_object_id(id):
            return {'status': 400, 'message': 'Id Tidak Valid'}
        return self.get_class_data({'_id': ObjectId(id)})
    
    def get_class_count(self):
        return self.class_model.get_class_count()

    def delete_class(self, id):
        if not self.checking_service.is_valid_object_id(id):
            return {'status': 400, 'message': 'Id Tidak Valid'}
        return self.class_model.delete_class(ObjectId(id))

    def update_class(self, data):
        if not self.checking_service.is_valid_object_id(data['id']):
            return {'status': 400, 'message': 'Id Tidak Valid'}
        data = {
            '_id': ObjectId(data['id']),
            'nama_kelas': escape(data['nama-kelas']),
            'wali_kelas': escape(data['wali-kelas']), 
            'jenjang': escape(data['jenjang']),
            'program_keahlian': escape(data['jurusan']),
            'ruang_kelas': escape(data['ruang-kelas']),
            'jumlah_siswa': escape(data['jumlah-siswa']),
        }
        return self.class_model.update_class(data)

    def delete_all_class(self):
        return self.class_model.delete_all_class()