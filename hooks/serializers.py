from rest_framework import serializers

from hooks.models import Application, Hook, Header


class ApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application

    def to_representation(self, instance):
        ret = super(ApplicationSerializer, self).to_representation(instance)
        items = Hook.objects.filter(application=instance.pk)
        serializer = HookSimpleSerializer(items, many=True)
        ret["hooks"] = serializer.data
        return ret


class HookSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hook
        fields = ('id', 'latch_status', 'name')


class HookExtendedSerializer(serializers.ModelSerializer):

    class Meta:
        model = Hook


class HookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hook


class HeaderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Header
