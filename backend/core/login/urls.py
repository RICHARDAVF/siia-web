from django.urls import path

from core.login.views import LoginUser
urlpatterns = [
    path(route="login/<str:document>/",view=LoginUser.as_view())
]