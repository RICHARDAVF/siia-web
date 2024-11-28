from django.urls import path
from core.contabilidad.views import ListAsientosView,SaveAsientosView

urlpatterns = [
    path(route="list/<str:document>/",view=ListAsientosView.as_view()),
    path(route="list/<str:document>/<str:mes>/<str:origen>/<str:compro>/",view=ListAsientosView.as_view()),
    path(route="save/asientos/<str:document>/",view=SaveAsientosView.as_view())
]