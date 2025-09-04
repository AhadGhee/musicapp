# from django.shortcuts import render
# from django.http import HttpResponse
# from rest_framework import generics, status
# from .serializers import RoomSerializer, CreateRoomSerializer
# from .models import Room
# from rest_framework.views import APIView
# from rest_framework.response import Response

# # Create your views here.

# class RoomView(generics.ListAPIView):
#     queryset = Room.objects.all()  # These are the room stuff we want 
#     serializer_class = RoomSerializer # this is how you'll convert it for the front end / rules 


# class CreateRoomSerializer(APIView):
#     serializer_class = CreateRoomSerializer

#     def post(self, request, format=None):
#         if not self.request.session.exists(self.request.session.session_key):
#             self.request.session.create()

#         serializer = self.serializer_class(data=request.data)
#         if serializer.is_valid():
#             guest_can_pause = serializer.data.get('guest_can_pause')
#             votes_to_skip = serializer.data.get('votes_to_skip')
#             host = self.request.session.session_key
#             queryset = Room.objects.filter(host=host)
#             if queryset.exists():
#                 room = queryset[0]
#                 room.guest_can_pause = guest_can_pause
#                 room.votes_to_skip = votes_to_skip
#                 room.save(update_fields=['guest_can_pause', 'votes_to_skip'])
#             else:
#                 room = Room(host=host, guest_can_pause=guest_can_pause, votes_to_skip=votes_to_skip)
#                 room.save()

#             return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)


from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Room
from .serializers import RoomSerializer, CreateRoomSerializer, UpdateRoomSerializer
from django.http import JsonResponse

# For GET (list all rooms)
class RoomView(generics.ListAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer

# API endpoint for fetching a Room by its code
class GetRoom(APIView):
    # Use RoomSerializer to convert Room objects → JSON
    serializer_class = RoomSerializer
    # The query parameter name we expect in the URL (e.g. ?code=ABC123)
    #lookup_url_kwarg = 'code'

    # Handle GET requests
    def get(self, request, format=None):
        # Extract the "code" parameter from the URL (None if missing)
        code = request.GET.get('code')
        # Case 1: If a code is provided
        if code is not None:
            # Query the database for rooms with this code
            room = Room.objects.filter(code=code)

            # If at least one room exists with that code
            if len(room) > 0:
                # Serialize the first matching room into a Python dict
                data = RoomSerializer(room[0]).data

                # Add extra field: check if current user is the host
                data['is_host'] = self.request.session.session_key == room[0].host

                # Return JSON response with status 200 (OK)
                return Response(data, status=status.HTTP_200_OK)

            # If no room found with this code → return error JSON
            return Response(
                {'Bad Request': 'Invalid Room Code.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Case 2: If no "code" parameter was provided in URL
        return Response(
            {'Bad Request': 'Code parameter not found in request'},
            status=status.HTTP_400_BAD_REQUEST
        )


class JoinRoom(APIView):
    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        code = request.data.get('code')

        if code != None:
            room_results = Room.objects.filter(code=code)
            if len(room_results) > 0:
                room = room_results[0]
                self.request.session['room_code'] = code
                return Response({'message': 'Room Joined!'}, status=status.HTTP_200_OK)

            return Response({'Bad Request': 'Invalid Room Code!'}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({'Bad Request': 'Invalid post data, did not find a code key'}, status=status.HTTP_400_BAD_REQUEST)
        #valid room



# For POST (create or update a room)
class CreateRoomView(APIView):
    serializer_class = CreateRoomSerializer

    def post(self, request, format=None):
        # ✅ ensure session exists
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            guest_can_pause = serializer.validated_data.get('guest_can_pause')
            votes_to_skip = serializer.validated_data.get('votes_to_skip')
            host = self.request.session.session_key

            queryset = Room.objects.filter(host=host)
            if queryset.exists():
                # Update existing room for this host
                room = queryset[0]
                room.guest_can_pause = guest_can_pause
                room.votes_to_skip = votes_to_skip
                self.request.session['room_code'] = room.code
                room.save(update_fields=['guest_can_pause', 'votes_to_skip'])
            else:
                # Create a new room
                room = Room(
                    host=host,
                    guest_can_pause=guest_can_pause,
                    votes_to_skip=votes_to_skip
                )
                room.save()
                self.request.session['room_code'] = room.code

            return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class UserInRoom(APIView):
    def get(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        data = {
            'code': self.request.session.get('room_code')
        }
        return JsonResponse(data, status=status.HTTP_200_OK)

class LeaveRoom(APIView):
    def post(self,request, format=None):
        if 'room_code' in self.request.session:
            self.request.session.pop('room_code')
            host_id = self.request.session.session_key
            room_results = Room.objects.filter(host=host_id)
            if len(room_results) > 0:
                room = room_results[0]
                room.delete()
        return Response({'Message': 'Success'}, status=status.HTTP_200_OK)
    

class UpdateRoom(APIView):
    serializer_class = UpdateRoomSerializer

    def patch(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            guest_can_puase = serializer.data.get('guest_can_pause')
            votes_to_skip = serializer.data.get('votes_to_skip')
            code = serializer.data.get('code')

            queryset = Room.objects.filter(code=code)
            if not queryset.exists():
                return Response({'msg' : 'Room not found.'}, status=status.HTTP_404_NOT_FOUND)

            room = queryset[0]
            user_id = self.request.session.session_key
            if room.host != user_id: 
                return Response({'msg' : 'You are not the host.'}, status=status.HTTP_403_FORBIDDEN)
            
            room.guest_can_pause = guest_can_puase
            room.votes_to_skip = votes_to_skip
            room.save(update_fields=['guest_can_pause', 'votes_to_skip'])
            return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)
        return Response({'Bad Request' : "Invalid Data..."}, status=status.HTTP_400_BAD_REQUEST)