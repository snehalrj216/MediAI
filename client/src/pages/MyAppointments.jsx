import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  Stethoscope,
  XCircle,
  Loader2,
} from "lucide-react";

function MyAppointments() {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        if (!user?.id || user.role !== "patient") {
          navigate("/login");
          return;
        }

        const response = await fetch(
          `https://mediai-vs5s.onrender.com/api/appointments/patient/${user.id}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch appointments"
          );
        }

        setAppointments(data.appointments || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [navigate, user?.id, user?.role]);

  const handleCancel = async (appointmentId) => {
    setCancelling(appointmentId);
    setError("");

    try {
      const response = await fetch(
        `https://mediai-vs5s.onrender.com/api/appointments/${appointmentId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "cancelled",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to cancel appointment"
        );
      }

      setAppointments((previous) =>
        previous.map((appointment) =>
          appointment._id === appointmentId
            ? {
                ...appointment,
                status: "cancelled",
              }
            : appointment
        )
      );
    } catch (error) {
      setError(error.message);
    } finally {
      setCancelling("");
    }
  };

  return (
    <div className="appointments-page">

      {/* HEADER */}
      <div className="appointments-header">

        <button
          className="back-btn"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>

        <div>
          <h1>My Appointments</h1>

          <p>
            View and manage your doctor appointments.
          </p>
        </div>

      </div>

      {/* CONTENT */}
      <div className="appointments-container">

        {loading ? (
          <div className="appointment-loading">
            <Loader2
              className="spin"
              size={32}
            />
            <p>Loading appointments...</p>
          </div>
        ) : error ? (
          <div className="doctor-error">
            {error}
          </div>
        ) : appointments.length === 0 ? (
          <div className="no-appointments">

            <CalendarDays size={50} />

            <h2>
              No appointments yet
            </h2>

            <p>
              Your booked appointments will appear here.
            </p>

            <button
              className="primary-btn"
              onClick={() => navigate("/doctors")}
            >
              Find a Doctor
            </button>

          </div>
        ) : (
          <div className="my-appointments-list">

            {appointments.map((appointment) => (
              <div
                className="my-appointment-card"
                key={appointment._id}
              >

                {/* DOCTOR ICON */}
                <div className="my-appointment-doctor-icon">
               <Stethoscope size={28} />
             </div>

                {/* DETAILS */}
                <div className="my-appointment-info">

                  <div className="my-appointment-header">

                    <div>
                      <h2>
                        {appointment.doctor?.name ||
                          "Doctor"}
                      </h2>

                      <p>
                        {appointment.doctor?.specialization ||
                          "Medical Specialist"}
                      </p>
                    </div>

                    <span
                      className={`appointment-status ${appointment.status}`}
                    >
                      {appointment.status}
                    </span>

                  </div>

                  <div className="appointment-details">

                    <span>
                      <CalendarDays size={17} />
                      {appointment.date}
                    </span>

                    <span>
                      <Clock size={17} />
                      {appointment.time}
                    </span>

                  </div>

                  {appointment.reason && (
                    <div className="appointment-reason">

                      <strong>
                        Reason:
                      </strong>{" "}

                      {appointment.reason}

                    </div>
                  )}

                  {appointment.status === "pending" && (
                    <button
                      className="cancel-appointment-btn"
                      disabled={
                        cancelling === appointment._id
                      }
                      onClick={() =>
                        handleCancel(appointment._id)
                      }
                    >
                      {cancelling === appointment._id ? (
                        <>
                          <Loader2
                            className="spin"
                            size={17}
                          />
                          Cancelling...
                        </>
                      ) : (
                        <>
                          <XCircle size={17} />
                          Cancel Appointment
                        </>
                      )}
                    </button>
                  )}

                </div>

              </div>
            ))}

          </div>
        )}

            </div>

      {/* FOOTER */}
      <footer className="my-appointments-footer">
        <div className="my-appointments-footer-content">

          <div>
            <h3>MediAI</h3>
            <p>Smart Healthcare, Simplified.</p>
          </div>

          <div className="my-appointments-footer-tech">
            <span>
              Built with React • Node.js • MongoDB • Gemini AI
            </span>
          </div>

        </div>

        <div className="my-appointments-footer-bottom">
          © 2026 MediAI • All rights reserved.
        </div>
      </footer>

    </div>
  );
}

export default MyAppointments;