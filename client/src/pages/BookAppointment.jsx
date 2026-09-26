import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarPlus,
  Clock,
  Stethoscope,
  Loader2,
} from "lucide-react";

function BookAppointment() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const selectedDoctorId = searchParams.get("doctor");

  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);

  const [formData, setFormData] = useState({
    doctorId: selectedDoctorId || "",
    date: "",
    time: "",
    reason: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // FETCH DOCTORS
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/doctors"
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch doctors"
          );
        }

        setDoctors(data.doctors);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoadingDoctors(false);
      }
    };

    fetchDoctors();
  }, []);

  // HANDLE INPUT CHANGES
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
    setSuccess("");
  };

  // BOOK APPOINTMENT
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const user = JSON.parse(
      localStorage.getItem("user")
    );

    if (!user?.id) {
      setError("Please login again.");
      return;
    }

    if (!formData.doctorId) {
      setError("Please select a doctor.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/appointments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            patientId: user.id,
            doctorId: formData.doctorId,
            date: formData.date,
            time: formData.time,
            reason: formData.reason,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to book appointment"
        );
      }

      setSuccess(
        "Appointment booked successfully! 🎉"
      );

      setFormData({
        doctorId: "",
        date: "",
        time: "",
        reason: "",
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-page">

      {/* HEADER */}
      <div className="booking-header">

        <button
          className="back-btn"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>

        <div>
          <h1>Book an Appointment</h1>

          <p>
            Choose a doctor, date and time for your
            appointment.
          </p>
        </div>

      </div>

      {/* BOOKING CARD */}
      <div className="booking-card">

        <div className="booking-icon">
          <CalendarPlus size={30} />
        </div>

        <h2>
          Appointment Details
        </h2>

        <form
          className="booking-form"
          onSubmit={handleSubmit}
        >

          {/* DOCTOR */}
          <div className="form-group">

            <label>
              <Stethoscope size={17} />
              Select Doctor
            </label>

            {loadingDoctors ? (
              <div className="booking-loading">
                <Loader2
                  className="spin"
                  size={20}
                />
                Loading doctors...
              </div>
            ) : (
              <select
                name="doctorId"
                value={formData.doctorId}
                onChange={handleChange}
                required
              >
                <option value="">
                  Select a doctor
                </option>

                {doctors.map((doctor) => (
                  <option
                    key={doctor._id}
                    value={doctor._id}
                  >
                    {doctor.name} —{" "}
                    {doctor.specialization}
                  </option>
                ))}
              </select>
            )}

          </div>

          {/* DATE */}
          <div className="form-group">

            <label>
              <CalendarPlus size={17} />
              Appointment Date
            </label>

            <input
              type="date"
              name="date"
              value={formData.date}
              min={
                new Date()
                  .toISOString()
                  .split("T")[0]
              }
              onChange={handleChange}
              required
            />

          </div>

          {/* TIME */}
          <div className="form-group">

            <label>
              <Clock size={17} />
              Appointment Time
            </label>

            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
            />

          </div>

          {/* REASON */}
          <div className="form-group">

            <label>
              Reason for Visit
            </label>

            <textarea
              name="reason"
              placeholder="Briefly describe your reason for the appointment..."
              value={formData.reason}
              onChange={handleChange}
              rows="4"
            />

          </div>

          {/* ERROR */}
          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          {/* SUCCESS */}
          {success && (
            <div className="auth-success">
              {success}
            </div>
          )}

          {/* SUBMIT */}
          <button
            type="submit"
            className="auth-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2
                  className="spin"
                  size={20}
                />
                Booking...
              </>
            ) : (
              <>
                <CalendarPlus size={20} />
                Book Appointment
              </>
            )}
          </button>

        </form>

      </div>

    </div>
  );
}

export default BookAppointment;