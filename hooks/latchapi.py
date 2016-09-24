from sdklib.http import HttpSdk
from sdklib.http.authorization import X11PathsAuthentication
from sdklib.http.renderers import FormRenderer


class Latch(HttpSdk):

    DEFAULT_HOST = "https://latch.elevenpaths.com"
    DEFAULT_RENDERER = FormRenderer()

    API_VERSION = "0.6"
    API_CHECK_STATUS_URL__VERSION = "/api/%s/status"
    API_PAIR_URL__VERSION = "/api/%s/pair"
    API_PAIR_WITH_ID_URL__VERSION = "/api/%s/pairWithId"
    API_UNPAIR_URL__VERSION = "/api/%s/unpair"

    def __init__(self, app_id, secret_key):
        super(Latch, self).__init__()
        self.app_id = app_id
        self.secret_key = secret_key
        self.authentication_instances += (X11PathsAuthentication(self.app_id, self.secret_key),)

    def pair_with_id(self, account_id):
        return self._http_request("GET", self.API_PAIR_WITH_ID_URL__VERSION % self.API_VERSION + "/" + account_id)

    def pair(self, token, my_time=None):
        auth_instances = (X11PathsAuthentication(self.app_id, self.secret_key, utc=my_time),)
        return self._http_request("GET", self.API_PAIR_URL__VERSION % self.API_VERSION + "/" + token,
                                  authentication_instances=auth_instances)

    def status(self, account_id):
        return self._http_request("GET", self.API_CHECK_STATUS_URL__VERSION % self.API_VERSION + "/" + account_id)

    def operation_status(self, account_id, operation_id):
        return self._http_request("GET",
                                  self.API_CHECK_STATUS_URL__VERSION % self.API_VERSION + "/" + account_id + "/op/" +
                                  operation_id)

    def unpair(self, account_id):
        return self._http_request("GET", self.API_UNPAIR_URL__VERSION % self.API_VERSION + "/" + account_id)
