import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Brain,
  Loader2,
  Send,
  Stethoscope,
  Lightbulb,
  ShieldAlert,
  ListChecks,
} from "lucide-react";

function AIHealthAssistant() {
  const navigate = useNavigate();

  const [concern, setConcern] = useState("");
  const [result, setResult] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!concern.trim()) {
      setError("Please describe your health concern.");
      return;
    }

    setLoading(true);
    setError("");
    setResult("");
    setSpecialist("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/ai/health-assistant",
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

      // Extract specialist from AI response
      const match = aiResult.match(
        /Suggested Specialist:\s*(?:-\s*)?([^\n\r]+)/i
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
  };

  // Format AI response into separate sections
  const formatAIResult = (text) => {
    const sections = [
      {
        title: "Suggested Specialist",
        icon: <Stethoscope size={21} />,
        className: "ai-section-specialist",
      },
      {
        title: "Why",
        icon: <Lightbulb size={21} />,
        className: "ai-section-why",
      },
      {
        title: "General Guidance",
        icon: <ListChecks size={21} />,
        className: "ai-section-guidance",
      },
      {
        title: "Urgent Warning",
        icon: <ShieldAlert size={21} />,
        className: "ai-section-warning",
      },
    ];

    return sections.map((section) => {
      const headingRegex = new RegExp(
        `${section.title}:?`,
        "i"
      );

      const match = headingRegex.exec(text);

      if (!match) return null;

      const start = match.index + match[0].length;

      const remainingText = text.slice(start);

      const nextHeadingRegex =
        /Suggested Specialist:|Why:|General Guidance:|Urgent Warning:|Important:/i;

      const nextMatch =
        nextHeadingRegex.exec(remainingText);

      const content = nextMatch
        ? remainingText.slice(0, nextMatch.index)
        : remainingText;

      const lines = content
        .split(/\r?\n/)
        .map((line) =>
          line
            .replace(/^\s*[-•]\s*/, "")
            .replace(/\*\*/g, "")
            .trim()
        )
        .filter(Boolean);

      return (
        <div
          key={section.title}
          className={`ai-section ${section.className}`}
        >
          <div className="ai-section-heading">
            <span className="ai-section-icon">
              {section.icon}
            </span>

            <h3>{section.title}</h3>
          </div>

          <div className="ai-section-body">
            {lines.map((line, index) => (
              <p key={index}>
                {section.title ===
                  "General Guidance" && (
                  <span className="ai-bullet">
                    •
                  </span>
                )}

                {line}
              </p>
            ))}
          </div>
        </div>
      );
    });
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

            {(concern || result) && !loading && (
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

        {/* AI RESULT */}
        {result && (
          <div className="ai-result">

            <div className="ai-result-title">
              <Stethoscope size={24} />

              <h2>
                AI Recommendation
              </h2>
            </div>

            <div className="ai-result-content">
              {formatAIResult(result)}
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