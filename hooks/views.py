from django.shortcuts import render
from django.views.generic import View


class HomeView(View):
    """
    Home Controller class.
    """
    def get(self, request, **kwargs):
        context = {
        }
        return render(request, 'hooks/index.html', context)


class ApplicationsView(View):
    """
    Home Controller class.
    """
    def get(self, request, **kwargs):
        context = {
        }
        return render(request, 'hooks/applications.html', context)


class ApplicationDetailView(View):
    """
    Home Controller class.
    """
    def get(self, request, **kwargs):
        context = {
        }
        return render(request, 'hooks/application_detail.html', context)


class HookDetailView(View):
    """
    Home Controller class.
    """
    def get(self, request, **kwargs):
        context = {
        }
        return render(request, 'hooks/hook_detail.html', context)