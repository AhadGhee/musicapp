
# from django.urls import path
# from .views import RoomView

# urlpatterns = [
#     path('create-room', RoomView.as_view()),
# ]



from django.urls import path
from .views import RoomView, CreateRoomView, GetRoom, JoinRoom

urlpatterns = [
    path('room', RoomView.as_view()),          # GET → list all rooms
    path('create-room', CreateRoomView.as_view()),  # POST → create/update room
    path('get-room',GetRoom.as_view()),
    path('join-room', JoinRoom.as_view()),
]
