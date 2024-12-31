from django.urls import path

from .views import SaveComporasView,SaveTipoCambio
from .CondicionPago.views import CondicionPagoList,EditCondicionPago,SaveCondicionPago,DeleteCondicionPago 
from .TipoServicio.views import ListTipoServicio,SaveTipoServicio,EditTipoServicio,DeleteTipoServicio
from .comprobantes.views import ListComprobantes,EditComprobantes
from .RecepcionDocumentos.views import ListRecepcionDocumentos
urlpatterns = [
    #COMPROBANTES
    path(route="list/comprobantes/<str:document>/",view=ListComprobantes.as_view()),
    path(route="save/comprobantes/<str:document>/",view=SaveComporasView.as_view()), 
    path(route="edit/comprobantes/<str:document>/<str:query_string>/",view=EditComprobantes.as_view()), 
    path(route="save/tipo-cambio/<str:document>/<str:fecha>/<int:option>/",view=SaveTipoCambio.as_view()), 
    #CONDICION DE PAGO
    path(route="save/condicion-pago/<str:document>/",view=SaveCondicionPago.as_view()),
    path(route="list/condicion-pago/<str:document>/",view=CondicionPagoList.as_view()),
    path(route="edit/condicion-pago/<str:document>/<str:codigo>/",view=EditCondicionPago.as_view()),
    path(route="delete/condicion-pago/<str:document>/<str:codigo>/",view=DeleteCondicionPago.as_view()),
    #TIPO DE SERVICIO
    path(route="list/tipo-servicio/<str:document>/",view=ListTipoServicio.as_view()),
    path(route="save/tipo-servicio/<str:document>/",view=SaveTipoServicio.as_view()),
    path(route="edit/tipo-servicio/<str:document>/<str:codigo>/",view=EditTipoServicio.as_view()),
    path(route="delete/tipo-servicio/<str:document>/<str:codigo>/",view=DeleteTipoServicio.as_view()),
    #RECEPCION DE DOCUMENTOS
    path(route="list/recepcion-documentos/<str:document>/",view=ListRecepcionDocumentos.as_view()),


]