from django.urls import path

from .views import ListComprasView,SaveComporasView,SaveTipoCambio

urlpatterns = [
    path(route="list/comprobantes/<str:document>/",view=ListComprasView.as_view()),
    path(route="save/comprobantes/<str:document>/",view=SaveComporasView.as_view()), 
    path(route="save/tipo-cambio/<str:document>/<str:fecha>/<int:option>/",view=SaveTipoCambio.as_view()), 

]