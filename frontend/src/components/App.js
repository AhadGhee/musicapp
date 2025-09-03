// import { Component } from "react";
// import HomePage from "./HomePage";
// import RoomJoinPage from "./RoomJoinPage";
// import CreateRoomPage from "./CreateRoomPage";

// export default class App extends Component {
//   constructor(props) {
//     super(props);
//   }

//   render() {
//     return (
//       <div>
//         <HomePage />
//         <RoomJoinPage />
//         <CreateRoomPage />
//       </div>
//     );
//   }
// }

// // const appDiv = document.getElementById("app");
// const root = createRoot(appDiv);
// root.render(<App />);

import React from "react";
import HomePage from "./HomePage";
import RoomJoinPage from "./RoomJoinPage";
import CreateRoomPage from "./CreateRoomPage";

export default function App() {
  return (
    <div className="center">
      <HomePage />
    </div>
  );
}