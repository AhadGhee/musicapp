import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";

export default function CreateRoomPage() {
    // Define state using useState
    const [votesToSkip, setVotesToSkip] = useState(2);
    const [guestCanPause, setGuestCanPause] = useState(false);
    const [isHost, setIsHost] = useState(false);

    const { roomCode } = useParams();
    const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/get-room?code=" + roomCode)
      .then((response) => {
        if (!response.ok) {
            navigate("/create");
            throw new Error("Failed to fetch room details");
           

        }
        return response.json();
      })
      .then((data) => {
        setVotesToSkip(data.votes_to_skip);
        setGuestCanPause(data.guest_can_pause);
        setIsHost(data.is_host);
      })
      .catch((error) => {
        console.error("Error fetching room details:", error);
      });
  }, [roomCode]); // <- runs when roomCode changes


    return (
    <div>
        <h3>{roomCode}</h3>
        <p>Votes: {votesToSkip}</p>
        <p>Guest Can Pause: {guestCanPause.toString()}</p>
        <p>Host: {isHost.toString()}</p>
    </div>
    );
}