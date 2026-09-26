import { useEffect, useState } from "react";
import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import {
  ArrowLeft,
  Search,
  Stethoscope,
  Clock,
  CalendarPlus,
  Loader2,
} from "lucide-react";

function Doctors() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const specializationFilter =
    searchParams.get("specialization") || "";

  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Search + AI specialization filter
  const filteredDoctors = doctors.filter((doctor) => {
    const searchText = search.toLowerCase();

    const searchMatch =
      doctor.name
        .toLowerCase()
        .includes(searchText) ||
      doctor.specialization
        .toLowerCase()
        .includes(searchText);

    const specializationMatch =
      !specializationFilter ||
      doctor.specialization
        .toLowerCase()
        .includes(
          specializationFilter.toLowerCase()
        );

    return (
      searchMatch &&
      specializationMatch
    );
  });

  return (
    <div className="doctors-page">

      {/* HEADER */}
      <div className="doctors-header">

        <button
          className="back-btn"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>

        <div>
          <h1>Find a Doctor</h1>

          <p>
            Find the right doctor for your healthcare needs.
          </p>
        </div>

      </div>

      {/* AI FILTER MESSAGE */}
      {specializationFilter && (
        <div className="ai-filter-message">
          <Stethoscope size={18} />

          Showing doctors matching:

          <strong>
            {specializationFilter}
          </strong>

          <button
            onClick={() => navigate("/doctors")}
          >
            Clear
          </button>
        </div>
      )}

      {/* SEARCH */}
      <div className="doctor-search">

        <Search size={20} />

        <input
          type="text"
          placeholder="Search by doctor name or specialization..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="doctor-loading">

          <Loader2
            className="spin"
            size={30}
          />

          <p>
            Loading doctors...
          </p>

        </div>
      ) : error ? (
        <div className="doctor-error">
          {error}
        </div>
      ) : filteredDoctors.length === 0 ? (
        <div className="no-doctors">

          <Stethoscope size={40} />

          <h3>
            No doctors found
          </h3>

          <p>
            Try searching for another doctor
            or specialization.
          </p>

        </div>
      ) : (
        <div className="doctors-grid">

          {filteredDoctors.map((doctor) => (
            <div
              className="doctor-card"
              key={doctor._id}
            >

              {/* DOCTOR ICON */}
              <div className="doctor-avatar">
                <Stethoscope size={30} />
              </div>

              {/* DOCTOR INFO */}
              <div className="doctor-info">

                <div className="doctor-name-row">

                  <h2>
                    {doctor.name}
                  </h2>

                  <span className="available-badge">
                    Available
                  </span>

                </div>

                <p className="doctor-specialization">
                  {doctor.specialization}
                </p>

                <div className="doctor-details">

                  <span>
                    <Clock size={16} />
                    {doctor.experience} years experience
                  </span>

                  <span>
                    <Stethoscope size={16} />
                    {doctor.specialization}
                  </span>

                </div>

                <button
                  className="book-doctor-btn"
                  onClick={() =>
                    navigate(
                      `/book-appointment?doctor=${doctor._id}`
                    )
                  }
                >
                  <CalendarPlus size={18} />
                  Book Appointment
                </button>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default Doctors;