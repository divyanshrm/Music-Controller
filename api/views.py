from django.shortcuts import render
from django.http import HttpResponse
from django.views.generic import ListView,CreateView
from rest_framework import generics,status
from rest_framework.views import APIView
from . import models,serializers
from rest_framework.response import Response
# Create your views here.
class RoomView(generics.CreateAPIView):
    queryset=models.Room.objects.all()
    serializer_class=serializers.RoomSerializer

class CreateRoomView(APIView):
    serializer_class=serializers.CreateRoomSerializer
    def post(self,request,format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        serializer=self.serializer_class(data=request.data)
        if serializer.is_valid():
            guest_can_pause=bool(serializer.data['guest_can_pause'])
            votes_to_skip=int(serializer.data['votes_to_skip'])
            host=self.request.session.session_key
            query=models.Room.objects.filter(host=host)
            if query.exists():
                room=query[0]
                room.guest_can_pause=guest_can_pause
                room.votes_to_skip=votes_to_skip
                room.save(update_fields=['guest_can_pause','votes_to_skip'])
            else:
                room=models.Room(host=host,guest_can_pause=guest_can_pause,votes_to_skip=votes_to_skip)
                room.save()
        return Response(serializers.RoomSerializer(room).data,status=status.HTTP_201_CREATED)
            
class GetRoom(APIView):
    serializer_class=serializers.RoomSerializer
    lookup_url_kwarg='code'
    def get(self,request,format=None):
        code=request.GET.get(self.lookup_url_kwarg)
        #code=request.GET.get(self.lookup_url_kwarg)
        if code:
            room=models.Room.objects.filter(code=code)
            if len(room)>0:
                data=self.serializer_class(room[0]).data
                data['is_host']=(self.request.session.session_key==room[0].host)
                return Response(data,status.HTTP_200_OK)
            return Response({'Room Not Found':'Invalid Room Code'},status=status.HTTP_404_NOT_FOUND)
        return Response({'Bad Request':'Bad Request'},status=status.HTTP_400_BAD_REQUEST)
    




        
    
