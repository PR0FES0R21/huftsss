from app import mongo
from bson import ObjectId, json_util

class AdminModel():

    def convert_object_id(self, data):
        if data and '_id' in data:
            data['_id'] = str(data['_id'])
        return data
    
    def get_admin_data(self, query = None):
        if query is None:
            data_list = list(mongo.db.admins.find())
            return [self.convert_object_id(data) for data in data_list]
            
        data_list = mongo.db.admins.find_one(query)
        return self.convert_object_id(data_list)
    
    def get_user_logger(self):
        pipeline = [
            {"$group": {"_id": None, "total_data": {"$sum": 1}, "latest_data": {"$push": "$$ROOT"}}},
            {"$project": {"_id": 0, "total_data": 1, "latest_data": {"$slice": ["$latest_data", -5]}}}
        ]
        result = list(mongo.db.users.aggregate(pipeline))
        total_data = result[0]['total_data'] if result else 0
        latest_data = result[0]['latest_data'] if result else []

        return {
            'total_data': total_data,
            'all_data': [self.convert_object_id(data) for data in latest_data]
        }
    

    def test(self, user_id):
        pipelines = [
            {
                '$match': {
                    'user_id': ObjectId(user_id),
                }
            },
            {'$addFields': 
                {
                    'status': {
                        '$cond': {
                            'if': {'$gt': ['$nilai_ujian', 70]},
                            'then': 0,
                            'else': 1
                        }
                    }
                }
            }
        ]
        result = list(mongo.db.exam_history.aggregate(pipelines))
        # Konversi ObjectId menjadi string sebelum mengembalikan
        r = [self.convert_object_id(data) for data in result]
        print(r)





        

