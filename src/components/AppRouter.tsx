import UserForm from "./UserForm";
import HomePage from "./Home/HomePage";
import ReservePage from "./Reserve/ReservePage";
import ArrangePage from "./Arrange/ArrangePage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="register" element={<UserForm />} />
        <Route path="reserve" element={<ReservePage />} />
        <Route path="arrange" element={<ArrangePage />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
