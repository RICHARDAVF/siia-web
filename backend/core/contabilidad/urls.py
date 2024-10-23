from django.urls import path
from core.contabilidad.views import ListCuentasView
urlpatterns = [
    path(route="list/<str:document>/",view=ListCuentasView.as_view())
]