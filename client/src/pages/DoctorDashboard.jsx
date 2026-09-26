import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  Clock,
  User,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Loader2,
  LogOut,
} from "lucide-react";

function DoctorDashboard() {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [archivedAppointments, setArchivedAppointments] =
    useState([]);

  const [showHistory, setShowHistory] = useState(false);

  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] =
    useState(false);

  const [error, setError] = useState("");
  const [updating, setUpdating] = useState("");

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  // =========================================
  // FETCH ACTIVE APPOINTMENTS
  // =========================================

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        if (!user?.id || user.role !== "doctor") {
          navigate("/login");
          return;
        }

        const response = await fetch(
          `http://localhost:5000/api/appointments/doctor/${user.id}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to fetch appointments"
          );
        }

        setAppointments(
          (data.appointments || []).filter(
            (appointment) =>
              !appointment.archivedByDoctor
          )
        );
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [navigate, user?.id, user?.role]);

  // =========================================
  // UPDATE APPOINTMENT STATUS
  // =========================================

  const updateStatus = async (
    appointmentId,
    status
  ) => {
    setUpdating(appointmentId);
    setError("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/appointments/${appointmentId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update appointment"
        );
      }

      setAppointments((previous) =>
        previous.map((appointment) =>
          appointment._id === appointmentId
            ? {
                ...appointment,
                status,
              }
            : appointment
        )
      );
    } catch (error) {
      setError(error.message);
    } finally {
      setUpdating("");
    }
  };

  // =========================================
  // ARCHIVE COMPLETED APPOINTMENT
  // =========================================

  const archiveAppointment = async (
    appointmentId
  ) => {
    setUpdating(appointmentId);
    setError("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/appointments/${appointmentId}/archive`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to remove appointment"
        );
      }

      setAppointments((previous) =>
        previous.filter(
          (appointment) =>
            appointment._id !== appointmentId
        )
      );
    } catch (error) {
      setError(error.message);
    } finally {
      setUpdating("");
    }
  };

  // =========================================
  // FETCH COMPLETED HISTORY
  // =========================================

  const fetchArchivedAppointments = async () => {
    setHistoryLoading(true);
    setError("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/appointments/doctor/${user.id}/archived`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to fetch completed history"
        );
      }

      setArchivedAppointments(
        data.appointments || []
      );

      setShowHistory(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setHistoryLoading(false);
    }
  };

  // =========================================
  // LOGOUT
  // =========================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  // =========================================
  // STATISTICS
  // =========================================

  const totalAppointments =
    appointments.length;

  const pendingAppointments =
    appointments.filter(
      (appointment) =>
        appointment.status === "pending"
    ).length;

  const confirmedAppointments =
    appointments.filter(
      (appointment) =>
        appointment.status === "confirmed"
    ).length;

  const completedAppointments =
    appointments.filter(
      (appointment) =>
        appointment.status === "completed"
    ).length;

  return (
    <div className="doctor-dashboard">

      {/* =========================================
          TOP BAR
      ========================================= */}

      <header className="doctor-topbar">

        <div className="doctor-brand">

          <div className="doctor-brand-icon">
            🩺
          </div>

          <div>
            <h2>MediAI</h2>
            <span>Doctor Portal</span>
          </div>

        </div>

        <div className="doctor-profile">

          <div className="doctor-profile-info">

            <strong>
              {user?.name}
            </strong>

            <span>
              {user?.specialization ||
                "Doctor"}
            </span>

          </div>

          <button
            className="doctor-logout"
            onClick={handleLogout}
          >
            <LogOut size={17} />
            Logout
          </button>

        </div>

      </header>

      {/* =========================================
          MAIN CONTENT
      ========================================= */}

      <main className="doctor-dashboard-content">

        {/* BACK BUTTON */}

        <button
          className="back-btn"
          onClick={() =>
            navigate("/dashboard")
          }
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>

        {/* =========================================
            WELCOME
        ========================================= */}

        <section className="doctor-welcome">

          <div>

            <p className="doctor-welcome-label">
              DOCTOR DASHBOARD
            </p>

            <h1>
              Welcome, {user?.name} 👋
            </h1>

            <p>
              Manage your patient appointments
              and update appointment status.
            </p>

          </div>

          <div className="doctor-welcome-icon">
            🩺
          </div>

        </section>

        {/* =========================================
            STATS
        ========================================= */}

        <section className="doctor-stats">

          <div className="doctor-stat-card">

            <div className="doctor-stat-icon blue">
              <CalendarDays size={23} />
            </div>

            <div>
              <span>
                Total Appointments
              </span>

              <strong>
                {totalAppointments}
              </strong>
            </div>

          </div>

          <div className="doctor-stat-card">

            <div className="doctor-stat-icon orange">
              <Clock size={23} />
            </div>

            <div>
              <span>Pending</span>

              <strong>
                {pendingAppointments}
              </strong>
            </div>

          </div>

          <div className="doctor-stat-card">

            <div className="doctor-stat-icon green">
              <CheckCircle size={23} />
            </div>

            <div>
              <span>Confirmed</span>

              <strong>
                {confirmedAppointments}
              </strong>
            </div>

          </div>

          <div className="doctor-stat-card">

            <div className="doctor-stat-icon purple">
              <CheckCircle size={23} />
            </div>

            <div>
              <span>Completed</span>

              <strong>
                {completedAppointments}
              </strong>
            </div>

          </div>

        </section>

        {/* =========================================
            PATIENT APPOINTMENTS
        ========================================= */}

        <section className="doctor-appointments-section">

          <div className="section-heading">

            <div>

              <h2>
                Patient Appointments
              </h2>

              <p>
                View and manage your scheduled
                appointments.
              </p>

            </div>

            <div className="doctor-appointment-heading-actions">

              <span className="appointment-count">
                {totalAppointments} Total
              </span>

              <button
                className="history-btn"
                onClick={
                  fetchArchivedAppointments
                }
                disabled={historyLoading}
              >

                {historyLoading ? (
                  <>
                    <Loader2
                      className="spin"
                      size={16}
                    />
                    Loading...
                  </>
                ) : (
                  <>
                    <CalendarDays size={16} />
                    Completed History
                  </>
                )}

              </button>

            </div>

          </div>

          {/* =========================================
              ACTIVE APPOINTMENTS
          ========================================= */}

          {loading ? (

            <div className="appointment-loading">

              <Loader2
                className="spin"
                size={32}
              />

              <p>
                Loading appointments...
              </p>

            </div>

          ) : error ? (

            <div className="doctor-error">
              {error}
            </div>

          ) : appointments.length === 0 ? (

            <div className="no-appointments">

              <CalendarDays size={48} />

              <h2>
                No appointments yet
              </h2>

              <p>
                Patient appointments will
                appear here.
              </p>

            </div>

          ) : (

            <div className="doctor-appointment-list">

              {appointments.map(
                (appointment) => (

                  <div
                    className="doctor-appointment-card"
                    key={appointment._id}
                  >

                    {/* PATIENT ICON */}

                    <div className="patient-icon">
                      <User size={25} />
                    </div>

                    {/* PATIENT DETAILS */}

                    <div className="patient-info">

                      <div className="patient-header">

                        <div>

                          <h3>
                            {appointment.patient?.name ||
                              "Patient"}
                          </h3>

                          <p>
                            {appointment.patient?.email ||
                              "Patient information"}
                          </p>

                        </div>

                        <span
                          className={`appointment-status ${appointment.status}`}
                        >
                          {appointment.status}
                        </span>

                      </div>

                      {/* DATE + TIME */}

                      <div className="patient-details">

                        <span>
                          <CalendarDays
                            size={16}
                          />
                          {appointment.date}
                        </span>

                        <span>
                          <Clock size={16} />
                          {appointment.time}
                        </span>

                      </div>

                      {/* REASON */}

                      {appointment.reason && (
                        <div className="patient-reason">

                          <strong>
                            Reason for visit:
                          </strong>

                          <p>
                            {appointment.reason}
                          </p>

                        </div>
                      )}

                      {/* PENDING ACTIONS */}

                      {appointment.status ===
                        "pending" && (

                        <div className="appointment-actions">

                          <button
                            className="confirm-btn"
                            disabled={
                              updating ===
                              appointment._id
                            }
                            onClick={() =>
                              updateStatus(
                                appointment._id,
                                "confirmed"
                              )
                            }
                          >
                            <CheckCircle
                              size={17}
                            />
                            Confirm
                          </button>

                          <button
                            className="cancel-btn"
                            disabled={
                              updating ===
                              appointment._id
                            }
                            onClick={() =>
                              updateStatus(
                                appointment._id,
                                "cancelled"
                              )
                            }
                          >
                            <XCircle size={17} />
                            Cancel
                          </button>

                        </div>

                      )}

                      {/* CONFIRMED ACTION */}

                      {appointment.status ===
                        "confirmed" && (

                        <button
                          className="complete-btn"
                          disabled={
                            updating ===
                            appointment._id
                          }
                          onClick={() =>
                            updateStatus(
                              appointment._id,
                              "completed"
                            )
                          }
                        >
                          <CheckCircle
                            size={17}
                          />
                          Mark Completed
                        </button>

                      )}

                      {/* COMPLETED ACTION */}

                      {appointment.status ===
                        "completed" && (

                        <button
                          className="archive-btn"
                          disabled={
                            updating ===
                            appointment._id
                          }
                          onClick={() =>
                            archiveAppointment(
                              appointment._id
                            )
                          }
                        >

                          {updating ===
                          appointment._id ? (
                            <>
                              <Loader2
                                className="spin"
                                size={17}
                              />
                              Removing...
                            </>
                          ) : (
                            <>
                              <XCircle
                                size={17}
                              />
                              Remove from View
                            </>
                          )}

                        </button>

                      )}

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </section>

        {/* =========================================
            COMPLETED HISTORY
        ========================================= */}

        {showHistory && (

          <section className="completed-history-section">

            <div className="completed-history-header">

              <div>
                <h2>
                  Completed History
                </h2>

                <p>
                  Previously completed appointments
                  removed from your main view.
                </p>
              </div>

              <button
                className="history-close-btn"
                onClick={() =>
                  setShowHistory(false)
                }
              >
                Close
              </button>

            </div>

            {archivedAppointments.length ===
            0 ? (

              <div className="completed-history-empty">

                <CalendarDays size={42} />

                <h3>
                  No completed history
                </h3>

                <p>
                  Removed completed appointments
                  will appear here.
                </p>

              </div>

            ) : (

              <div className="doctor-appointment-list">

                {archivedAppointments.map(
                  (appointment) => (

                    <div
                      className="doctor-appointment-card archived-card"
                      key={appointment._id}
                    >

                      <div className="patient-icon">
                        <User size={25} />
                      </div>

                      <div className="patient-info">

                        <div className="patient-header">

                          <div>

                            <h3>
                              {appointment.patient?.name ||
                                "Patient"}
                            </h3>

                            <p>
                              {appointment.patient?.email ||
                                "Patient information"}
                            </p>

                          </div>

                          <span className="appointment-status completed">
                            Completed
                          </span>

                        </div>

                        <div className="patient-details">

                          <span>
                            <CalendarDays
                              size={16}
                            />
                            {appointment.date}
                          </span>

                          <span>
                            <Clock size={16} />
                            {appointment.time}
                          </span>

                        </div>

                        {appointment.reason && (
                          <div className="patient-reason">

                            <strong>
                              Reason for visit:
                            </strong>

                            <p>
                              {appointment.reason}
                            </p>

                          </div>
                        )}

                        <div className="archived-label">
                          ✓ Stored in appointment history
                        </div>

                      </div>

                    </div>

                  )
                )}

              </div>

            )}

          </section>

        )}

      </main>

    </div>
  );
}

export default DoctorDashboard;