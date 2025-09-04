
# from django.urls import path
# from .views import RoomView

# urlpatterns = [
#     path('create-room', RoomView.as_view()),
# ]



from django.urls import path
from .views import RoomView, CreateRoomView, GetRoom, JoinRoom, UserInRoom, LeaveRoom, UpdateRoom

urlpatterns = [
    path('room', RoomView.as_view()),          # GET → list all rooms
    path('create-room', CreateRoomView.as_view()),  # POST → create/update room
    path('get-room',GetRoom.as_view()),
    path('join-room', JoinRoom.as_view()),
    path('user-in-room', UserInRoom.as_view()),
    path('leave-room', LeaveRoom.as_view()),
    path('update-room', UpdateRoom.as_view())

]
