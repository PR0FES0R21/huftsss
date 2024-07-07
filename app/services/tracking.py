from device_detector import DeviceDetector
from app import mongo, socket
import requests
from bson import ObjectId
import time
from flask_socketio import emit

class Tracking():
    def convert_object_id(self, data):
        if data:
            for key, value in data.items():
                if isinstance(value, ObjectId):
                    data[key] = str(value)
        return data

    def tracking_user_logger(self, user_agent_str, user_data):
        r = requests.get('https://checkip.amazonaws.com')
        ip_address = r.text
        if user_agent_str:
            device = DeviceDetector(user_agent_str).parse()
            device_info = {
                'device_type': device.device_type(),
                'os_name': device.os_name(),
                'os_version': device.os_version(),
                'browser_name': device.client_name(),
                'browser_version': device.client_version(),
            }
        else:
            device_info = {'error': 'User-Agent header not found'}

        data = {
            'user_data': user_data,
            'device_info': device_info,
            'ip_address': ip_address,
            'waktu_aktifitas': int(time.time())
        }

        self.save(data)
    
    def save(self, data):
        result = mongo.db.tracking.insert_one(data)
        data_emit = {
            'nama': data['user_data']['nama'],
            'actifity': data['user_data']['actifity'],
            'user_profile': data['user_data']['user_profile'],
            'os_name': data['device_info']['browser_name'],
            'waktu_aktifitas': data['waktu_aktifitas']
        }
        if result.inserted_id:
            socket.emit('actifity', data_emit)


    def get(self, limit: bool):
        if limit:
            data_list = list(mongo.db.tracking.find({}).sort('_id', -1).limit(5))
        else:
            data_list = list(mongo.db.tracking.find({}).sort('_id', -1))
        data_list.reverse()
        return [self.convert_object_id(data) for data in data_list]
