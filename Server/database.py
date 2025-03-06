from pymongo import MongoClient
import os
from motor.motor_asyncio import AsyncIOMotorClient



from dotenv import load_dotenv
from bson.codec_options import CodecOptions, UuidRepresentation

load_dotenv()  # take environment variables from .env.
def get_database():
    connection_string = os.getenv("ATLAS_URI")
    client = AsyncIOMotorClient(connection_string, uuidRepresentation='standard')
    database = client.get_database("journalease", codec_options=CodecOptions(uuid_representation=UuidRepresentation.STANDARD))
    return database
# def get_database():
#    connection_string = os.getenv("ATLAS_URI")
#    client = AsyncIOMotorClient(connection_string)

#    database = client.journalease
   
#    return database
#    # Provide the mongodb atlas url to connect python to mongodb using pymongo
   # CONNECTION_STRING = "mongodb+srv://user:pass@cluster.mongodb.net/myFirstDatabase"
 
   # # Create a connection using MongoClient. You can import MongoClient or use pymongo.MongoClient
   # client = MongoClient(CONNECTION_STRING)
 
   # # Create the database for our example (we will use the same database throughout the tutorial
   # return client['user_shopping_list']
  
# This is added so that many files can reuse the function get_database()
if __name__ == "__main__":   
  
   # Get the database
   dbname = get_database()
   
   #python -m pip install 'fastapi[all]' 'pymongo[srv]' python-dotenv
