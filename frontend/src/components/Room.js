import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";          
import Grid from "@mui/material/Grid";              
import Typography from "@mui/material/Typography";  
import { Link } from 'react-router-dom';
import { Navigate } from "react-router-dom"; 
import CreateRoomPage from './CreateRoomPage';

export default function Room() {
    // Define state using useState
    const [votesToSkip, setVotesToSkip] = useState(2);
    const [guestCanPause, setGuestCanPause] = useState(false);
    const [isHost, setIsHost] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [spotifyAuthenticated, setSpotifyAuthenticated] = useState(false);

    const { roomCode } = useParams();
    const navigate = useNavigate();

    const getRoomDetails = () => {
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
            if (data.is_host) {
                authenticateSpotify();
        }

        })
        .catch((error) => {
            console.error("Error fetching room details:", error);
        });

    };

    const authenticateSpotify = () => {
        fetch('/spotify/is-authenticated').then((response) => response.json()).then((data) => {
            setSpotifyAuthenticated(data.status);
            if (!data.status) {
                fetch('/spotify/get-auth-url').then((response) => response.json()).then((data) => {
                    window.location.replace(data.url);
                })
            }
        })
    }

    // -------------------------------
    // useEffect runs on mount/roomCode change
    // -------------------------------
    useEffect(() => {
        getRoomDetails();
    }, [roomCode]);


    const leaveButtonPressed = () => {
    const requestOptions = {
        method: "POST", // HTTP method we’re using to hit the backend
        headers: { "Content-Type": "application/json" }, // tell backend it's JSON
    };
    

    fetch("/api/leave-room", requestOptions)
        .then((response) => {
        if (response.ok) {
            // ✅ if backend successfully processed the request
            navigate("/"); // redirect user back to homepage
        } else {
            console.error("Failed to leave the room");
        }
        })
        .catch((error) => {
        // ✅ catch network or unexpected errors
        console.error("Error leaving room:", error);
        });
    };

    const updateShowSettings = (value) => {
        setShowSettings(value)
    }


    const renderSettings = () =>{
        return (
        <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <CreateRoomPage update={true} votesToSkip={votesToSkip} guestCanPause={guestCanPause} roomCode={roomCode} updateCallback={getRoomDetails}></CreateRoomPage>
            </Grid>
            <Grid item xs={12} align="center">
                    <Button 
                        variant="contained" 
                        color="secondary" 
                        onClick={() => updateShowSettings(false)} // ✅ no `this` in functional components
                    >
                        Close
                    </Button>
            </Grid>
        </Grid>
        );
    };

    const renderSettingsButton = () => {
  return (
    <Grid item xs={12} align="center">
      <Button 
        variant="contained" 
        color="primary" 
        onClick={() => updateShowSettings(true)} // ✅ no `this` in functional components
      >
        Settings
      </Button>
    </Grid>
    );
    };


    if (showSettings) {
        return renderSettings();
    }
  else
  {

    
    return (
    <div>
        <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <Typography variant="h6" component="h6">
                    Code: {roomCode}
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <Typography variant="h6" component="h6">
                    Votes: {votesToSkip}
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <Typography variant="h6" component="h6">
                    Guest Can Pause: {guestCanPause.toString()}
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <Typography variant="h6" component="h6">
                    Host: {isHost.toString()}
                </Typography>
            </Grid>
            { isHost ? renderSettingsButton() : null }
            <Grid item xs={12} align="center">
                <Button 
                    variant="contained" 
                    color="secondary"
                    onClick={leaveButtonPressed}
                    >
                        Leave Room
                    </Button>
            </Grid>
        </Grid>




{/* 
        <h3>{roomCode}</h3>
        <p>Votes: {votesToSkip}</p>
        <p>Guest Can Pause: {guestCanPause.toString()}</p>
        <p>Host: {isHost.toString()}</p> */}
    </div>
    );
}
}