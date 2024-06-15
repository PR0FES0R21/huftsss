from app import mongo
from flask_login import UserMixin

class User(UserMixin):
    def __init__(self, id, role, name, position, platform, departemen=None, level=None):
        self.id = id
        self.role = role
        self.name = name
        self.position = position
        self.departemen = departemen
        self.platform = platform
        self.level = level

    def is_active(self):
        return True
