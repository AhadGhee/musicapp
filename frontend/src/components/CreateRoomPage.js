// ✅ Core React library
import React, { useState } from "react";

// ✅ Material-UI (MUI) imports → prebuilt styled components
import Button from "@mui/material/Button";          // styled buttons
import Grid from "@mui/material/Grid";              // flexbox grid system
import Typography from "@mui/material/Typography";  // styled text
import TextField from "@mui/material/TextField";    // input field
import FormHelperText from "@mui/material/FormHelperText";  // helper text under form inputs
import FormControl from "@mui/material/FormControl";        // wrapper for form inputs
import Radio from "@mui/material/Radio";            // radio input
import RadioGroup from "@mui/material/RadioGroup";  // groups radio buttons
import FormControlLabel from "@mui/material/FormControlLabel"; // label+radio combined


// ✅ React Router component for client-side navigation (SPA links)
import { Link, useNavigate } from "react-router-dom";

// =======================================================
// ✅ Functional component definition
// =======================================================
export default function CreateRoomPage() {
   const navigate = useNavigate();
  // -------------------------------
  // ✅ State Management (React Hooks)
  // -------------------------------
  // guestCanPause → whether guests can control playback
  // setGuestCanPause → function to update it
  const [guestCanPause, setGuestCanPause] = useState(true);

  // votesToSkip → number of votes required to skip a song
  // setVotesToSkip → function to update it
  const [votesToSkip, setVotesToSkip] = useState(2);

  

  // -------------------------------
  // ✅ Event Handlers (logic)
  // -------------------------------

  // When the number input changes, update state
  const handleVotesChange = (e) => {
   setVotesToSkip(e.target.value); // controlled input → always tied to state
   
  };

  // When radio buttons change, update guestCanPause
  // e here is an event object, it helps with trigger events and tells the code to do something based on user input or some change
  const handleGuestCanPauseChange = (e) => {
    // value is a string ("true" or "false"), so convert to boolean
    setGuestCanPause(e.target.value === "true");
  };

  // When "Create A Room" button is pressed
  const handleRoomButtonPressed = () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        votes_to_skip: votesToSkip,
        guest_can_pause: guestCanPause,
      }),
    };

    fetch("/api/create-room", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        // ✅ navigate to new room page
        navigate("/room/" + data.code);
      })
      .catch((error) => {
        console.error("Error creating room:", error);
      });
  };

  // -------------------------------
  // ✅ JSX (UI Layout)
  // -------------------------------
  return (
    // Outer Grid container → centers everything vertically & horizontally
    <Grid
      container
      spacing={3}              // space between items
      direction="column"       // stack items vertically
      alignItems="center"      // center horizontally
      justifyContent="center"  // center vertically
      style={{ minHeight: "100vh" }} // take full screen height
    >
      {/* Inner Grid → wrapper for actual content */}
      <Grid item xs={12} sm={8} md={6} lg={4} align="center">
        
        {/* Page Title */}
        <Typography component="h4" variant="h4">
          Create a Room
        </Typography>

        {/* ----------------- Radio Buttons ----------------- */}
        <FormControl component="fieldset" style={{ marginTop: 20 }}>
          <FormHelperText>
            <div>Guest Control of Playback State</div>
          </FormHelperText>

          <RadioGroup
            row                       // display radio buttons side by side
            value={guestCanPause.toString()} // bind current state (string form)
            onChange={handleGuestCanPauseChange} // update state on change
          >
            {/* First radio button → Play/Pause */}
            <FormControlLabel
              value="true"                     // stored value
              control={<Radio color="primary" />} // actual radio button
              label="Play/Pause"               // text shown under
              labelPlacement="bottom"
            />

            {/* Second radio button → No Control */}
            <FormControlLabel
              value="false"
              control={<Radio color="secondary" />}
              label="No Control"
              labelPlacement="bottom"
            />
          </RadioGroup>
        </FormControl>

        {/* ----------------- Number Input ----------------- */}
        <FormControl style={{ marginTop: 20 }}>
          <TextField
            required                // input must be filled
            type="number"           // numeric only
            value={votesToSkip}     // controlled → tied to state
            onChange={handleVotesChange} // updates state on input
            inputProps={{
              min: 1, // prevent negative or zero
              style: { textAlign: "center" }, // center text inside box
            }}
          />
          <FormHelperText>
            <div align="center">Votes Required to Skip Song</div>
          </FormHelperText>
        </FormControl>

        {/* ----------------- Action Buttons ----------------- */}
        <div style={{ marginTop: 20 }}>
          {/* "Create A Room" → logs state (later: send API request) */}
          <Button
            color="primary"
            variant="contained"
            onClick={handleRoomButtonPressed} // calls function
            style={{ marginRight: 10 }}
          >
            Create A Room
          </Button>

          {/* "Back" → navigates to "/" (home page) */}
          <Button
            color="secondary"
            variant="contained"
            to="/"
            component={Link} // turns button into a React Router link
          >
            Back
          </Button>
        </div>
      </Grid>
    </Grid>
  );
}