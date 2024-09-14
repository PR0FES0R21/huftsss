from flask import redirect, jsonify
from markupsafe import escape
from app.controllers.admin_controller import AdminController
from app.controllers.teacher_controller import TeacherController
from app.controllers.student_controller import StudentController

from flask import request, redirect

def role_based_prefix_middleware(func):
    def wrapper(*args, **kwargs):
        user_cookie = escape(request.cookies.get('s0m3t2'))
        if not user_cookie:
            return jsonify({'status': 403, 'message': 'Anda tidak memiliki izin untuk mengakses sumber daya ini no cookie'})

        controllers = [AdminController(), TeacherController(), StudentController()]
        user_data = next((c.check_cookie(user_cookie) for c in controllers if c.check_cookie(user_cookie)), None)

        if not user_data:
            return jsonify({'status': 403, 'message': 'Anda tidak memiliki izin untuk mengakses sumber daya ini no userd data'})
        
        role = user_data['role']
        if role == 'siswa':
            desired_prefix = '/siswa'
        elif role == 'guru':
            desired_prefix = '/guru'
        elif role == 'admin':
            desired_prefix = '/admin'
        else:
            return jsonify({'status': 403, 'message': 'Anda tidak memiliki izin untuk mengakses sumber daya ini tiak valid'})

        if not request.path.startswith(desired_prefix):
            return jsonify({'status': 403, 'message': 'Anda tidak memiliki izin untuk mengakses sumber daya ini tidk semuai'})

        return func(*args, **kwargs)

    wrapper.__name__ = func.__name__
    wrapper.__doc__ = func.__doc__

    return wrapper

