from django.db import models
from cryptography.fernet import Fernet
import base64
from django.conf import settings
import secrets
from django.db.models.signals import post_save
from django.dispatch import receiver

# Create your models here.
ENCRYPTION_KEY = settings.ENCRYPTION_KEY.encode()
class Clients(models.Model):
    document = models.CharField(max_length=20,verbose_name="Nro Documento")
    company_name = models.CharField(max_length=255,verbose_name="Nombre de la empresa")
    db_host = models.CharField(max_length=255,verbose_name="Host de la BD")
    db_name = models.CharField(max_length=255,verbose_name="Nombre de la Base de datos")
    db_port = models.CharField(max_length=10,verbose_name="Numero de puerto")
    db_user = models.CharField(max_length=100,verbose_name="Nombre de usuario")
    db_pass = models.CharField(max_length=100,verbose_name="Contraseña")
    class Meta:
        verbose_name = "Cliente"
        verbose_name_plural = "Clientes"
        db_table = "clientes"
    def save(self,*args,**kwargs):
        if self.db_pass:
            self.db_pass = self.encrypt_password(self.db_pass)
        super(Clients,self).save(*args,**kwargs)
        
    def encrypt_password(self,raw_password):
        cipher = Fernet(ENCRYPTION_KEY)
        encrypted_password = cipher.encrypt(raw_password.encode())
        return base64.urlsafe_b64encode(encrypted_password).decode()
    def decrypt_password(self):
        cipher = Fernet(ENCRYPTION_KEY)
        encryppted_password = base64.urlsafe_b64decode(self.db_pass.encode())
        return cipher.decrypt(encryppted_password).decode()
    def __str__(self) -> str:
        return f"{self.company_name}"
class ClientToken(models.Model):
    client = models.OneToOneField(Clients,on_delete=models.CASCADE)
    token = models.CharField(max_length=256,unique=True,verbose_name="Token")
    created_at = models.DateTimeField(auto_now_add=True)
    def save(self,*args,**kwargs):
        if not self.token:
            self.token = secrets.token_urlsafe(32)
        super(ClientToken,self).save(*args,**kwargs)
    class Meta:
        verbose_name = "Token de Cliente"
        verbose_name_plural = "Tokens de Clientes"
        db_table = "client_token"
    def __str__(self):
        return f"Client: {self.client}, Token: {self.token}"
@receiver(post_save,sender=Clients)
def create_client_token(sender,instance,created,**kwargs):
    if created:
        ClientToken.objects.create(client=instance)