// import App from "./components/App.js";


// import React from "react";
// import { createRoot } from "react-dom/client";
// import App from "./components/App";

// const appDiv = document.getElementById("app");
// const root = createRoot(appDiv);
// root.render(<App />);

console.log("BUNDLE_VERSION: ", Date.now())

import React from "react";
import { createRoot } from "react-dom/client";
import App from "./components/App";
const root = createRoot(document.getElementById("app"));
root.render(<App />);