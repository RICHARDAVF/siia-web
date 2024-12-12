from django.urls import path
<<<<<<< HEAD
from .views import ListComprasView,SaveComporasView,SaveTipoCambio

urlpatterns = [
    path(route="list/comprobantes/<str:document>/",view=ListComprasView.as_view()),
    path(route="save/comprobantes/<str:document>/",view=SaveComporasView.as_view()), 
    path(route="save/tipo-cambio/<str:document>/<str:fecha>/<int:option>/",view=SaveTipoCambio.as_view()), 
=======
<<<<<<< HEAD
from .views import ListCompras
urlpatterns = [
    path(route="list/comprobantes/<str:document>/",view=ListCompras.as_view())
=======
from .views import ListComprasView,SaveComporasView
urlpatterns = [
    path(route="list/comprobantes/<str:document>/",view=ListComprasView.as_view()),
    path(route="save/comprobantes/<str:document>/",view=SaveComporasView.as_view())
>>>>>>> 1cb272c945efe937f26e0e9ac473a96cbaf6a71f
>>>>>>> 462e34c56237d8935239d4ffb58c7ecacefada26
]