from flask import Blueprint, redirect, url_for
from flask_socketio import emit
from app import socket
from flask_login import current_user
from app import mongo
from flask_login import login_required
import time

socket_view = Blueprint('socket_views', __name__)

connected_users = set()

def admin_required(func):
    def wrapper(*args, **kwargs):
        if current_user.role != 'admin':
            return redirect(url_for('student_views.index')) if current_user.role == 'student' else redirect(url_for('teacher_views.index'))
        return func(*args, **kwargs)
    wrapper.__name__ = func.__name__
    wrapper.__doc__ = func.__doc__
    return wrapper

@socket.on('connect')
def connect():
    if current_user.id is not None:
        # Tambahkan user_id ke set connected_users
        connected_users.add(current_user.id)
        active_users = len(connected_users)
        emit('active_users', {'count': active_users}, broadcast=True)
    else:
        print("No user_id found in session.")

@socket.on('disconnect')
def disconnect():
    if current_user.id is not None:
        # Hapus user_id dari set connected_users
        connected_users.discard(current_user.id)
        active_users = len(connected_users)
        emit('active_users', {'count': active_users}, broadcast=True)

@login_required
@admin_required
@socket_view.route('/active_users')
def get_active_users():
    active_users = len(connected_users)
    return {'active_users': active_users}

def get_active_user_ssr():
    active_users = len(connected_users)
    return {'active_user': active_users}
