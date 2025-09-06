from django.shortcuts import render

# Create your views here.

from .credentials import REDIRECT_URI, CLIENT_ID, CLIENT_SECRET
from rest_framework.views import APIView
from requests import Request, post
from rest_framework import status
from rest_framework.response import Response
#from .util import update_or_create_user_tokens, is_spotify_authenticated
from django.shortcuts import redirect, render
from urllib.parse import urlencode
from api.models import Room
from .util import *
from requests import get, post

# class AuthURL(APIView):
#     def get(self, request, format=None):
#         scopes = 'user-read-playback-state user-modify-playback-state user-read-currently-playing'

#         url = Request('GET', 'https://accounts.spotify.com/authorize', params={
#             'scope': scopes,
#             'response_type' : 'code',
#             'redirect_uri' : REDIRECT_URI,
#             'client_id' : CLIENT_ID
#         }).prepare().url

#         print("Auth URL:", url)

#         return Response({'url' : url}, status=status.HTTP_200_OK)
class AuthURL(APIView):
    def get(self, request, format=None):
        scopes = 'user-read-playback-state user-modify-playback-state user-read-currently-playing'

        query_params = urlencode({
            'scope': scopes,
            'response_type': 'code',
            'redirect_uri': REDIRECT_URI,
            'client_id': CLIENT_ID,
            "show_dialog": "true", 
        })

        url = f"https://accounts.spotify.com/authorize?{query_params}"
        # print("CLIENT_ID:", CLIENT_ID)
        # print("REDIRECT_URI:", REDIRECT_URI)
        # print("Generated Auth URL:", url)
        # print("Auth URL:", url)  # ✅ This will now print properly in Django logs
       # user-read-currently-playing

        return Response({'url': url}, status=status.HTTP_200_OK)
    
def spotify_callback(request, format=None):
    code = request.GET.get('code')
    error = request.GET.get('error')

    response = post('https://accounts.spotify.com/api/token', data={
                    'grant_type' : 'authorization_code',
                    'code': code,
                    'redirect_uri' : REDIRECT_URI,
                    'client_secret': CLIENT_SECRET,
                    'client_id' : CLIENT_ID
    }).json()
    print("Spotify token exchange response:", response)


    access_token = response.get('access_token')
    token_type = response.get('token_type')
    refresh_token = response.get('refresh_token')
    expires_in = response.get('expires_in')
    error = response.get('error')

    if not request.session.exists(request.session.session_key):
        request.session.create()

    update_or_create_user_tokens(
        request.session.session_key, 
        access_token, token_type, 
        expires_in, 
        refresh_token
        )

    return redirect('frontend:')
    #return redirect('http://127.0.0.1:3000')

class IsAuthenticated(APIView):
    def get(self, request, format=None):
        is_authenticated = is_spotify_authenticated(self.request.session.session_key)
        print(is_spotify_authenticated)
        return Response({'status' : is_authenticated}, status=status.HTTP_200_OK)
    


class CurrentSong(APIView):
    def get(self, request, format=None):
        room_code = self.request.session.get('room_code')
        if not room_code:
            return Response({"Error": "No room code in session"}, status=status.HTTP_400_BAD_REQUEST)

        room = Room.objects.filter(code=room_code).first()
        if not room:
            return Response({"Error": "Room not found"}, status=status.HTTP_404_NOT_FOUND)

        # Always use the host's session (since the host authenticated Spotify)
        host = room.host
        endpoint = "player/currently-playing"

        song = execute_spotify_api_request(host, endpoint)

        if 'error' in song or 'item' not in song: 
            return Response({}, status=status.HTTP_204_NO_CONTENT)
        
        item = song.get('item')
        if item is None:
            return Response({"song": None}, status=status.HTTP_200_OK)
        duration = item.get('duration_ms')
        progress = song.get('progress_ms')
        album_cover = item.get('album').get('images')[0].get('url')
        is_playing = song.get('is_playing')
        song_id = item.get('id')


        artist_string =""

        for i, artist in enumerate(item.get('artists')):
            if i > 0:
                artist_string += ", "
            name = artist.get('name')
            artist_string += name
        song_info = {
            'title': item.get('name'),
            'artist' : artist_string,
            'duration' : duration,
            'time' : progress,
            'image_url' : album_cover,
            'is_playing' : is_playing,
            'votes' : 0,
            'id': song_id
        }


        return Response(song_info, status=status.HTTP_200_OK)