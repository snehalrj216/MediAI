import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Brain,
  Loader2,
  Send,
  Stethoscope,
} from "lucide-react";

const crisisKeywords = [
  "suicide",
  "kill myself",
  "end my life",
  "self harm",
  "hurt myself",
  "want to die",
  "no reason to live",
  "cant go on",
  "can't go on",
];

function AIHealthAssistant() {
  const navigate = useNavigate();

  const [concern, setConcern] = useState("");
  const [result, setResult] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isCrisis, setIsCrisis] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!concern.trim()) {
      setError("Please describe your health concern.");
      return;
    }

    const lowerConcern = concern.toLowerCase();
    const crisisDetected = crisisKeywords.some((word) =>
      lowerConcern.includes(word)
    );

    if (crisisDetected) {
      setIsCrisis(true);
      setResult("");
      setSpecialist("");
      setError("");
      return;
    }

    setIsCrisis(false);
    setLoading(true);
    setError("");
    setResult("");
    setSpecialist("");

    try {
      const response = await fetch(
        "https://mediai-vs5s.onrender.com/api/ai/health-assistant",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            concern: concern.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "AI assistant failed"
        );
      }

      const aiResult = data.result || "";

      setResult(aiResult);

      // Extract doctor/specialist
      const match = aiResult.match(
        /Doctor:\s*(?:-\s*)?([^\n\r]+)/
      );

      if (match) {
        const extractedSpecialist = match[1]
          .replace(/\(.*?\)/g, "")
          .replace(/[*#]/g, "")
          .trim();

        if (extractedSpecialist) {
          setSpecialist(extractedSpecialist);
        }
      }
    } catch (error) {
      console.error("AI Assistant Error:", error);

      setError(
        error.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFindDoctor = () => {
    if (!specialist) return;

    navigate(
      `/doctors?specialization=${encodeURIComponent(
        specialist
      )}`
    );
  };

  const handleClear = () => {
    setConcern("");
    setResult("");
    setSpecialist("");
    setError("");
    setIsCrisis(false);
  };

  return (
    <div className="ai-page">

      {/* HEADER */}
      <div className="ai-header">

        <button
          className="back-btn"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>

        <div>
          <h1>AI Health Assistant</h1>

          <p>
            Describe your concern and get a suggested
            doctor specialization.
          </p>
        </div>

      </div>

      {/* AI CARD */}
      <div className="ai-card">

        <div className="ai-icon">
          <Brain size={32} />
        </div>

        <h2>How can I help?</h2>

        <p className="ai-description">
          Tell me about your health concern. I can
          suggest which type of doctor may be relevant.
        </p>

        {/* INPUT FORM */}
        <form
          className="ai-form"
          onSubmit={handleSubmit}
        >

          <textarea
            value={concern}
            onChange={(e) => {
              setConcern(e.target.value);
              setError("");
            }}
            placeholder="Example: I have frequent headaches and sometimes feel dizzy..."
            rows={6}
            disabled={loading}
          />

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <div className="ai-form-actions">

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
                  AI is analyzing...
                </>
              ) : (
                <>
                  <Send size={19} />
                  Ask AI
                </>
              )}
            </button>

            {(concern || result || isCrisis) && !loading && (
              <button
                type="button"
                className="secondary-btn"
                onClick={handleClear}
              >
                Clear
              </button>
            )}

          </div>

        </form>

        {/* CRISIS ALERT */}
        {isCrisis && (
          <div className="ai-crisis-alert">
            <h2>You're not alone — help is available right now</h2>

            <p>
              If you are in immediate danger, please call{" "}
              <strong>112</strong> (Emergency) right away.
            </p>

            <ul>
              <li>
                <strong>AASRA:</strong> 91-9820466726 (24/7)
              </li>
              <li>
                <strong>iCall:</strong> 9152987821
              </li>
              <li>
                <strong>Kiran Mental Health Helpline:</strong>{" "}
                1800-599-0019 (Govt of India, 24/7)
              </li>
            </ul>

            <p>
              Please reach out to someone you trust, or contact
              one of these services. You deserve support, and
              people are ready to help.
            </p>
          </div>
        )}

        {/* AI RESULT */}
        {result && (
          <div className="ai-result">

            <div className="ai-result-title">
              <Stethoscope size={24} />

              <h2>
                AI Recommendation
              </h2>
            </div>

            {/* DIRECTLY DISPLAY AI RESPONSE */}
            <div className="ai-result-content">
              {result
                .split("\n")
                .filter((line) => line.trim() !== "")
                .map((line, index) => (
                  <p key={index}>
                    {line}
                  </p>
                ))}
            </div>

            {/* DISCLAIMER */}
            <div className="ai-disclaimer">
              <strong>Important:</strong>{" "}
              This AI assistant provides general
              guidance and does not provide a medical
              diagnosis. Please consult a qualified
              healthcare professional for medical advice.
            </div>

            {/* FIND DOCTOR */}
            {specialist && (
              <button
                className="book-doctor-btn"
                onClick={handleFindDoctor}
              >
                <Stethoscope size={18} />
                Find {specialist}
              </button>
            )}

          </div>
        )}

      </div>

    </div>
  );
}

export default AIHealthAssistant;