import React, { useState, useEffect } from "react";
import RoomJoinPage from "./RoomJoinPage";
import CreateRoomPage from "./CreateRoomPage";
import Room from "./Room";

import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";

import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import ButtonGroup from "@mui/material/ButtonGroup";

export default function HomePage() {
  // ---------------- State ----------------
  const [roomCode, setRoomCode] = useState(null);

  // ---------------- Lifecycle (replacement for componentDidMount) ----------------
  useEffect(() => {
    console.log("HomePage Mounted!");

    fetch("/api/user-in-room")
      .then((response) => response.json())
      .then((data) => {
        setRoomCode(data.code); // ✅ update hook state
      })
      .catch((error) => {
        console.error("Error fetching room info:", error);
      });
  }, []); // [] ensures this runs only once when component mounts

  // ---------------- Callback (equivalent to clearRoomCode in class) ----------------
  const clearRoomCode = () => {
    setRoomCode(null); // ✅ reset state back to null
  };

  // ---------------- Small render helper (homepage layout) ----------------
  const RenderHomePage = () => {
    return (
      <Grid
        container
        spacing={3}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: "100vh" }}
      >
        {/* <Grid container spacing={3}> */}
          <Grid item xs={12} align="center">
            <Typography variant="h3" component="h3">
              House Party
            </Typography>
          </Grid>

          <Grid item xs={12} align="center">
            <ButtonGroup variant="contained" color="primary">
              <Button color="primary" to="/join" component={Link}>
                Join a Room
              </Button>
              <Button color="secondary" to="/create" component={Link}>
                Create a Room
              </Button>
            </ButtonGroup>
          </Grid>
        {/* </Grid> */}
      </Grid>
    );
  };

  // ---------------- Return (JSX & Routes) ----------------
  return (
    <Router>
      <Routes>
        {/* Home route: if already in a room, redirect to that room */}
        <Route
          path="/"
          element={
            roomCode ? (
              <Navigate to={`/room/${roomCode}`} />
            ) : (
              <RenderHomePage />
            )
          }
        />

        {/* Join room page */}
        <Route path="/join" element={<RoomJoinPage />} />

        {/* Create room page */}
        <Route path="/create" element={<CreateRoomPage />} />

        {/* Room page with callback */}
        <Route
          path="/room/:roomCode"
          element={<Room leaveRoomCallback={clearRoomCode} />}
        />
      </Routes>
    </Router>
  );
}