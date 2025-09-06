import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom"; 

// Material-UI (MUI) components
import Button from "@mui/material/Button";          
import Grid from "@mui/material/Grid";              
import Typography from "@mui/material/Typography";  
import TextField from "@mui/material/TextField";    

// ✅ Functional Component
export default function RoomJoinPage() {
  const [roomCode, setRoomCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // hook for navigation

    // ✅ handler for typing in the text field
  const handleTextFieldChange = (e) => {
    setRoomCode(e.target.value); // update state with input value
  };

  const roomButtonPressed = () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
      code: roomCode, // send the roomCode entered by user
      }),
    };

    fetch("/api/join-room", requestOptions)
      .then((response) => {
        if (response.ok) {
          //  navigate to the room page if success
          navigate(`/room/${roomCode}`);
          console.log(roomCode)
        } else {
          //  show error message if room not found
          setError("Room not found.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <Grid
      container
      spacing={2}            
      direction="column"      // stack items vertically
      alignItems="center"     // center horizontally
      justifyContent="center" // center vertically
      style={{ minHeight: "100vh" }} // take full screen height
    >
      {/* First row: Title */}
      <Grid item>
        <Typography variant="h4" component="h4">
          Join a Room
        </Typography>
      </Grid>

      {/* Second row: Input field */}
      <Grid item>
        <TextField
          error={error}
          label="Code"
          placeholder="Enter a Room Code"
          value={roomCode}
          helperText={error ? "Invalid room code" : ""} // optional error message
          variant="outlined"
          onChange={handleTextFieldChange} // ✅ works with hooks
        />
      </Grid>

      {/* Third row: Buttons */}
      <Grid item>
        <Button 
          variant="contained" 
          color="primary"
          onClick={roomButtonPressed} // placeholder
        >
          Enter Room
        </Button>
      </Grid>

      <Grid item>
        <Button 
          variant="contained" 
          color="secondary" 
          to="/" 
          component={Link}   
        >
          Back
        </Button>
      </Grid>
    </Grid>
  );
}