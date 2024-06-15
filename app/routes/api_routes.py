from flask import request, redirect, Blueprint, jsonify, url_for, flash
from markupsafe import escape
from app.controllers.question_controller import QuestionController as qsc
from app.controllers.subject_controller import SubjectController as scc
from app.controllers.student_controller import StudentController as sc
from app.controllers.teacher_controller import TeacherController as tc
from app.controllers.admin_controller import AdminController as ac
from app.controllers.exam_controller import ExamController as ec
from app.controllers.class_controller import ClassController as cc
from app.services.auth_service import AuthService as asv
from flask_login import login_required, current_user
from app import socket
from flask_socketio import emit

api_view = Blueprint('api_view', __name__, url_prefix='/api')

class ApiBlueprint:
    def __init__(self, api, admin, teacher, student, auth, exam, quest, subject, clas):
        self.api_view = api
        self.admin_controller = admin
        self.teacher_controller = teacher
        self.student_controller = student
        self.auth_service = auth
        self.exam_controller = exam
        self.quest_controller = quest
        self.subject_controller = subject
        self.class_controller = clas
        self.register_routes()

    def register_routes(self):
        self.api_view.add_url_rule('/add/<string:entities>', view_func=self.add_data, methods=['POST'])
        self.api_view.add_url_rule('/get/<string:type>/<string:entities>', view_func=self.get_data, methods=['GET'])
        self.api_view.add_url_rule('/delete/<string:entities>', view_func=self.delete_data, methods=['POST'])
        self.api_view.add_url_rule('/update/<string:entities>', view_func=self.update_data, methods=['POST'])
        self.api_view.add_url_rule('/delete_all/<string:entities>', view_func=self.delete_all_data, methods=['POST'])
        self.api_view.add_url_rule('/tracking/get/<string:entities>', view_func=self.tracking, methods=['GET', 'POST'])
        self.api_view.add_url_rule('/ujian/<string:action>', view_func=self.exam, methods=['GET'])
        self.api_view.add_url_rule('/test', view_func=self.test, methods=['GET'])

    @login_required
    def add_data(self, entities):
        entities = escape(entities)
        if current_user.role != 'admin':
            return jsonify({'status': 403, 'message': 'Anda tidak memiliki izin untuk mengakses sumber daya ini'})
        
        if not request.form:
            return jsonify({'status': 400, 'message': 'Data Gagal Ditambahkan'})
        
        data = request.form.to_dict()

        if entities == 'guru':
            result = self.teacher_controller.add_teacher(data)

        elif entities == 'siswa':
            result = self.student_controller.add_student(data)
        
        elif entities == 'ujian':
            result = self.exam_controller.add_exam(data, current_user.name)
            return redirect(url_for('admin_views.kelola_ujian_add', r=result))
        
        elif entities == 'soal':
            result = self.quest_controller.add_question(data)
        
        elif entities == 'mapel':
            result = self.subject_controller.add_subject(data)
        
        elif entities == 'kelas':
            result = self.class_controller.add_class(data)

        if result:
            return jsonify(result)
        
        return jsonify({'status': 404, 'message': 'Not Found'})

    @login_required
    def get_data(self, type:str, entities:str):        

        program_keahlian = request.args.get('program_keahlian') if request.args.get('program_keahlian') else None
        jenjang_kelas = request.args.get('jenjang_kelas') if request.args.get('jenjang_kelas') else None

        entities = escape(entities)
        type = escape(type)
        if entities == 'guru':
            if current_user.role != 'admin':
                return jsonify({'status': 403, 'message': 'Anda tidak memiliki izin untuk mengakses sumber daya ini'})
            
            if type == 'count':
                return jsonify({'status': 200, 'data': self.teacher_controller.get_teacher_count()})
            
            if request.args.get('id'):
                teacher_data = self.teacher_controller.get_teacher_data_by_id(request.args.get('id'))
            teacher_data = self.teacher_controller.get_teacher_data(None)
            return jsonify(teacher_data)

        elif entities == 'siswa':
            if type == 'count':
                return jsonify({'status': 200, 'data': self.student_controller.get_user_count()})
            
            if request.args.get('id'):
                student_data = self.student_controller.get_student_data_by_id(request.args.get('id'))
                return jsonify(student_data)
            student_data = self.student_controller.get_student_data(request.args.get('id'), program_keahlian, jenjang_kelas)
            return jsonify(student_data)
            
        elif entities == 'ujian':
            if current_user.role != 'admin':
                exam_data = None
                
                if type == 'daftar':
                    exam_data = self.exam_controller.get_exam_data_by_category(
                        current_user.id, current_user.departemen, current_user.position, current_user.level
                    )
                    print(exam_data)
                elif type == 'daftar_selesai':
                    exam_data = self.exam_controller.get_exam_data_by_category_done(current_user.id)
                
                if exam_data:
                    return jsonify(exam_data)
                else:
                    return jsonify({'status': 403, 'message': 'not found'})
            
            if type == 'count':
                return jsonify({'status': 200, 'data': self.exam_controller.get_exam_count()})
            
            if request.args.get('id'):
                exam_data = self.exam_controller.get_exam_data_by_id(request.args.get('id'))
            exam_data = self.exam_controller.get_exam_data(request.args.get('id'))
            return jsonify(exam_data)
            
        elif entities == 'soal':
            if type == 'count':
                id_exam = request.args.get('id')
                return jsonify({'status': 200, 'data': self.quest_controller.get_quest_count_by_id(id_exam)})
            
            if request.args.get('exam_id'):
                quest_data = self.quest_controller.get_question_data_by_exam_id(request.args.get('exam_id'))
                return jsonify(quest_data)
            elif request.args.get('id'):
                quest_data = self.quest_controller.get_question_data_by_id(request.args.get('id'))
                return jsonify(quest_data)
            quest_data = self.quest_controller.get_question_data(request.args.get('id'))
            return jsonify(quest_data)
            
        elif entities == 'mapel':
            if type == 'count':
                return jsonify({'status': 200, 'data': self.subject_controller.get_subject_count()})
            
            if request.args.get('id'):
                subject_data = self.subject_controller.get_subject_by_id(request.args.get('id'))
            subject_data = self.subject_controller.get_subject_data(None)
            return jsonify(subject_data)
            
        elif entities == 'kelas':
            if type == 'count':
                return jsonify({'status': 200, 'data': self.class_controller.get_class_count()})
            
            if request.args.get('id'):
                class_data = self.class_controller.get_class_by_id(request.args.get('id'))
                return jsonify(class_data)
            class_data = self.class_controller.get_class_data(None)
            return jsonify(class_data)
            
        return jsonify({'status': '404', 'message': 'Not Found'})

    @login_required
    def delete_data(self, entities):
        entities = escape(entities)
        if current_user.role != 'admin':
            return jsonify({'status': 403, 'message': 'Anda tidak memiliki izin untuk mengakses sumber daya ini'})
        id = escape(request.form['id'])

        if not id:
            return jsonify({'status': 400, 'message': 'Data Gagal Dihapus'})
        
        if entities == 'guru' and current_user.role == 'admin':
            result = self.teacher_controller.delete_teacher(id)
        
        elif entities == 'siswa':
            result = self.student_controller.delete_student(id)
        
        elif entities == 'ujian':
            result = self.exam_controller.delete_exam(id)
        
        elif entities == 'soal':
            result = self.quest_controller.delete_question(id)
        
        elif entities == 'mapel':
            result = self.subject_controller.delete_subject(id)
        
        elif entities == 'kelas':
            result = self.class_controller.delete_class(id)
        if result:
            return jsonify(result)
        return jsonify({'status': 404, 'message': 'Not Found'})

        

    @login_required
    def update_data(self, entities):
        entities = escape(entities)
        if current_user.role != 'admin':
            return jsonify({'status': 403, 'message': 'Anda tidak memiliki izin untuk mengakses sumber daya ini'})

        if not request.form:
            return jsonify({'status': 400, 'message': 'Terjadi Kesalahan'})
        
        data = request.form.to_dict()

        if entities == 'guru':
            result = self.teacher_controller.update_teacher(data)
        elif entities == 'siswa':
            result = self.student_controller.update_student(data)
        elif entities == 'ujian':
            result = self.exam_controller.update_exam(data)
            return redirect(url_for('admin_views.kelola_ujian_ubah', id=data['id'], r=result))
        elif entities == 'soal':
            result = self.quest_controller.update_question(data)
        elif entities == 'mapel':
            result = self.subject_controller.update_subject(data)
        elif entities == 'kelas':
            result = self.class_controller.update_class(data)

        if result:
            return jsonify(result)
        return jsonify({'status': 404, 'message': 'Not Found'})


    @login_required
    def delete_all_data(self, entities):
        entities = escape(entities)
        if not request.form['password']:
            return jsonify({'status': 400, 'message': 'Silahkan Masukan Password'})

        if current_user.role != 'admin':
            return jsonify({'status': 403, 'message': 'Anda tidak memiliki izin untuk mengakses sumber daya ini'})
        user_data = self.admin_controller.get_admin_by_id(current_user.id)
        validate_pw = self.auth_service.hash_password(escape(request.form['password']))

        if validate_pw != user_data['password']:
            return jsonify({'status': 400, 'message': 'Password yang Anda masukkan salah'})
        if entities == 'guru':
            result = self.teacher_controller.delete_all_teacher()
        elif entities == 'siswa':
            result = self.student_controller.delete_all_student()
        elif entities == 'ujian':
            result = self.exam_controller.delete_all_exam()
        elif entities == 'soal':
            id_exam = request.form['id']
            result = self.quest_controller.delete_all_question(id_exam)
        elif entities == 'mapel':
            result = self.subject_controller.delete_all_subject()
        elif entities == 'kelas':
            result = self.class_controller.delete_all_class()

        if result:
            return jsonify(result)
        return jsonify({'status': 404, 'message': 'Not Found'})
    
    @login_required
    def tracking(self, entities):
        if current_user.role != 'admin':
            return jsonify({'status': 403, 'message': 'Anda tidak memiliki izin untuk mengakses sumber daya ini'})

        if entities == 'user_online':
            return jsonify(self.admin_controller.get_user_logger())
    
    @login_required
    def exam(self, action):
        if action == 'kerjakan':
            id_exam = request.args.get('id')
            if not id_exam:
                return jsonify({'status': 400, 'message': 'Gagal Mengambil Data'})
            
            data = {
                'id_exam': escape(id_exam),
                'program_keahlian': current_user.departemen,
                'jenjang_kelas': current_user.level,
                'kelas': current_user.position
            }
            
            result = self.exam_controller.launch_exam(data, current_user.id)
            if result['status'] == 200:
                return redirect(url_for('student_views.kerjakan_ujian', ei=id_exam, ri=result['inserted_id']))
            return jsonify(result)
        
        if action == 'set_active':
            id_exam = request.args.get('id')
            if not id_exam:
                return jsonify({'status': 400, 'message': 'Gagal Mengambil Data'})
            
            if current_user.role != 'admin':
                return jsonify({'status': 403, 'message': 'Anda tidak memiliki izin untuk mengakses sumber daya ini'})
            
            result = self.exam_controller.set_active_exam(id_exam)
            if result['status'] == 200:
                socket.emit('active_exam', 'oke')
                return jsonify({'status': 200, 'message': 'Ujian Berhasil Diaktifkan'})
            return jsonify(result)



    
    def test(self):
        return jsonify(self.admin_controller.test(current_user.id))

api_blueprint = ApiBlueprint(api_view, ac(), tc(), sc(), asv(), ec(), qsc(), scc(), cc())

