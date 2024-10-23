from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from core.login.models import ClientToken

class TokenAuthentication(BaseAuthentication):
    def authenticate(self, request):
        token_bearer = request.META.get('HTTP_AUTHORIZATION')
        if not token_bearer:
            return None
        try:
            _,token = token_bearer.split(" ")
            client_token = ClientToken.objects.get(token=token)
            return (client_token.client, None)
        except ClientToken.DoesNotExist:
            raise AuthenticationFailed('Token invalido')
