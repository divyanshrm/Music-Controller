from django.contrib import admin
from django.urls import path,include
from . import views
urlpatterns = [
    path('',views.RoomView.as_view(),name=''),
    path('create_room',views.CreateRoomView.as_view()),
    path('get-room',views.GetRoom.as_view()),
    path('join-room',views.JoinRoom.as_view()),
    path('user-in-room',views.UserInRoom.as_view()),
    path('leave-room',views.LeaveRoom.as_view()),
    path('update-room',views.UpdateRoomView.as_view()),
]
