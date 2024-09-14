from flask import Blueprint, render_template, redirect, url_for, request, jsonify
from app.controllers.admin_controller import AdminController as ac
from app.controllers.question_controller import QuestionController as qc
from app.controllers.exam_controller import ExamController 
from app.controllers.class_controller import ClassController
from app.controllers.subject_controller import SubjectController
from app.controllers.teacher_controller import TeacherController
from app.controllers.student_controller import StudentController
from flask_login import current_user, login_required
from .socket_route import get_active_user_ssr
from device_detector import DeviceDetector
from app.services.tracking import Tracking
import time

admin_view = Blueprint('admin_views', __name__)

@admin_view.record
def record(state):
    with state.app.app_context():
        state.app.jinja_env.globals.update(admin_url_for=url_for)

def admin_required(func):
    def wrapper(*args, **kwargs):
        if current_user.role != 'admin':
            return redirect(url_for('student_views.index')) if current_user.role == 'student' else redirect(url_for('teacher_views.index'))
        return func(*args, **kwargs)
    wrapper.__name__ = func.__name__
    wrapper.__doc__ = func.__doc__
    return wrapper

class AdminView:

    def __init__(self, admin_v, admin_c):
        self.admin_views = admin_v
        self.admin_controller = admin_c
        self.register_views()

    def register_views(self):
        self.admin_views.add_url_rule('/dashboard', view_func=self.index, methods=['GET'])
        self.admin_views.add_url_rule('/dashboard', view_func=self.index, methods=['GET'])
        self.admin_views.add_url_rule('/kelola_guru', view_func=self.kelola_guru, methods=['GET'])
        self.admin_views.add_url_rule('/kelola_siswa', view_func=self.kelola_siswa, methods=['GET'])
        self.admin_views.add_url_rule('/kelola_kelas', view_func=self.kelola_kelas, methods=['GET'])
        self.admin_views.add_url_rule('/kelola_mapel', view_func=self.kelola_mapel, methods=['GET'])
        self.admin_views.add_url_rule('/kelola_ujian', view_func=self.kelola_ujian, methods=['GET'])
        self.admin_views.add_url_rule('/kelola_ujian/tambah_data', view_func=self.kelola_ujian_add, methods=['GET'])
        self.admin_views.add_url_rule('/kelola_ujian/ubah_data', view_func=self.kelola_ujian_ubah, methods=['GET'])
        self.admin_views.add_url_rule('/kelola_ujian/kelola_soal', view_func=self.kelola_soal, methods=['GET'])
        self.admin_views.add_url_rule('/analitik', view_func=self.analitik, methods=['GET'])
        self.admin_views.add_url_rule('/profile', view_func=self.profile, methods=['GET'])
        self.admin_views.add_url_rule('/logout', view_func=self.logout, methods=['GET'])
        self.admin_views.add_url_rule('/test', view_func=self.test, methods=['GET'])

    def time_ago(self, timestamp):
        now = int(time.time())
        diff = now - timestamp
        
        if diff < 60:
            return f"{diff} detik yang lalu"
        elif diff < 3600:
            return f"{diff // 60} menit yang lalu"
        elif diff < 86400:
            return f"{diff // 3600} jam yang lalu"
        else:
            return f"{diff // 86400} hari yang lalu"


    @login_required
    @admin_required
    def index(self):

        teacher_count = self.admin_controller.get_user_count('teacher')
        student_count = self.admin_controller.get_user_count('student')

        active_user = get_active_user_ssr()
        cc = ClassController()
        class_count = cc.get_class_count()

        user_actifities = Tracking().get(True)
        for actifity in user_actifities:
            try:
                actifity['time_ago'] = self.time_ago(actifity['waktu_aktifitas'])
            except:
                actifity['time_ago'] = 'Terjadi Kesalahan'

        data = {
            'name': current_user.name,
            'position': current_user.position,
            'teacher_count': teacher_count,
            'student_count': student_count,
            'active_user_count': active_user['active_user'],
            'class_count': class_count,
            'tracking_data': user_actifities
        }
        return render_template('admin/index.html', data=data)
        
    
    # halaman kelola guru
    @login_required
    @admin_required
    def kelola_guru(self):

        instance_subject_controller = SubjectController()
        subject_data = instance_subject_controller.get_subject_data(None)

        teacher_count = self.admin_controller.get_user_count('teacher')
        data = {
            'name': current_user.name,
            'position': current_user.position,
            'teacher_count': teacher_count,
            'subject_data': subject_data
        }
        return render_template('admin/kelola_guru.html', data=data)
    
    @login_required
    @admin_required
    def kelola_siswa(self):
        student_count = self.admin_controller.get_user_count('student')
        instance_class_controller = ClassController()
        class_data = instance_class_controller.get_class_data()
        data = {
            'name': current_user.name,
            'position': current_user.position,
            'student_count': student_count,
            'class_data': class_data
        }
        return render_template('admin/kelola_siswa.html', data=data)
    
    @login_required
    @admin_required
    def kelola_ujian(self):
        ec = ExamController()
        exam_count = ec.get_exam_count()
        data = {
            'name': current_user.name,
            'position': current_user.position,
            'exam_count': exam_count
        }
        return render_template('admin/kelola_ujian.html', data=data)
    
    @login_required
    @admin_required
    def kelola_ujian_add(self):
        instance_class_controller = ClassController()
        instance_subject_controller = SubjectController()

        class_data = instance_class_controller.get_class_data()
        subject_data = instance_subject_controller.get_subject_data(None)

        data = {
            'name': current_user.name,
            'position': current_user.position,
            'class_data': class_data,
            'subjects_data': subject_data
        }
        return render_template('admin/tambah_ujian.html', data=data)
    
    @login_required
    @admin_required
    def kelola_ujian_ubah(self):
        id = request.args.get('id')
        ec = ExamController()
        instance_subject_controller = SubjectController()
        subject_data = instance_subject_controller.get_subject_data(None)
        instance_class_controller = ClassController()
        class_data = instance_class_controller.get_class_data()
        data = {
            'id': id,
            'exam_data': ec.get_exam_data_by_id(id),
            'name': current_user.name,
            'position': current_user.position,
            'subjects': subject_data,
            'classes': class_data
        }
        return render_template('admin/edit_ujian.html', data=data)
    
    @login_required
    @admin_required
    def kelola_soal(self):
        id_exam = request.args.get('id')
        quest_count = qc.get_quest_count_by_id(id_exam)
        data = {
            'id_exam': id_exam,
            'quest_count': quest_count,
            'name': current_user.name,
            'position': current_user.position,
        }
        return render_template('admin/kelola_soal.html', data=data)
    
    def kelola_kelas(self):
        cc = ClassController()
        class_count = cc.get_class_count()

        instance_teacher_controller = TeacherController()
        teacher_data = instance_teacher_controller.get_teacher_data(None)
        data = {
            'name': current_user.name,
            'position': current_user.position,
            'class_count': class_count,
            'teacher_data': teacher_data
        }
        return render_template('admin/kelola_kelas.html', data=data)
    
    def kelola_mapel(self):
        sc = SubjectController()
        subject_count = sc.get_subject_count()

        data = {
            'name': current_user.name,
            'position': current_user.position,
            'subject_count': subject_count
        }
        return render_template('admin/kelola_mata_pelajaran.html', data=data)
    
    def analitik(self):
        data = {
            'name': current_user.name,
            'position': current_user.position,
        }
        return render_template('admin/analitik.html', data=data)
    
    def profile(self):
        entities = request.args.get('entities')
        id = request.args.get('id') if request.args.get('id') else current_user.id

        if entities and entities == 'student':
            user_profile_data = StudentController().get_student_data_by_id(id)
        elif entities and entities == 'teacher':
            user_profile_data = TeacherController().get_teacher_data_by_id(id)[0]
        else:
            user_profile_data = self.admin_controller.get_admin_by_id(id)

        data = {
            'user_profile': user_profile_data,
            'name': current_user.name,
            'position': current_user.position,
        }
        return render_template('admin/profile.html', data=data)
    
    def logout(self):
        return redirect('/auth/logout')
    
    def test(self):
        user_agent = request.args.get('ua')
        print(user_agent)
        if user_agent:
            device = DeviceDetector(user_agent).parse()
            device_info = {
                'device_type': device.device_type(),
                'os_name': device.os_name(),
                'os_version': device.os_version(),
                'browser_name': device.client_name(),
                'browser_version': device.client_version(),
                'device brand': device.device_brand()
            }
        else:
            device_info = {'error': 'User-Agent header not found'}
        print(device_info)
        return device_info


    
instance_admin_view = AdminView(admin_view, ac())
