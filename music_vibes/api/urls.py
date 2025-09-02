
# from django.urls import path
# from .views import RoomView

# urlpatterns = [
#     path('create-room', RoomView.as_view()),
# ]



from django.urls import path
from .views import RoomView, CreateRoomView

urlpatterns = [
    path('rooms', RoomView.as_view()),          # GET → list all rooms
    path('create-room', CreateRoomView.as_view())  # POST → create/update room
]