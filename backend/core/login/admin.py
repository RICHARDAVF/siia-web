from django.contrib import admin
from core.login.models import Clients,ClientToken
# Register your models here.
admin.site.register(ClientToken)
admin.site.register(Clients)