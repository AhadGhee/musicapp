// ✅ Core React library
import React, { useState } from "react";

// ✅ Material-UI (MUI) imports
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Collapse from "@mui/material/Collapse";
import Alert from "@mui/material/Alert";


// ✅ React Router
import { Link, useNavigate } from "react-router-dom";

// =======================================================
// ✅ Functional component definition
// =======================================================
export default function CreateRoomPage(props) {
  const navigate = useNavigate();

  // initialize state using props defaults
  const [votesToSkip, setVotesToSkip] = useState(props.votesToSkip);
  const [guestCanPause, setGuestCanPause] = useState(props.guestCanPause);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // -------------------------------
  // Handlers
  // -------------------------------
  const handleVotesChange = (e) => {
    setVotesToSkip(e.target.value);
  };

  const handleGuestCanPauseChange = (e) => {
    setGuestCanPause(e.target.value === "true");
  };

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
        navigate("/room/" + data.code);
      })
      .catch((error) => {
        console.error("Error creating room:", error);
      });
  };



const updateButtonPressed = () => {
  const requestOptions = {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      votes_to_skip: votesToSkip,
      guest_can_pause: guestCanPause,
      code: props.roomCode, // must match what your backend expects
    }),
  };

  fetch("/api/update-room", requestOptions)
    .then((response) => {
      if (response.ok) {
        //  return parsed JSON to the next .then
        return response.json();
      } else {
        // trigger error so we skip the next .then
        throw new Error("Error updating room");
      }
    })
    .then((data) => {
      console.log("Update response:", data); // ✅ now safe, because `data` is defined
      setSuccessMsg("Room updated successfully! 😜");
      setErrorMsg("");

      // Run parent callback if passed
      if (props.updateCallback) {
        props.updateCallback();
      }
    })
    .catch((error) => {
      console.error("Update failed:", error);
      setErrorMsg("Error updating room! 😒");
      setSuccessMsg("");
    });
};


  // -------------------------------
  // Button renderers
  // -------------------------------
  const renderCreateButtons = () => {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} sm={8} md={6} lg={4} align="center">
          <Button
            color="primary"
            variant="contained"
            onClick={handleRoomButtonPressed}
            style={{ marginRight: 10 }}
          >
            Create A Room
          </Button>

          <Button
            color="secondary"
            variant="contained"
            to="/"
            component={Link}
          >
            Back
          </Button>
        </Grid>
      </Grid>
    );
  };

  const renderUpdateButtons = () => {
    return (
      
      <Grid item xs={12} sm={8} md={6} lg={4} align="center">
        <Button
          color="primary"
          variant="contained"
          onClick={updateButtonPressed}
          style={{ marginRight: 10 }}
        >
          Update Room
        </Button>
      </Grid>
    );
  };

  const title = props.update ? "Update Room" : "Create a Room";

  // -------------------------------
  // JSX (UI Layout)
  // -------------------------------
  return (
    <Grid
      container
      spacing={3}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: "100vh" }}
    >
      <Grid item xs={12} sm={8} md={6} lg={4} align="center">
        <Grid item xs={12} sm={8} md={6} lg={4} align="center">
            <Collapse in={errorMsg != "" || successMsg != ""}>
              {successMsg ? (
                <Alert severity="success" onClose={() => setSuccessMsg("")}>{successMsg}</Alert>
              ) : (
                <Alert severity="error" onClose={() => setErrorMsg("")}>{errorMsg}</Alert>
              )}
            </Collapse>
        </Grid>
        {/* Title */}
        <Typography component="h4" variant="h4">
          {title}
        </Typography>

        {/* Radio buttons */}
        <FormControl component="fieldset" style={{ marginTop: 20 }}>
          <FormHelperText>
            <div>Guest Control of Playback State</div>
          </FormHelperText>

          <RadioGroup
            row
            value={guestCanPause.toString()}
            onChange={handleGuestCanPauseChange}
          >
            <FormControlLabel
              value="true"
              control={<Radio color="primary" />}
              label="Play/Pause"
              labelPlacement="bottom"
            />
            <FormControlLabel
              value="false"
              control={<Radio color="secondary" />}
              label="No Control"
              labelPlacement="bottom"
            />
          </RadioGroup>
        </FormControl>

        {/* Votes input */}
        <FormControl style={{ marginTop: 20 }}>
          <TextField
            required
            type="number"
            value={votesToSkip}
            onChange={handleVotesChange}
            inputProps={{
              min: 1,
              style: { textAlign: "center" },
            }}
          />
          <FormHelperText>
            <div align="center">Votes Required to Skip Song</div>
          </FormHelperText>
        </FormControl>

        {/* Action buttons */}
        <div style={{ marginTop: 20 }}>
          {props.update ? renderUpdateButtons() : renderCreateButtons()}
        </div>
      </Grid>
    </Grid>
  );
}

// ✅ Default props go here
CreateRoomPage.defaultProps = {
  votesToSkip: 2,
  guestCanPause: true,
  update: false,
  roomCode: null,
  updateCallback: () => {},
};


          // <Button
          //   color="primary"
          //   variant="contained"
          //   onClick={handleRoomButtonPressed} // calls function
          //   style={{ marginRight: 10 }}
          // >
          //   Create A Room
          // </Button>

          // {/* "Back" → navigates to "/" (home page) */}
          // <Button
          //   color="secondary"
          //   variant="contained"
          //   to="/"
          //   component={Link} // turns button into a React Router link
          // >
          //   Back
          // </Button>