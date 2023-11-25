from rest_framework import serializers
from .models import Room
from . import models
from rest_framework.response import Response
class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model=Room
        fields=('id','code','host','guest_can_pause','votes_to_skip','created_at')

class CreateRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model=Room
        fields=('guest_can_pause','votes_to_skip')

class UpdateRoomSerializer(serializers.ModelSerializer):
    code=serializers.CharField(validators=[])
    class Meta:
        model=Room
        fields=('guest_can_pause','votes_to_skip','code')
