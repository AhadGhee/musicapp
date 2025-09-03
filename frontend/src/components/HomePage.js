// import React, { Component } from "react";

// export default class HomePage extends Component {
//   render() {
//     return <p>This is the home page</p>;
//   }
// }

import React from "react";
import RoomJoinPage from "./RoomJoinPage";
import CreateRoomPage from "./CreateRoomPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Room from './Room';


export default function HomePage() {
  return (
    <Router>
      <Routes>
        {/* home page */}
        <Route path="/" element={<p>This is the home page</p>} />

        {/* join route -> loads RoomJoinPage component */}
        <Route path="/join" element={<RoomJoinPage />} />

        {/* create route -> loads CreateRoomPage component */}
        <Route path="/create" element={<CreateRoomPage />} />
        <Route path="/room/:roomCode" element={<Room />}/>
      </Routes>
    </Router>
  );
}
