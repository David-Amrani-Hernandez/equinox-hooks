from django.views import View
from django.http import HttpResponse

from rest_framework.decorators import detail_route
from rest_framework.views import APIView
from rest_framework import viewsets, filters
from rest_framework.response import Response

from hooks.models import (
    Application, Hook, Header
)
from hooks.serializers import (
    ApplicationSerializer, HookSerializer, HeaderSerializer
)
from hooks.filters import HookFilter
from hooks.latchapi import Latch
from hooks.rules_executor import execute_hook


class ApplicationViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows projects to be viewed or edited.
    """
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer

    @detail_route(methods=['post'])
    def pair(self, request, pk=None, **kwargs):
        token = request.data.get('token', None)
        app = Application.objects.get(pk=pk)
        app_id = app.app_id
        secret = app.secret
        api = Latch(app_id, secret)
        if token:
            res = api.pair(token)
            if "data" in res.data and "accountId" in res.data["data"]:
                app.account_id = res.data["data"]["accountId"]
                app.save()
        serializer = ApplicationSerializer(app)
        return Response(serializer.data)

    @detail_route(methods=['post'])
    def unpair(self, request, pk=None, **kwargs):
        app = Application.objects.get(pk=pk)
        app_id = app.app_id
        secret = app.secret
        account_id = app.account_id
        api = Latch(app_id, secret)
        api.unpair(account_id)
        app.account_id = None
        app.save()
        serializer = ApplicationSerializer(app)
        return Response(serializer.data)


class HookViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = Hook.objects.all()
    serializer_class = HookSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_class = HookFilter

    @detail_route(methods=['get'])
    def response(self, request, pk=None, **kwargs):
        app = Hook.objects.get(pk=pk)
        response = app.response
        return HttpResponse(response)


class HeaderViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = Header.objects.all()
    serializer_class = HeaderSerializer


class LatchHookListener(View):
    """
    API endpoint that allows users to be viewed or edited.
    """

    def get(self, request, format=None):
        challenge = self.request.GET.get('challenge', None)
        if challenge:
            return HttpResponse(challenge, content_type="text/plain")
        return HttpResponse(challenge, content_type="text/plain")

    def post(self, request, format=None):
        """
        data =   [
    {
        "id": 6,
        "name": "David",
        "description": "Default description",
        "latch_status": True,
        "regex": "name=\"authenticityToken\" value=\"([A-Za-z0-9]*)\"",
        "method": "GET",
        "url": "https://securityinnovationday.elevenpaths.com/login",
        "body": ".",
        "method2": "POST",
        "url2": "https://securityinnovationday.elevenpaths.com/login",
        "body2": "authenticityToken=${VAR}&username=david.amrani@11paths.com&password=QAteam321.",
        "regex2": "Cookie: (.*)",
        "response": None,
        "application": 2
    }
]
        execute_hook(data, True)
        return HttpResponse("OK", content_type="text/plain")
        """

        import json
        data = json.loads(self.request.body)
        accounts = data.get('accounts', {})
        accounts_keys = accounts.keys()
        if len(accounts_keys) > 0:
            account_id = accounts_keys[0]
            status = accounts[account_id][0]["new_status"]
            status = status == "on"
            application = Application.objects.get(account_id=account_id)
            hooks = Hook.objects.filter(application=application)
            serializer = HookSerializer(hooks, many=True)
            execute_hook(serializer.data, status)

        return HttpResponse("OK", content_type="text/plain")