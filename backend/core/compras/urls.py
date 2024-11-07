from django.urls import path
from .views import ListCompras
urlpatterns = [
    path(route="list/comprobantes/<str:document>/",view=ListCompras.as_view())
]