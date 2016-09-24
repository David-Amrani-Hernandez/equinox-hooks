"""equinox_hooks URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.10/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url, include
from django.contrib import admin
from django.views.decorators.csrf import csrf_exempt

from rest_framework.routers import DefaultRouter

from hooks.views import HomeView, ApplicationsView, ApplicationDetailView, HookDetailView
from hooks.apis import ApplicationViewSet, HookViewSet, HeaderViewSet, LatchHookListener

router = DefaultRouter()
router.register(r'applications', ApplicationViewSet)
router.register(r'hooks', HookViewSet)
router.register(r'headers', HeaderViewSet)


urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^api/1.0/', include(router.urls, namespace='api')),

    url(r'^latch-hook/', csrf_exempt(LatchHookListener.as_view()) ),

    url(r'^$', HomeView.as_view()),
    url(r'^applications/$', ApplicationsView.as_view()),
    url(r'^applications/(?P<id>[0-9]+)/$', ApplicationDetailView.as_view()),
    url(r'^applications/(?P<app_id>[0-9]+)/hooks/(?P<id>[0-9]+)/$', HookDetailView.as_view()),
]
