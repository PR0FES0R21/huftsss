from bson import ObjectId
from app import mongo
import re

class Checking:
    def is_valid_object_id(self, id: str) -> bool:
        return ObjectId.is_valid(id)

    def is_valid_email(self, email: str) -> bool:
        # check email format menggunakan regex
        email_regex = re.compile(r'^\S+@\S+\.\S+$')
        if email_regex.match(email):
            return True
        return False

    def is_valid_password(self, password: str) -> bool:
        # cek panjang password, minimal 8 karakter
        # cek format password menggunakan regex
        password_regex = re.compile(r'^[a-zA-Z0-9]{8,}$')
        if password_regex.match(password):
            return True
        return False
