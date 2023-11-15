from django.contrib import admin
from django.urls import path,include
from . import views
urlpatterns = [
    path('',views.RoomView.as_view()),
    path('create_room',views.CreateRoomView.as_view()),
    path('get-room',views.GetRoom.as_view()),
]
