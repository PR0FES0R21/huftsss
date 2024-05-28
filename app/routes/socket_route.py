from flask import Blueprint
from flask_socketio import emit
from app import socket
from flask_login import current_user
from app import mongo
from bson import ObjectId
import time

socket_view = Blueprint('socket_views', __name__)

@socket.on('tracking')
def handle_tracking(data):

    print('Tracking data received:', data)

@socket.on('connect')
def connect():
    data = {
        'user_id': current_user.id,
        'nama': current_user.name,
        'platform': current_user.platform,
        'login_date': int(time.time())
    }
    if not mongo.db.users.find_one({'user_id': current_user.id}):
        mongo.db.users.insert_one(data)
        emit('user_logger', 'oke', broadcast=True)

@socket.on('disconnect')
def handle_disconnect():
    mongo.db.users.delete_one({'user_id': current_user.id})
    emit('user_logger', 'oke', broadcast=True)
