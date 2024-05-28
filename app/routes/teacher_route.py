from flask import Blueprint, render_template, redirect, url_for
from app.controllers.teacher_controller import TeacherController
from flask_login import current_user, login_required

teacher_view = Blueprint('teacher_views', __name__)

class TeacherView:

    def __init__(self, teacher_views, teacher_controller):
        self.teacher_views = teacher_views
        self.teacher_controller = teacher_controller
        self.register_views()

    def register_views(self):
        self.teacher_views.add_url_rule('/dashboard', view_func=self.index, methods=['GET'])

    @login_required
    def index(self):

        if current_user.role != 'teacher':
            return redirect(url_for('admin_views.index')) if current_user.role == 'admin' else redirect(url_for('student_views.index'))

        id = None
        return self.teacher_controller.get_teacher_data(id)

    
instance_teacher_view = TeacherView(teacher_view, TeacherController())
