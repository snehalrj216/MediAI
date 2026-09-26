import { useEffect } from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";

import {
  Bot,
  Search,
  CalendarDays,
  User,
  LogOut,
  Stethoscope,
  Clock,
} from "lucide-react";

function Dashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  useEffect(() => {
    const storedUser = JSON.parse(
      localStorage.getItem("user")
    );

    if (!storedUser) {
      navigate("/login");
      return;
    }

    if (storedUser.role === "doctor") {
      navigate("/doctor-dashboard", {
        replace: true,
      });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  const scrollToFeatures = () => {
    document
      .getElementById("features")
      ?.scrollIntoView({
        behavior: "smooth",
      });
  };

  if (user?.role === "doctor") {
    return null;
  }

  return (
    <div className="dashboard-page">

      {/* =========================
          NAVBAR
      ========================= */}

      <nav className="dashboard-navbar">

        {/* LOGO */}
        <div className="dashboard-logo">

          <div className="logo-icon">
            <Stethoscope size={20} />
          </div>

          <div className="logo-text">
            <strong>
              MediAI
            </strong>

            <span>
              Smart Healthcare
            </span>
          </div>

        </div>


        {/* NAVIGATION */}
        <div className="dashboard-nav-links">

          <button
            onClick={() =>
              navigate("/dashboard")
            }
          >
            Home
          </button>

          <button
            onClick={scrollToFeatures}
          >
            Features
          </button>

          <button
            onClick={() => {
              alert(
                "MediAI helps patients find doctors, get AI-assisted guidance and manage appointments."
              );
            }}
          >
            About
          </button>

          <button
            onClick={() => {
              alert(
                "For support, please use the healthcare features available in this application."
              );
            }}
          >
            Contact
          </button>

        </div>


        {/* USER AREA */}
        <div className="dashboard-user">

          <span>
            Hi, {user?.name || "Patient"}
          </span>

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            <LogOut size={16} />
            Logout
          </button>

        </div>

      </nav>


      {/* =========================
          MAIN CONTENT
      ========================= */}

      <main className="dashboard-container">


        {/* =========================
            WELCOME
        ========================= */}

        <section className="dashboard-welcome">

          <div>

            <p className="dashboard-label">
              PATIENT DASHBOARD
            </p>

            <h1>
              Welcome,{" "}
              {user?.name || "Patient"} 👋
            </h1>

            <p>
              Manage your healthcare appointments
              and find the right doctor with AI
              assistance.
            </p>

          </div>


          <div className="welcome-icon">
            🩺
          </div>

        </section>


        {/* =========================
            FEATURES
        ========================= */}

        <section
          className="dashboard-section"
          id="features"
        >

          <h2>
            Features
          </h2>


          <div className="dashboard-grid">


            {/* AI HEALTH ASSISTANT */}

            <div
              className="dashboard-card ai-card"
              onClick={() =>
                navigate("/ai-assistant")
              }
            >

              <div className="card-icon">
                <Bot size={28} />
              </div>

              <h3>
                AI Health Assistant
              </h3>

              <p>
                Describe your health concern and
                get an AI-powered doctor
                specialization suggestion.
              </p>

              <span className="card-link">
                Ask AI →
              </span>

            </div>


            {/* FIND A DOCTOR */}

            <div
              className="dashboard-card"
              onClick={() =>
                navigate("/doctors")
              }
            >

              <div className="card-icon">
                <Search size={28} />
              </div>

              <h3>
                Find a Doctor
              </h3>

              <p>
                Search doctors by specialization,
                experience and availability.
              </p>

              <span className="card-link">
                Find Doctors →
              </span>

            </div>


            {/* MY APPOINTMENTS */}

            <div
              className="dashboard-card"
              onClick={() =>
                navigate("/my-appointments")
              }
            >

              <div className="card-icon">
                <CalendarDays size={28} />
              </div>

              <h3>
                My Appointments
              </h3>

              <p>
                View, track and manage your
                upcoming doctor appointments.
              </p>

              <span className="card-link">
                View Appointments →
              </span>

            </div>

          </div>

        </section>


        {/* =========================
            HEALTHCARE OVERVIEW
        ========================= */}

        <section className="dashboard-section">

          <h2>
            Healthcare Overview
          </h2>


          <div className="overview-grid">


            {/* UPCOMING */}

            <div className="overview-card">

              <CalendarDays size={22} />

              <div>

                <span>
                  Upcoming
                </span>

                <strong>
                  0
                </strong>

              </div>

            </div>


            {/* APPOINTMENTS */}

            <div className="overview-card">

              <Clock size={22} />

              <div>

                <span>
                  Appointments
                </span>

                <strong>
                  0
                </strong>

              </div>

            </div>


            {/* DOCTORS */}

            <div className="overview-card">

              <Stethoscope size={22} />

              <div>

                <span>
                  Doctors
                </span>

                <strong>
                  0
                </strong>

              </div>

            </div>


            {/* ACCOUNT */}

            <div className="overview-card">

              <User size={22} />

              <div>

                <span>
                  Account
                </span>

                <strong>
                  {user?.role || "Patient"}
                </strong>

              </div>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Dashboard;