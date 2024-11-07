"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,include
from core.views import ListOrigen,ListUbicacion,ListProveedor,ListDocument,ListCentroCosto,ListCuentas
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/users/',include('core.login.urls')),
    path('api/v1/contabilidad/',include('core.contabilidad.urls')),
    path('api/v1/compras/',include('core.compras.urls')),
    #generic vies
    path('api/v1/generics/list/origen/<str:document>/',ListOrigen.as_view()),
    path('api/v1/generics/list/ubicacion/<str:document>/',ListUbicacion.as_view()),
    path('api/v1/generics/list/proveedor/<str:document>/',ListProveedor.as_view()),
    path('api/v1/generics/list/document/<str:document>/',ListDocument.as_view()),
    path('api/v1/generics/list/centro-costo/<str:document>/',ListCentroCosto.as_view()),
    path('api/v1/generics/list/cuentas/<str:document>/',ListCuentas.as_view()),
]
