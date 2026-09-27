import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

import {
  Activity,
  ArrowRight,
  Brain,
  CalendarDays,
  CheckCircle2,
  Eye,
  EyeOff,
  HeartPulse,
  Plus,
  Search,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* =========================================================
     LOGIN
  ========================================================= */

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "https://mediai-vs5s.onrender.com/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Invalid email or password."
        );
      }

      /* SAVE LOGIN DATA */

      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      /* ROLE BASED REDIRECT */

      if (data.user.role === "doctor") {
        navigate("/doctor-dashboard");
      } else {
        navigate("/dashboard");
      }

    } catch (error) {
      console.error("Login Error:", error);

      setError(
        error.message ||
          "Something went wrong. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };


  /* =========================================================
     NAVIGATION
  ========================================================= */

  const handleFindDoctor = () => {
    navigate("/doctors");
  };

  const handleAIAssistant = () => {
    navigate("/ai-assistant");
  };

  const handleCreateAccount = () => {
    navigate("/register");
  };

  const handleHowItWorks = () => {
    document
      .getElementById("how-it-works")
      ?.scrollIntoView({
        behavior: "smooth",
      });
  };


  return (
    <div className="login-page">


      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <nav className="login-navbar">

        {/* BRAND */}

        <div
          className="brand"
          onClick={() => navigate("/login")}
        >

          <div className="brand-icon">
            <Stethoscope size={25} />
          </div>

          <div>
            <h2>MediAI</h2>

            <span>
              Smart Healthcare
            </span>
          </div>

        </div>


        {/* NAVIGATION */}

        <div className="nav-actions">

          <button
            onClick={handleFindDoctor}
          >
            Find Doctors
          </button>

          <button
            onClick={handleAIAssistant}
          >
            AI Assistant
          </button>

          <button
            className="nav-register-btn"
            onClick={handleCreateAccount}
          >
            Create Account
          </button>

        </div>

      </nav>


      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="login-main">


        {/* ===================================================
            HERO SECTION
        =================================================== */}

        <section className="hero-section">


          {/* BACKGROUND DECORATIONS */}

          <div className="hero-decoration">

            <div className="medical-circle circle-one"></div>

            <div className="medical-circle circle-two"></div>


            <div className="floating-medical medical-one">
              <HeartPulse size={25} />
            </div>


            <div className="floating-medical medical-two">
              <Plus size={25} />
            </div>


            <div className="floating-medical medical-three">
              <Activity size={25} />
            </div>

          </div>


          {/* HERO CONTENT */}

          <div className="hero-content">


            <div className="hero-badge">

              <Activity size={16} />

              <span>
                Smart Healthcare Platform
              </span>

            </div>


            <h1>
              Your Health,
              <br />
              <span>
                Smarter & Simpler.
              </span>
            </h1>


            <p className="hero-description">
              Find the right doctor, get AI-powered
              health guidance, and manage your
              appointments — all in one place.
            </p>


            {/* HERO BUTTONS */}

            <div className="hero-buttons">

              <button
                className="primary-hero-btn"
                onClick={handleFindDoctor}
              >
                Find a Doctor
                <ArrowRight size={18} />
              </button>


              <button
                className="secondary-hero-btn"
                onClick={handleAIAssistant}
              >
                <Brain size={18} />
                Ask AI Assistant
              </button>

            </div>


            {/* BENEFITS */}

            <div className="hero-benefits">

              <div>
                <CheckCircle2 size={17} />

                <span>
                  Easy Appointment Booking
                </span>
              </div>


              <div>
                <CheckCircle2 size={17} />

                <span>
                  AI Health Assistant
                </span>
              </div>


              <div>
                <CheckCircle2 size={17} />

                <span>
                  Doctor Profiles
                </span>
              </div>

            </div>

          </div>


          {/* =================================================
              LOGIN CARD
          ================================================= */}

          <div className="login-card">


            <div className="login-icon">
              <Stethoscope size={29} />
            </div>


            <h2>
              Welcome Back 👋
            </h2>


            <p className="login-subtitle">
              Login to continue your healthcare
              journey.
            </p>


            <form onSubmit={handleLogin}>


              {/* EMAIL */}

              <div className="input-group">

                <label htmlFor="email">
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  placeholder="Enter your email"
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  disabled={loading}
                  autoComplete="email"
                />

              </div>


              {/* PASSWORD */}

              <div className="input-group">

                <label htmlFor="password">
                  Password
                </label>


                <div className="password-wrapper">

                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    placeholder="Enter your password"
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                    disabled={loading}
                    autoComplete="current-password"
                  />


                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >

                    {showPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}

                  </button>

                </div>

              </div>


              {/* ERROR */}

              {error && (
                <div className="login-error">
                  {error}
                </div>
              )}


              {/* LOGIN BUTTON */}

              <button
                type="submit"
                className="login-submit"
                disabled={loading}
              >

                {loading ? (
                  <>
                    <Activity
                      size={18}
                      className="spin"
                    />

                    Logging in...
                  </>
                ) : (
                  <>
                    Login
                    <ArrowRight size={18} />
                  </>
                )}

              </button>


            </form>


            {/* REGISTER */}

            <div className="register-text">

              Don't have an account?

              <button
                type="button"
                onClick={handleCreateAccount}
              >
                Create one
              </button>

            </div>


            {/* SECURITY */}

            <div className="secure-note">

              <ShieldCheck size={16} />

              <span>
                Secure login with encrypted
                authentication
              </span>

            </div>

          </div>

        </section>


        {/* ===================================================
            FEATURES
        =================================================== */}

        <section className="features-section">


          <div className="section-heading">

            <span>
              EVERYTHING
              <br />
              YOU NEED
            </span>


            <h2>
              Healthcare
              <br />
              made easier
            </h2>


            <p>
              From finding a doctor to managing
              appointments, everything is in one place.
            </p>

          </div>


          <div className="features-grid">


            {/* FEATURE 1 */}

            <div className="feature-card">

              <div className="feature-icon">
                <Brain size={29} />
              </div>

              <h3>
                AI Health Assistant
              </h3>

              <p>
                Describe your concern and get
                a suggested medical specialization
                to help you find the right doctor.
              </p>

            </div>


            {/* FEATURE 2 */}

            <div className="feature-card">

              <div className="feature-icon">
                <Search size={29} />
              </div>

              <h3>
                Find Doctors
              </h3>

              <p>
                Search doctors by specialization,
                experience and availability.
              </p>

            </div>


            {/* FEATURE 3 */}

            <div className="feature-card">

              <div className="feature-icon">
                <CalendarDays size={29} />
              </div>

              <h3>
                Easy Booking
              </h3>

              <p>
                Choose your doctor and book an
                appointment in just a few clicks.
              </p>

            </div>

          </div>

        </section>


        {/* ===================================================
            HOW IT WORKS
        =================================================== */}

        <section
          className="how-section"
          id="how-it-works"
        >


          <div className="section-heading">


            <span>
              SIMPLE PROCESS
            </span>


            <h2>
              How it works
            </h2>


            <p>
              Follow a simple process to manage
              your healthcare appointments.
            </p>

          </div>


          <div className="steps-grid">


            {/* STEP 1 */}

            <div className="step">

              <div className="step-number">
                01
              </div>

              <h3>
                Describe Your Concern
              </h3>

              <p>
                Tell our AI assistant about your
                health concern.
              </p>

            </div>


            {/* STEP 2 */}

            <div className="step">

              <div className="step-number">
                02
              </div>

              <h3>
                Find Your Specialist
              </h3>

              <p>
                Explore doctors based on the
                suggested specialization.
              </p>

            </div>


            {/* STEP 3 */}

            <div className="step">

              <div className="step-number">
                03
              </div>

              <h3>
                Book Appointment
              </h3>

              <p>
                Select a convenient date and time
                with your doctor.
              </p>

            </div>


            {/* STEP 4 */}

            <div className="step">

              <div className="step-number">
                04
              </div>

              <h3>
                Manage Your Care
              </h3>

              <p>
                Track your appointments from your
                personal dashboard.
              </p>

            </div>

          </div>

        </section>

      </main>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="login-footer">


        <div className="footer-main">


          {/* FOOTER BRAND */}

          <div className="footer-brand">

            <div className="footer-brand-icon">
              <Stethoscope size={22} />
            </div>

            <div>

              <h3>
                MediAI
              </h3>

              <p>
                Smart healthcare assistance for
                easier appointment management.
              </p>

            </div>

          </div>


          {/* QUICK LINKS */}

          <div className="footer-column">

            <h4>
              Quick Links
            </h4>

            <button
              onClick={handleFindDoctor}
            >
              Find Doctors
            </button>

            <button
              onClick={handleAIAssistant}
            >
              AI Assistant
            </button>

            <button
              onClick={handleHowItWorks}
            >
              How It Works
            </button>

          </div>


          {/* PATIENT LINKS */}

          <div className="footer-column">

            <h4>
              For Patients
            </h4>

            <button
              onClick={handleFindDoctor}
            >
              Book Appointment
            </button>

            <button
              onClick={() =>
                navigate("/my-appointments")
              }
            >
              My Appointments
            </button>

            <button
              onClick={handleAIAssistant}
            >
              Healthcare Assistant
            </button>

          </div>

        </div>


        {/* FOOTER BOTTOM */}

        <div className="footer-bottom">

          <span>
            © 2026 MediAI
            <br />
            Smart Healthcare, Simplified.
          </span>

          <span>
            Built with React • Node.js • MongoDB • Gemini AI
          </span>

        </div>

      </footer>

    </div>
  );
}

export default Login;