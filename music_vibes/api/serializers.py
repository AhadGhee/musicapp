
#Turn py code into Json for front end

# Step 1: What’s a Serializer?

# A serializer is like a translator.

# It converts Python objects / Django models ↔ JSON (or other formats).

# 👉 Why?
# Because when React (frontend) talks to Django (backend), it sends/receives JSON data, not Python objects.

from rest_framework import serializers
from .models import Room


class RoomSerializer(serializers.ModelSerializer):   # ModelSerializer is a DRF shortcut., Instead of writing a lot of code, it automatically builds a serializer from your model (Room).
    class Meta:   # It tells Django/DRF: “Here are some settings about how this serializer/model/form should behave.”
        model = Room
        fields = ('id', 'code', 'host', 'guest_can_pause','votes_to_skip', 'created_at')


class CreateRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ('guest_can_pause', 'votes_to_skip')
    