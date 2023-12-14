import AppRouter from "./components/AppRouter";
import "./App.css";
// import React from "react";

export const ENDPOINT = "http://localhost:3000";
// export const ENDPOINT = "http://50.112.65.167:3000";

function App() {
  return (
    <>
      {/* <React.StrictMode> */}
      <AppRouter />
      {/* </React.StrictMode> */}
    </>
  );
}

export default App;
