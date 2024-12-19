from django.urls import path
from core.contabilidad.views import ListAsientosView,SaveAsientosView
from .origen.views import Listorigen,SaveOrigen,DeleteOrigen,EditOrigen
from .centroCostos.views import ListCentroCostos
from .Asientos.views import EditAsientos,DeleteAsientos
urlpatterns = [
    path(route="list/<str:document>/",view=ListAsientosView.as_view()),
    path(route="list/<str:document>/<str:mes>/<str:origen>/<str:compro>/",view=ListAsientosView.as_view()),
    # ASIENOS
    path(route="save/asientos/<str:document>/",view=SaveAsientosView.as_view()),
    path(route="delete/asientos/<str:document>/<str:query_string>/",view=DeleteAsientos.as_view()),
    path(route="edit/asientos/<str:document>/<str:query_string>/",view=EditAsientos.as_view()),
    # ORIGENES
    path(route="list/origen/<str:document>/",view=Listorigen.as_view()),
    path(route="save/origen/<str:document>/",view=SaveOrigen.as_view()),
    path(route="delete/origen/<str:document>/",view=DeleteOrigen.as_view()),
    path(route="edit/origen/<str:document>/<str:codigo>/",view=EditOrigen.as_view()),
    #CENTRO DE COSTOS
    path(route="list/centro-costos/<str:document>/",view=ListCentroCostos.as_view()),
]