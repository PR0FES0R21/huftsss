from flask import Flask, render_template, jsonify, session
from flask_pymongo import PyMongo
from flask_login import LoginManager
import os
from dotenv import load_dotenv
from os.path import join, dirname
from bson.objectid import ObjectId
from flask_socketio import SocketIO
import random

mongo = PyMongo()
socket = SocketIO()
login_manager = LoginManager()

dotenv_path = join(dirname(dirname(__file__)), '.env')
load_dotenv(dotenv_path)

def create_app():

    # ----------------------------------------------------------
    # configurasi flask app
    #-----------------------------------------------------------
    # keterangan: mengatur konfigurasi yang diperlukan
    # @ keterangan: lokasi, template, static, pengaturan secret key
    # @ lokasi upload folder, dan token csrf
    # @ note: secret key, dan csrf token diambil dari .evn 
    #-----------------------------------------------------------
    app = Flask(__name__, template_folder='../templates', static_folder='../static')
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
    app.config['TEMPLATES_AUTO_RELOAD'] = True
    app.config['UPLOAD_FOLDER'] = '../static/assets/uploads'
    app.config['WTF_CSRF_SECRET_KEY'] = os.getenv('WTF_CSRF_SECRET_KEY', 'bdjadhahjdaj')

    #----------------------------------------------------------
    # Configurasi CSRF protect
    #----------------------------------------------------------
    from flask_wtf.csrf import CSRFProtect, CSRFError
    app.config['WTF_CSRF_SECRET_KEY'] = os.getenv('WTF_CSRF_SECRET_KEY')
    csrf = CSRFProtect()
    csrf.init_app(app)

    # ---------------------------------------------------------
    # konfigurasi database
    # ---------------------------------------------------------
    # @ keterangan: load mongo_uri dari .env
    # @ catatan: nama database dimasukan ke url setelah /
    # @ inisiasi pymongo kedalam app
    #----------------------------------------------------------
    app.config['MONGO_URI'] = os.environ.get('MONGO_URI')
    mongo.init_app(app)

    data = {
        "nama": "samskuydin",
        "nktam": "79111952",
        "tanggal_lahir": "21-10-1982",
        "jenis_kelamin": "Laki Laki",
        "jabatan": "Guru Pengajar",
        "mata_pelajaran": "2",
        "nomor_telepon": "08154067537",
        "email": "samskuydin.uhuy@gmail.com",
        'jurusan': 'Administrator',
        "peran": "teacher",
        "profile_pengguna": "default_profile.jpg",
        "password": "e9716c327fdc503673f0c4775d9598c93ca2a6b43e31389e53b7eee397a4a409"
    }

    # mongo.db.admins.insert_one(data)
    # mongo.db.admin.insert_one(data)

    # ---------------------------------------------------------
    # Mengimport Bluprint
    # ---------------------------------------------------------
    # import semua blueprint yang ada kedalm cewat_app 
    # catata: registrasi blueprint ke flask agar dapat diakses
    # tentukan url prefix untuk setiap route ( /admin, /user dll )
    # ---------------------------------------------------------
    from app.routes.admin_route import admin_view
    from app.routes.auth_route import auth_view
    from app.routes.student_route import student_view
    from app.routes.teacher_route import teacher_view
    from app.routes.api_routes import api_view
    from app.routes.socket_route import socket_view

    app.register_blueprint(admin_view, url_prefix='/admin')
    app.register_blueprint(auth_view, url_prefix='/auth')
    app.register_blueprint(student_view, url_prefix='/student')
    app.register_blueprint(teacher_view, url_prefix='/teacher')
    app.register_blueprint(api_view, url_prefix='/api')
    app.register_blueprint(socket_view, url_prefix='/socket')

    # --------------------------------------------------------
    # Mengimpor Model
    # --------------------------------------------------------
    # @ Deskripsi: Mengimpor model pengguna
    # --------------------------------------------------------
    from app.models.admin_model import AdminModel
    from app.models.student_model import StudentModel
    from app.models.teacher_model import TeacherModel
    from app.models.user import User

    # --------------------------------------------------------
    # Konfigurasi Login Manager
    # --------------------------------------------------------
    # @ Deskripsi: Mengatur login manager untuk manajemen sesi pengguna
    # --------------------------------------------------------
    login_manager.login_view = 'auth_views.login'
    login_manager.init_app(app)
    
    # --------------------------------------------------------
    # Fungsi Loader Pengguna
    # --------------------------------------------------------
    # @ Deskripsi: Memuat data pengguna berdasarkan ID untuk manajemen sesi
    # --------------------------------------------------------
    @login_manager.user_loader
    def load_user(user_id):
        user_id = ObjectId(user_id)
        admin_model = AdminModel()
        student_model = StudentModel()
        teacher_model = TeacherModel()
        platform = session.get('platform')

        admin_data = admin_model.get_admin_data({'_id': user_id})
        student_data = student_model.get_student_data({'_id': user_id})
        teacher_data = teacher_model.get_teacher_data({'_id': user_id})

        if admin_data:
            return User(admin_data['_id'], admin_data['peran'], admin_data['nama'], admin_data['jabatan'])
        elif student_data:
            return User(student_data['_id'], student_data['peran'], student_data['nama'], student_data['kelas'], student_data['program_keahlian'], student_data['jenjang_kelas'])
        elif teacher_data:
            return User(teacher_data['_id'], teacher_data['peran'], teacher_data['nama'],student_data['jabatan'])
        else:
            return None
        
    
    # Fungsi untuk melakukan pengacakan
    def shuffle_list(lst):
        shuffled_lst = list(lst)
        random.shuffle(shuffled_lst)
        return shuffled_lst

    app.jinja_env.filters['shuffle'] = shuffle_list
        

    #----------------------------------------------------------
    # Penanganan Error hander
    #----------------------------------------------------------
    # @ tampilkan halaman error sesuia jenis errornya
    #----------------------------------------------------------
    @app.errorhandler(500)
    def internal_server_error(error):
        return render_template('errors/500.html'), 500
    
    @app.errorhandler(404)
    def not_found_error(error):
        return render_template('errors/404.html'), 404
    
    @app.errorhandler(CSRFError)
    def csrf_error(e):
        return jsonify({'status': 400, 'message': 'Token CSRF tidak valid, silahkan refresh halmaan atau login ulang'})

    socket.init_app(app)

    return app
