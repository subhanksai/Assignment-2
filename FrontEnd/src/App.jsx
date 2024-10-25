import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignUpForm from "./Pages/Forms/signup";
import Login from "./Pages/Forms/login";
import HomePage from "./Pages/home";
import DetailedPage from "./Pages/detailed";
import ArticlePage from "./Pages/articlePage";
import Navbar from "./Pages/navbar.component";
import AlertPage from "./Pages/AlertPage";

import "./App.css";

import SummaryPage from "./Pages/summary";

const App = () => {
  return (
    <Router>
      {" "}
      {/* Use Router instead of BrowserRouter */}
      <div className="main">
        <Navbar />
        <Routes>
          <Route path="/register" element={<SignUpForm />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/detailed" element={<DetailedPage />} />
          <Route path="/articles" element={<ArticlePage />} />
          <Route path="/alert" element={<AlertPage />} />
          <Route path="/summary" element={<SummaryPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
