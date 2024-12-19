from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
from config.middleware import TokenAuthentication
from core.conn import DataBase
from core.views import GetAuxiliar
from datetime import datetime
class ListAsientosView(GenericAPIView,DataBase):
    authentication_classes = [TokenAuthentication]
    permission_classes = [AllowAny]
    fecha : datetime = datetime.now()
    def post(self,request,*args,**kwargs):
        document = kwargs['document']
        try:
            sql = f"""
            SELECT distinct a.MOV_FECHA,a.MOV_MES,a.ORI_CODIGO,a.MOV_COMPRO,a.MOV_GLOSA FROM mova{self.fecha.year} AS a 
            LEFT JOIN t_origen AS b ON a.ORI_CODIGO = b.ori_codigo 
            WHERE b.ori_tipo=3
            ORDER BY a.MOV_MES,a.ORI_CODIGO,a.MOV_COMPRO ASC
"""
            res = self.query(document,sql,(),'GET',1)
            data = [
                {
                    "id":index,
                    "fecha":self.processa_date(value[0]),
                    "mes":value[1].strip(),
                    "origen":value[2].strip(),
                    "comprobante":value[3],
                    "observacion":value[4].strip(),
    
                } for index,value in enumerate(res)
            ]
            return Response({"data":data},status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error":"Ocurrio un error:" +str(e)},status=status.HTTP_400_BAD_REQUEST)
    def processa_date(self,date):
        try:
            fecha = date.strftime("%Y-%m-%d")
            return fecha
        except:
            return date
class SaveAsientosView(GenericAPIView,DataBase):
    authentication_classes = [TokenAuthentication]
    permission_classes = [AllowAny]
    fecha:datetime = datetime.now()
    def post(self,request,*args,**kwargs):
        try:
        
            self.validar_cuenta()
            document = kwargs['document']
            datos = request.data
            sql = f"""
                    INSERT INTO MOVA{self.fecha.year}(
             alm_codigo,mov_mes,ORI_CODIGO,UBI_CODIGO,MOV_COMPRO,mov_fecha,MOV_GLOSA,PLA_CUENTA,aux_clave,DOC_CODIGO,MOV_SERIE,MOV_DOCUM,MOV_D,MOV_H,MOV_D_D,MOV_H_D,MOV_T_C,MOV_GLOSA1,USUARIO,ven_codigo,mov_tipoas,mov_total,mov_femisi,mov_moned,mov_fvenc,mov_diapag
                    ) VALUES
"""
            correlativo = self.correlativo()

            for item in request.data['items']:
    
           
                auxiliar = GetAuxiliar(document,self.query,item['auxiliar'])
                suma_total = self.suma_total()
                params = ("53",str(self.fecha.month).zfill(2),datos['origen'],datos['ubicacion'],correlativo,self.fecha.strftime("%Y-%m-%d"),item['glosa'],item['cuenta'],auxiliar.codigo_cliente,item['tipo_documento'],item['serie'],item['numero'],item['debe_soles'],item['haber_soles'],item['debe_dolares'],item['haber_dolares'],item['tipo_cambio'],datos['observacion'],datos['codigo_usuario'],item['vendedor'],datos['tipo_asiento'],suma_total,datos["fecha_emision"],item["moneda"],item["fecha_vencimiento"],datos["dias"])
                sql1 = sql+f"({','.join('?' for i in params)})"
                self.query(document,sql1,params,'POST')
            return Response({"success":f"Los datos se guardaron exitosamente"},status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error":f"Ocurrio un error : {str(e)}"},status=status.HTTP_400_BAD_REQUEST)
    def suma_total(self):
        try:
            return sum([float(item["haber_soles"]) for item in self.request.data['items']])
        except Exception as e:
            raise ValueError(str(e))
    def correlativo(self):
        
        try:
            one_item = self.request.data['items'][0]
            mes = one_item['mes']
            origen = one_item['origen']
    
            params = (mes,origen)
            sql = f"SELECT MAX(mov_compro) FROM mova{self.fecha.year} WHERE mov_mes=? AND ori_codigo=?"
            res = self.query(self.kwargs["document"],sql,params,"GET",0)
            return int(res[0])+1
        except Exception as e:
            print(str(e))
            return 1
    def validar_cuenta(self):
        try:
            for item in self.request.data['items']:
                cuenta = item['cuenta']
                sql = f"SELECT pla_aux FROM PLAN{self.fecha.year} WHERE pla_cuenta=?"
                res = self.query(self.kwargs['document'],sql,(cuenta,),'GET',0)
                if int(res[0])==1 and item['auxiliar']=='':
                   raise ValueError(f'La cuenta {cuenta} require un auxiliar')
        except Exception as e:
            raise ValueError(str(e))  