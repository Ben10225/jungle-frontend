import AppRouter from "./components/AppRouter";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";

import "./App.css";

library.add(fab);

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
