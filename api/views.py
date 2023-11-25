from django.shortcuts import render
from django.http import HttpResponse
from django.views.generic import ListView,CreateView
from rest_framework import generics,status
from rest_framework.views import APIView
from . import models,serializers
from rest_framework.response import Response
from django.http import JsonResponse
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

            self.request.session['room_code']=room.code
            return Response(serializers.RoomSerializer(room).data,status=status.HTTP_201_CREATED)
        return Response({'Bad Request':'Bad Request'},status=status.HTTP_400_BAD_REQUEST)
            
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
    

class JoinRoom(APIView):
    serializer_class=serializers.RoomSerializer
    lookup_url_kwarg='code'

    def post(self,request,format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        code=request.GET.get(self.lookup_url_kwarg)


        if code:
            room=models.Room.objects.filter(code=code)
            if len(room)>0:
                data=room[0]
                self.request.session['room_code']=code
                return Response({'message':'Room Joined'},status=status.HTTP_200_OK)
            else:
                return Response({'message':'Room Does not Exists'},status=status.HTTP_404_NOT_FOUND)
        return Response({'Bad Request':'Invalid post data'},status=status.HTTP_400_BAD_REQUEST)   



class UserInRoom(APIView):
    def get(self,request,format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        roomCode=self.request.session.get('room_code')
        room=models.Room.objects.filter(code=roomCode)
        if roomCode and len(room)<1:
            self.request.session.pop('room_code')
        data = {
            'code': self.request.session.get('room_code'),
            'isroom':False
        }
        if data['code'] and len(data['code'])>0:
            data['isroom']=True
        

        return JsonResponse(data,status=status.HTTP_200_OK)

class LeaveRoom(APIView):
    def post(self,request,format=None):
        roomCode=self.request.session.get('room_code')
        
        if roomCode:
            
            code=self.request.session.pop('room_code')
            host=self.request.session.session_key
            room_results=models.Room.objects.filter(host=host)

            if len(room_results)>0:
                room=room_results[0]
                room.delete()
            return JsonResponse(data={},status=status.HTTP_200_OK)
        
        return JsonResponse({},status=status.HTTP_400_BAD_REQUEST)

class UpdateRoomView(APIView):
    serializer_class=serializers.UpdateRoomSerializer
    def patch(self,request,format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        serializer=self.serializer_class(data=request.data)
        if serializer.is_valid():
            host=self.request.session.session_key
            query=models.Room.objects.filter(host=host)
            if query.exists():
                room=query[0]
                if room.code==serializer.data['code'] and host==room.host:
                    guest_can_pause=bool(serializer.data['guest_can_pause'])
                    votes_to_skip=int(serializer.data['votes_to_skip'])
                    room.guest_can_pause=guest_can_pause
                    room.votes_to_skip=votes_to_skip
                    room.save(update_fields=['guest_can_pause','votes_to_skip'])
                    return Response(serializers.RoomSerializer(room).data,status=status.HTTP_200_OK)
            return Response({'No room exists':'Does not exist'},status=status.HTTP_404_NOT_FOUND)
        return Response({'Bad Request':'Bad Request'},status=status.HTTP_400_BAD_REQUEST)
