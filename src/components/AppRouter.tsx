import UserForm from "./UserForm";
import HomePage from "./Home/HomePage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="register" element={<UserForm />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
