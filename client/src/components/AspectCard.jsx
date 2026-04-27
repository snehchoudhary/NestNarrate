// export default function AspectCard({ label, score }) {

//   const getColor = (score) => {
//     if (score >= 4) return "text-green-600";
//     if (score >= 3) return "text-yellow-500";
//     return "text-red-500";
//   };

//   return (
//     <div className="bg-white p-4 rounded-xl shadow text-center">
//       <h3 className="font-semibold">{label}</h3>

//       <p className={`text-2xl ${getColor(score)}`}>
//         {score !== undefined ? score.toFixed(1) : "N/A"}
//       </p>
//     </div>
//   );
// }

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');

  .ac-card {
    font-family: 'DM Sans', sans-serif;
    background: rgba(13,15,22,0.82);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 14px;
    padding: 1.25rem 1rem 1.1rem;
    backdrop-filter: blur(20px);
    box-shadow: 0 0 0 1px rgba(255,255,255,0.03) inset, 0 12px 36px rgba(0,0,0,0.35);
    transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    gap: 0.65rem;
  }

  .ac-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    border-radius: 14px 14px 0 0;
    opacity: 0;
    transition: opacity 0.3s;
  }

  .ac-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 0 1px rgba(255,255,255,0.05) inset, 0 20px 50px rgba(0,0,0,0.45);
  }

  .ac-card:hover::before { opacity: 1; }

  /* Color variants */
  .ac-card.great  { border-color: rgba(20,184,150,0.25); }
  .ac-card.good   { border-color: rgba(59,130,246,0.22); }
  .ac-card.fair   { border-color: rgba(245,158,11,0.22); }
  .ac-card.poor   { border-color: rgba(239,68,68,0.22);  }

  .ac-card.great:hover { border-color: rgba(20,184,150,0.45); }
  .ac-card.good:hover  { border-color: rgba(59,130,246,0.42); }
  .ac-card.fair:hover  { border-color: rgba(245,158,11,0.42); }
  .ac-card.poor:hover  { border-color: rgba(239,68,68,0.42);  }

  .ac-card.great::before { background: linear-gradient(90deg, #14b896, #34d9a5); }
  .ac-card.good::before  { background: linear-gradient(90deg, #3b82f6, #60a5fa); }
  .ac-card.fair::before  { background: linear-gradient(90deg, #f59e0b, #fbbf24); }
  .ac-card.poor::before  { background: linear-gradient(90deg, #ef4444, #f87171); }

  /* Label */
  .ac-label {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.7px;
    text-transform: uppercase;
    color: rgba(255,255,255,0.32);
    display: flex;
    align-items: center;
    gap: 7px;
  }

  .ac-label-icon {
    width: 22px;
    height: 22px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-size: 12px;
  }

  .ac-card.great .ac-label-icon { background: rgba(20,184,150,0.12);  color: #34d9a5; }
  .ac-card.good  .ac-label-icon { background: rgba(59,130,246,0.12);  color: #60a5fa; }
  .ac-card.fair  .ac-label-icon { background: rgba(245,158,11,0.12);  color: #fbbf24; }
  .ac-card.poor  .ac-label-icon { background: rgba(239,68,68,0.12);   color: #f87171; }

  /* Score */
  .ac-score-row {
    display: flex;
    align-items: flex-end;
    gap: 5px;
    line-height: 1;
  }

  .ac-score {
    font-family: 'Instrument Serif', serif;
    font-size: 2.1rem;
    font-weight: 400;
    letter-spacing: -1px;
    line-height: 1;
  }

  .ac-card.great .ac-score { color: #34d9a5; }
  .ac-card.good  .ac-score { color: #60a5fa; }
  .ac-card.fair  .ac-score { color: #fbbf24; }
  .ac-card.poor  .ac-score { color: #f87171; }

  .ac-score-denom {
    font-size: 12px;
    color: rgba(255,255,255,0.22);
    font-weight: 300;
    padding-bottom: 4px;
  }

  .ac-score-tag {
    margin-left: auto;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.4px;
    padding: 3px 8px;
    border-radius: 999px;
    align-self: center;
  }

  .ac-card.great .ac-score-tag { background: rgba(20,184,150,0.14);  color: #34d9a5; }
  .ac-card.good  .ac-score-tag { background: rgba(59,130,246,0.14);  color: #60a5fa; }
  .ac-card.fair  .ac-score-tag { background: rgba(245,158,11,0.14);  color: #fbbf24; }
  .ac-card.poor  .ac-score-tag { background: rgba(239,68,68,0.14);   color: #f87171; }

  /* Bar */
  .ac-bar-track {
    height: 4px;
    background: rgba(255,255,255,0.06);
    border-radius: 999px;
    overflow: hidden;
  }

  .ac-bar-fill {
    height: 100%;
    border-radius: 999px;
    transition: width 1s cubic-bezier(0.22,1,0.36,1);
  }

  .ac-card.great .ac-bar-fill { background: linear-gradient(90deg, #14b896, #34d9a5); }
  .ac-card.good  .ac-bar-fill { background: linear-gradient(90deg, #3b82f6, #60a5fa); }
  .ac-card.fair  .ac-bar-fill { background: linear-gradient(90deg, #f59e0b, #fbbf24); }
  .ac-card.poor  .ac-bar-fill { background: linear-gradient(90deg, #ef4444, #f87171); }
`;

/* ── aspect icons ── */
const ICONS = {
  wifi:        "📶",
  cleanliness: "✨",
  staff:       "👤",
  location:    "📍",
  noise:       "🔇",
  value:       "💎",
};

function getIcon(label = "") {
  return ICONS[label.toLowerCase()] || "⭐";
}

/* score is 0–1 (from HotelDetail aspectScores) OR 0–5 (legacy) */
function normalise(score) {
  if (score === undefined || score === null) return null;
  return score > 1 ? score / 5 : score; // treat >1 as 0–5 scale
}

function getTier(pct) {
  if (pct >= 0.75) return { key: "great", tag: "Excellent" };
  if (pct >= 0.50) return { key: "good",  tag: "Good"      };
  if (pct >= 0.25) return { key: "fair",  tag: "Fair"      };
  return                   { key: "poor",  tag: "Poor"      };
}

export default function AspectCard({ label, score }) {
  const pct = normalise(score);

  if (pct === null) {
    return (
      <>
        <style>{styles}</style>
        <div className="ac-card fair">
          <span className="ac-label">{label}</span>
          <div className="ac-score-row">
            <span className="ac-score" style={{ color: "rgba(255,255,255,0.2)", fontSize: "1.4rem" }}>N/A</span>
          </div>
          <div className="ac-bar-track" />
        </div>
      </>
    );
  }

  const { key, tag } = getTier(pct);
  const display      = (pct * 100).toFixed(0);

  return (
    <>
      <style>{styles}</style>
      <div className={`ac-card ${key}`}>

        {/* Label row */}
        <div className="ac-label">
          <span className="ac-label-icon">{getIcon(label)}</span>
          {label}
        </div>

        {/* Score row */}
        <div className="ac-score-row">
          <span className="ac-score">{display}</span>
          <span className="ac-score-denom">/ 100</span>
          <span className="ac-score-tag">{tag}</span>
        </div>

        {/* Bar */}
        <div className="ac-bar-track">
          <div className="ac-bar-fill" style={{ width: `${pct * 100}%` }} />
        </div>

      </div>
    </>
  );
}