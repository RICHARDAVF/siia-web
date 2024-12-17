from django.urls import path
from core.contabilidad.views import ListAsientosView,SaveAsientosView
from .origen.views import Listorigen,SaveOrigen,DeleteOrigen,EditOrigen
urlpatterns = [
    path(route="list/<str:document>/",view=ListAsientosView.as_view()),
    path(route="list/<str:document>/<str:mes>/<str:origen>/<str:compro>/",view=ListAsientosView.as_view()),

    path(route="save/asientos/<str:document>/",view=SaveAsientosView.as_view()),
    # ORIGENES
    path(route="list/origen/<str:document>/",view=Listorigen.as_view()),
    path(route="save/origen/<str:document>/",view=SaveOrigen.as_view()),
    path(route="delete/origen/<str:document>/",view=DeleteOrigen.as_view()),
    path(route="edit/origen/<str:document>/<str:codigo>/",view=EditOrigen.as_view()),
]