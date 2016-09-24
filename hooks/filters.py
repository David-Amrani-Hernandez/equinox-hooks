from rest_framework import filters

from hooks.models import Hook


class HookFilter(filters.FilterSet):
    class Meta:
        model = Hook
        fields = ['application']