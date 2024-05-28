from flask import Blueprint, render_template, redirect, url_for, request, flash
from app.controllers.student_controller import StudentController
from app.controllers.question_controller import QuestionController as qc
from app.controllers.exam_controller import ExamController as ec
from flask_login import current_user, login_required
import random


student_view = Blueprint('student_views', __name__)

def student_required(func):
    def wrapper(*args, **kwargs):
        if current_user.role != 'student':
            return redirect(url_for('admin_views.index')) if current_user.role == 'admin' else redirect(url_for('teacher_views.index'))
        return func(*args, **kwargs)
    wrapper.__name__ = func.__name__
    wrapper.__doc__ = func.__doc__
    return wrapper

class StudentView:

    def __init__(self, student_views, student_controller, qc, ec):
        self.student_views = student_views
        self.student_controller = student_controller
        self.question_controller = qc
        self.exam_controller = ec
        self.register_views()

    def register_views(self):
        self.student_views.add_url_rule('/dashboard', view_func=self.index, methods=['GET'])
        self.student_views.add_url_rule('/ujian', view_func=self.daftar_ujian, methods=['GET'])
        self.student_views.add_url_rule('/hasil_ujian', view_func=self.hasil_ujian, methods=['GET'])
        self.student_views.add_url_rule('/evaluasi', view_func=self.evaluasi, methods=['GET'])
        self.student_views.add_url_rule('/profile', view_func=self.profile, methods=['GET'])
        self.student_views.add_url_rule('/logout', view_func=self.logout, methods=['GET'])
        self.student_views.add_url_rule('kerjakan_ujian', view_func=self.kerjakan_ujian, methods=['GET', 'POST'])

    @login_required
    @student_required
    def index(self):
        data = {
            'name': current_user.name,
            'position': current_user.position + ' ' + current_user.departemen
        }
        return render_template('student/index.html', data=data)
    
    @login_required
    @student_required
    def daftar_ujian(self):
        data = {
            'name': current_user.name,
            'position': current_user.position + ' ' + current_user.departemen
        }
        return render_template('student/daftar_ujian.html', data=data)
    
    @login_required
    @student_required
    def kerjakan_ujian(self):
        exam_id = request.args.get('ei')
        record_id = request.args.get('ri')
        quest_data = self.question_controller.get_question_data_by_exam_id(exam_id)
        
        if request.method == 'GET':
            data = {
                'name': current_user.name,
                'position': current_user.position + ' ' + current_user.departemen
            }
            if not exam_id:
                return redirect(url_for('student_views.index'))
            random.shuffle(quest_data)
            return render_template('student/halaman_ujian.html', data=data, quest_data=quest_data, exam_id=exam_id, record_id=record_id)











        if request.method == 'POST':
            question_verified_data = []
            jawaban_benar = 0
            question_dict = {q['_id']: q for q in quest_data}
            print('======================================')
            print(question_dict)
            print('======================================')
            print(quest_data)
            print('===========================================')
            print(request.form.to_dict)
            
            for key, value in request.form.items():
                print(key)
                if key.startswith('soal-'):
                    soal_id = key.split('-')[1]
                    jawaban = value
                    
                    question = question_dict.get(soal_id)
                    
                    if question:
                        if jawaban == question['kunci_jawaban']:
                            question_verified_data.append({
                                'user_id': current_user.id,
                                'exam_id': exam_id,
                                'soal_id': soal_id,
                                'status_jawaban': 1
                            })
                            jawaban_benar += 1
                        else:
                            question_verified_data.append({
                                'user_id': current_user.id,
                                'exam_id': exam_id,
                                'soal_id': soal_id,
                                'status_jawaban': 0,
                            })
                    else:
                        print(f"Tidak ada pertanyaan yang sesuai dengan id_soal {soal_id}")
            nilai = (jawaban_benar / len(quest_data)) * 100
            print(question_verified_data)
            result = self.exam_controller.submit_exam(question_verified_data, exam_id, record_id, current_user.id, nilai)
            if result['status'] == 200:
                flash(result['message'], 'success')
                return redirect(url_for('student_views.kerjakan_ujian', ei=exam_id, ri=record_id))
            else:
                flash(result['message'], 'error')
                return redirect(url_for('student_views.kerjakan_ujian', ei=exam_id, ri=record_id))

            
            

            

        
    @login_required
    @student_required
    def hasil_ujian(self):
        data = {
            'name': current_user.name,
            'position': current_user.position + ' ' + current_user.departemen
        }
        return render_template('student/hasil_ujian.html', data=data)
    
    @login_required
    @student_required
    def evaluasi(self):
        data = {
            'name': current_user.name,
            'position': current_user.position + ' ' + current_user.departemen
        }
        return render_template('student/evaluasi.html', data=data)
    
    @login_required
    @student_required
    def profile(self):
        return render_template('student/profile.html')
    
    @login_required
    @student_required
    def logout(self):
        return redirect(url_for('auth_views.logout'))
    




    
instance_student_view = StudentView(student_view, StudentController(), qc(), ec())
