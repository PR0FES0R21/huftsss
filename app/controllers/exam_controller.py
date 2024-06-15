from app.models.exam_model import ExamModel
from app.models.question_model import QuestionModel
from bson import ObjectId
from markupsafe import escape
from datetime import datetime
from app.services.auth_service import AuthService
from app.services.checking import Checking
import time

class ExamController:
    def __init__(self):
        self.exam_model = ExamModel()
        self.auht_service = AuthService()
        self.checking_service = Checking()
        self.question_model = QuestionModel()
    
    def get_exam_data(self, query):
        return self.exam_model.get_exam_data(query)
    
    def get_exam_count(self) -> int:
        return self.exam_model.get_exam_count()
    
    def get_exam_data_by_id(self, id:str) -> dict:
        if not self.checking_service.is_valid_object_id(id):
            return {'status': 400, 'message': 'Id Tidak Valid'}
        return self.get_exam_data({'_id': ObjectId(id)})
    
    def add_exam(self, data, pembuat):
        date_created = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        data = {
            'nama_ujian': escape(data['nama-ujian']),
            'jenis_ujian': escape(data['jenis-ujian']),
            'mata_pelajaran': escape(data['mata-pelajaran']),
            'jenjang_kelas': escape(data['jenjang-kelas']),
            'program_keahlian': escape(data['program-keahlian']),
            'kelas': escape(data['kelas']),
            'tanggal_ujian': escape(data['tanggal-ujian']),
            'waktu_pengerjaan': escape(data['waktu-pengerjaan']),
            'metode_jawaban': escape(data['metode-jawaban']),
            'metode_penilaian': escape(data['metode-penilaian']),
            'acak_soal': escape(data['acak-soal']),
            'acak_jawaban': escape(data['acak-jawaban']),
            'tanggal_dibuat': date_created,
            'pembuat': pembuat,
            'status_pengerjaan': '0'
        }
        result = self.exam_model.add_exam(data)
        encode_result = self.auht_service.encode_dict_to_base64(result)
        return encode_result
    
    def update_exam(self, exam:dict) -> str:

        data = {
            "_id": ObjectId(exam['id']),
            'nama_ujian': escape(exam['nama-ujian']),
            'jenis_ujian': escape(exam['jenis-ujian']),
            'mata_pelajaran': escape(exam['mata-pelajaran']),
            'kelas': escape(exam['kelas']),
            'program_keahlian': escape(exam['program-keahlian']),
            'tanggal_ujian': escape(exam['tanggal-ujian']),
            'waktu_pengerjaan': escape(exam['waktu-pengerjaan']),
            'metode_jawaban': escape(exam['metode-jawaban']),
            'metode_penilaian': escape(exam['metode-penilaian']),
            'acak_soal': escape(exam['acak-soal']),
            'acak_jawaban': escape(exam['acak-jawaban']),
        }

        result = self.exam_model.update_exam(data)
        encode_result = self.auht_service.encode_dict_to_base64(result)
        return encode_result
    
    def delete_exam(self, id:str) -> dict:
        if not self.checking_service.is_valid_object_id(id):
            return {'status': 400, 'message': 'ID tidak valid'}
        self.question_model.delete_all_question({'id_ujian': id})
        return self.exam_model.delete_exam(ObjectId(id))
    
    def get_exam_data_by_teacher_id(self, id:str) -> dict:
        if not self.checking_service.is_valid_object_id(id):
            return {'status': 400, 'message': 'ID tidak valid'}
        return self.get_exam_data({'pembuat': id})
    
    def delete_all_exam(self) -> dict:
        self.question_model.delete_all_question()
        return self.exam_model.delete_all_exam()
    
    def get_exam_data_by_category(self, user_id, departemen, position, level):
        if not self.checking_service.is_valid_object_id(user_id):
            return {'status': 400, 'message': 'ID tidak valid'}
        
        pipelines = [
            {
                '$match': {
                    'program_keahlian': {
                        '$in': ['all', departemen]
                    },
                    'jenjang_kelas': {
                        '$in': ['all', level]
                    },
                    'kelas': {
                        '$in': ['all', position]
                    }
                }
            },
            {
                '$lookup': {
                    'from': 'exam_logs',
                    'localField': '_id',
                    'foreignField': 'exam_id',
                    'as': 'exam_logs'
                }
            },
            {
                '$addFields': {
                    'status': {
                        '$cond': {
                            'if': {
                                '$and': [
                                    {'$gt': [{'$size': '$exam_logs'}, 0]},
                                    {
                                        '$gt': [
                                            {
                                                '$size': {
                                                    '$filter': {
                                                        'input': '$exam_logs',
                                                        'as': 'eh',
                                                        'cond': {'$eq': ['$$eh.user_id', ObjectId(user_id)]}
                                                    }
                                                }
                                            }, 0
                                        ]
                                    }
                                ]
                            },
                            'then': '1',
                            'else': '0'
                        }
                    }
                }
            },
            {
                '$project': {
                    '_id': 1,
                    'mata_pelajaran': 1,
                    'status': 1,
                    'nama_ujian': 1,
                    'waktu_pengerjaan': 1,
                    'tanggal_ujian': 1,
                    'status_pengerjaan': 1,
                }
            }
        ]
        return self.exam_model.get_exam_data_by_category(pipelines)
    
    def get_exam_data_by_category_done(self, user_id):
        if not self.checking_service.is_valid_object_id(user_id):
            return {'status': 400, 'message': 'ID tidak valid'}
        
        pipelines = [
            {
                '$match': {
                    'user_id': ObjectId(user_id),
                }
            },
            {'$addFields': 
                {
                    'status': {
                        '$cond': {
                            'if': {'$gt': ['$nilai_ujian', 72]},
                            'then': 1,
                            'else': 0
                        }
                    }
                }
            }
        ]
        return self.exam_model.get_exam_data_by_category_done(pipelines)
    
    def set_active_exam(self, id:str) -> dict:
        if not self.checking_service.is_valid_object_id(id):
            return {'status': 400, 'message': 'ID tidak valid'}
        return self.exam_model.set_active_exam(ObjectId(id))

    def launch_exam(self, data, user_id):
        # Ekstraksi data ujian dari data yang diterima
        exam_id = data.get('id_exam')
        program_keahlian = data.get('program_keahlian')
        jenjang_kelas = data.get('jenjang_kelas')

        # Cek apakah data ujian tersedia di database
        exam_data = {'_id': ObjectId(exam_id), 'program_keahlian': program_keahlian, 'jenjang_kelas': jenjang_kelas}
        if not self.get_exam_data(exam_data):
            return {'status': 400, 'message': 'Data ujian tidak ditemukan'}

        # Cek apakah user sudah mengerjakan ujian ini sebelumnya
        exam_logs_query = {'exam_id': ObjectId(exam_id), 'user_id': ObjectId(user_id)}
        if self.exam_model.get_exam_logs_data(exam_logs_query):
            return {'status': 409, 'message': 'Anda sudah mengerjakan ujian ini'}

        # Jika belum, tambahkan record baru
        inisiasi_exam = {'exam_id': ObjectId(exam_id), 'user_id': ObjectId(user_id), 'start_time': int(time.time()), 'end_time': '', 'track_data': ''}
        existing_launch_exam = self.exam_model.get_user_launch_exam(exam_logs_query)
        if existing_launch_exam:
            return existing_launch_exam
        else:
            id_receive = self.exam_model.add_user_launch_exam(inisiasi_exam)
            return id_receive
        
    def submit_exam(self, data_exam, exam_id, record_id, user_id, nilai):
        query = {'_id': ObjectId(record_id),'exam_id': ObjectId(exam_id),'user_id': ObjectId(user_id)}
        result = self.exam_model.validate_record_data(query)
        if not result:
            return {'status': 403, 'message': 'Anda Tidak Memiliki Akses ke Ujian ini'}
        
        if result['end_time']:
            return {'status': 409, 'message': 'Anda Sudah Mengerjakan Ujian Ini'}
        updated = self.exam_model.exam_adition_confirmation(ObjectId(result['_id']), int(time.time()))
        if updated['status'] != 200:
            return {'status': 400, 'message': 'Terjadi Kesalahan Saat Mengirim Data'}
        data = {
            'exam_id': ObjectId(exam_id),
            'user_id': ObjectId(user_id),
            'waktu_mulai': result['start_time'],
            'nilai_ujian': nilai,
            'mata_pelajaran': 'Iformatika',
            'waktu_selesai': int(time.time()),
            'nilai_rata_rata': 78
        }
        logs = self.exam_model.insert_exam_logs_data(data)
        if logs['status'] != 200:
            return {'status': 400, 'message': 'Terjadi Kesalahan'}
        return self.exam_model.save_exam_history(data_exam)
            

        
    
    # def launch_exam(self, data, user_id):
    #     # cek, apakah exam dengan kriteria yang dikirim tersedia didatabase
    #     id_exam = data['id_exam']
    #     data = {
    #         '_id': ObjectId(id_exam),
    #         'program_keahlian': data['program_keahlian'],
    #         'jenjang_kelas': data['jenjang_kelas']
    #     }
    #     # cek apakah ada data dengan kriteria data di atas
    #     if self.get_exam_data(data):
    #         query = {
    #             'exam_id': ObjectId(id_exam),
    #             'user_id': ObjectId(user_id)
    #             }
    #         # jika ada, maka...
    #         # cek, apakah user sudah mengerjakan ujian ini...
    #         if not self.exam_model.get_exam_logs_data(query):
    #             cek = self.exam_model.get_user_launch_exam({'exam_id': ObjectId(id_exam), 'user_id': ObjectId(user_id),})
    #             if cek:
    #                 return cek
    #             inisiasi_exam = {
    #                 'exam_id': ObjectId(id_exam),
    #                 'user_id': ObjectId(user_id),
    #                 'start_time': int(time.time()),
    #                 'end_time': '',
    #                 'track_data': ''
    #             }
    #             id_receive = self.exam_model.add_user_launch_exam(inisiasi_exam)
    #             return id_receive
    #         return {'status': 409, 'message': 'anda sudah mengerjakan ujian ini'}
    #     return {'status': 400, 'message': 'data tidak ditemukan'}

    
