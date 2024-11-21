from django.urls import path
from .views import ListComprasView,SaveComporasView
from .generic_views import GenericViews
urlpatterns = [
    path(route="list/comprobantes/<str:document>/",view=ListComprasView.as_view()),
    path(route="save/comprobantes/<str:document>/",view=SaveComporasView.as_view()), 
    path(route="generic/<str:document>/",view=GenericViews.as_view()) 
]