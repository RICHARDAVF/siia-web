import pyodbc
from core.login.serializer import ClientSerializer
from core.login.models import Clients,ClientToken
class DataBase:
    @classmethod
    def connection(cls,docum):
        try:
            client = Clients.objects.get(document=docum)
            query_string = "DRIVER={SQL Server};SERVER="+client.db_host+";DATABASE="+client.db_name+";UID="+client.db_user+";PWD="+client.decrypt_password()
            return pyodbc.connect(query_string)
        
        except Exception as e:
            raise ValueError(f"No se pudo establecer conexion a la base de datos:{str(e)}")
    @classmethod
    def query(cls,docum:str,sql:str,params:tuple,method:str = 'POST',option:int = 1):
        try:
            instance = cls()
            conn = instance.connection(docum)
            cursor = conn.cursor()
            cursor.execute(sql,params)
            if method=='POST':
                conn.commit()
                conn.close()
                return -1
            elif method == "GET" and option == 1:
                data = cursor.fetchall()
                conn.commit()
                conn.close()
                return data
            elif method == "GET" and option == 0:
                data = cursor.fetchone()
                conn.commit()
                conn.close()
                return data
        except Exception as e:
            raise ValueError(str(e))
    @classmethod
    def token(cls,docum):
        client = ClientToken.objects.get(client__document=docum)
        return client.token
    @classmethod
    def client(cls,document):
        cliente = Clients.objects.get(document=document)
        serializer = ClientSerializer(cliente,many=False)
        return serializer.data

