import "./index.css";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/dash";
import Doctors from "./pages/Doctors";
import BookAppointment from "./pages/BookAppointment";
import MyAppointments from "./pages/MyAppointments";
import AIHealthAssistant from "./pages/AIHealthAssistant";
import DoctorDashboard from "./pages/DoctorDashboard";

function Home() {
  return (
    <div className="home-page">
      <div className="home-content">

        <h1>
          MediAI 🩺
        </h1>

        <p>
          Smart healthcare appointment management
          powered by AI.
        </p>

        <div className="home-buttons">

          <a
            href="/login"
            className="home-btn primary"
          >
            Login
          </a>

          <a
            href="/register"
            className="home-btn secondary"
          >
            Register
          </a>

        </div>

      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/doctor-dashboard"
          element={<DoctorDashboard />}
        />

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/doctors"
          element={<Doctors />}
        />

        <Route
          path="/book-appointment"
          element={<BookAppointment />}
        />

        <Route
          path="/my-appointments"
          element={<MyAppointments />}
        />

        <Route
          path="/ai-assistant"
          element={<AIHealthAssistant />}
        />

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;