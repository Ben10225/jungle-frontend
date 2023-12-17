import UserForm from "./UserForm";
import HomePage from "./Home/HomePage";
import ReservePage from "./Reserve/ReservePage";
import AdminCalPage from "./Admin/AdminCalPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="register" element={<UserForm />} />
        <Route path="reserve" element={<ReservePage />} />
        <Route path="admin" element={<AdminCalPage />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
