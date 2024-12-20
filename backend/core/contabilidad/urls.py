from django.urls import path
from core.contabilidad.views import ListAsientosView,SaveAsientosView
from .origen.views import Listorigen,SaveOrigen,DeleteOrigen,EditOrigen
from .centroCostos.views import ListCentroCostos,SaveCentroCostos,DeleteCentroCostos,EditCentroCostos
from .Asientos.views import EditAsientos,DeleteAsientos
from .MedioPago.views import ListMedioPago,SaveMedioPago,EditMedioPago,DeleteMedioPago
from .tipoAuxiliar.views import ListTipoAuxiliarView,SaveTipoAuxiliarView
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
    path(route="save/centro-costos/<str:document>/",view=SaveCentroCostos.as_view()),
    path(route="delete/centro-costos/<str:document>/",view=DeleteCentroCostos.as_view()),
    path(route="edit/centro-costos/<str:document>/<str:codigo>/",view=EditCentroCostos.as_view()),
    #MEDIO DE PAGO
    path(route="list/medio-pago/<str:document>/",view=ListMedioPago.as_view()),
    path(route="save/medio-pago/<str:document>/",view=SaveMedioPago.as_view()),
    path(route="edit/medio-pago/<str:document>/<str:codigo>/",view=EditMedioPago.as_view()),
    path(route="delete/medio-pago/<str:document>/<str:codigo>/",view=DeleteMedioPago.as_view()),
    #TIPO DE AUXILIAR
    path(route="list/tipo-auxiliar/<str:document>/",view=ListTipoAuxiliarView.as_view()),
    path(route="save/tipo-auxiliar/<str:document>/",view=SaveTipoAuxiliarView.as_view())
]