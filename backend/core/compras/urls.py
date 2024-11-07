from django.urls import path
from .views import ListComprasView,SaveComporasView
urlpatterns = [
    path(route="list/comprobantes/<str:document>/",view=ListComprasView.as_view()),
    path(route="save/comprobantes/<str:document>/",view=SaveComporasView.as_view())
]