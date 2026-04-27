// import { useNavigate } from "react-router-dom";
// import API from "../services/api";
// import toast from "react-hot-toast";

// export default function HotelCard({ review }) {
//   const navigate = useNavigate();

//   const saveHotel = async (hotelId) => {
//     try {
//       await API.post(`/user/wishlist/${hotelId}`);
//       toast.success("Added to wishlist ❤️")
//     } catch (err) {
//       console.error(err);
//       toast.error("Login required");
//     }
//   };

//   return (
//     <div
//       className="bg-white p-4 rounded-xl shadow hover:Shadow-lg transition cursor-pointer"
//       onClick={() => navigate(`/hotel/${review.hotelId}`)}
//     >
//       <h3 className="font-bold">{review.reviewerName}</h3>

//       <p>{review.text}</p>

//       <p className="text-sm text-gray-500">
//         Score: {review.score ? review.score.toFixed(2) : "N/A"}
//       </p>

//       <button
//         onClick={(e) => {
//           e.stopPropagation();
//           saveHotel(review.hotelId);
//         }}
//         className="mt-2 text-red-500"
//       >
//         ❤️ Save
//       </button>
//     </div>
//   );
// }


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";

/* ─────────────────────────────────────────────
   STYLES
───────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');

  .hc-card {
    font-family: 'DM Sans', sans-serif;
    background: rgba(13,15,22,0.82);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 16px;
    padding: 1.25rem 1.5rem;
    backdrop-filter: blur(20px);
    box-shadow: 0 0 0 1px rgba(255,255,255,0.03) inset, 0 12px 36px rgba(0,0,0,0.3);
    cursor: pointer;
    transition: border-color 0.22s, transform 0.2s, box-shadow 0.22s;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: flex-start;
    gap: 1rem;
  }

  .hc-card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(99,66,255,0.04) 0%, transparent 60%);
    opacity: 0;
    transition: opacity 0.25s;
    pointer-events: none;
  }

  .hc-card:hover {
    border-color: rgba(99,66,255,0.28);
    transform: translateY(-2px);
    box-shadow: 0 0 0 1px rgba(255,255,255,0.05) inset, 0 20px 56px rgba(0,0,0,0.45);
  }

  .hc-card:hover::before { opacity: 1; }
  .hc-card:active { transform: translateY(0); }

  /* ── Avatar ── */
  .hc-avatar {
    width: 46px;
    height: 46px;
    border-radius: 12px;
    background: linear-gradient(135deg, #6342ff 0%, #4a7bff 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Instrument Serif', serif;
    font-size: 1.2rem;
    color: #fff;
    flex-shrink: 0;
    box-shadow: 0 4px 14px rgba(99,66,255,0.3);
    user-select: none;
    transition: box-shadow 0.2s;
  }

  .hc-card:hover .hc-avatar {
    box-shadow: 0 6px 20px rgba(99,66,255,0.45);
  }

  /* ── Body ── */
  .hc-body {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  .hc-top-row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 0.75rem;
  }

  .hc-name {
    font-family: 'Instrument Serif', serif;
    font-size: 1.05rem;
    font-weight: 400;
    color: #fff;
    letter-spacing: -0.2px;
    line-height: 1.2;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .hc-score-pill {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 3px 10px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 600;
    flex-shrink: 0;
    letter-spacing: 0.2px;
  }

  .hc-score-great { background: rgba(20,184,150,0.14);  border: 1px solid rgba(20,184,150,0.3);  color: #34d9a5; }
  .hc-score-good  { background: rgba(59,130,246,0.14);  border: 1px solid rgba(59,130,246,0.28); color: #60a5fa; }
  .hc-score-fair  { background: rgba(245,158,11,0.14);  border: 1px solid rgba(245,158,11,0.28); color: #fbbf24; }
  .hc-score-poor  { background: rgba(239,68,68,0.14);   border: 1px solid rgba(239,68,68,0.26);  color: #f87171; }
  .hc-score-na    { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.3); }

  /* ── Review text ── */
  .hc-text {
    font-size: 13.5px;
    color: rgba(255,255,255,0.48);
    font-weight: 300;
    line-height: 1.6;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  /* ── Footer row ── */
  .hc-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    margin-top: 0.25rem;
    flex-wrap: wrap;
  }

  .hc-meta {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .hc-meta-item {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 11.5px;
    color: rgba(255,255,255,0.25);
    font-weight: 400;
  }

  .hc-meta-dot {
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: rgba(255,255,255,0.15);
  }

  /* ── Wishlist button ── */
  .hc-save-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 13px;
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.09);
    background: rgba(255,255,255,0.04);
    font-size: 12px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 500;
    color: rgba(255,255,255,0.45);
    cursor: pointer;
    transition: all 0.2s;
    flex-shrink: 0;
  }

  .hc-save-btn:hover {
    background: rgba(239,68,68,0.1);
    border-color: rgba(239,68,68,0.3);
    color: #f87171;
  }

  .hc-save-btn.saved {
    background: rgba(239,68,68,0.12);
    border-color: rgba(239,68,68,0.35);
    color: #f87171;
  }

  .hc-save-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .hc-heart {
    transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1);
  }

  .hc-save-btn:hover .hc-heart,
  .hc-save-btn.saved .hc-heart {
    transform: scale(1.25);
  }

  /* ── Arrow hint ── */
  .hc-arrow {
    position: absolute;
    right: 1.25rem;
    top: 50%;
    transform: translateY(-50%) translateX(4px);
    color: rgba(255,255,255,0.12);
    opacity: 0;
    transition: opacity 0.2s, transform 0.2s;
    pointer-events: none;
  }

  .hc-card:hover .hc-arrow {
    opacity: 1;
    transform: translateY(-50%) translateX(0);
  }
`;

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
function getInitial(name = "") {
  return name.trim().charAt(0).toUpperCase() || "?";
}

function getScoreMeta(score) {
  if (score === undefined || score === null) return { label: "N/A", cls: "hc-score-na" };
  const pct = score > 1 ? score / 5 : score;
  if (pct >= 0.75) return { label: `${(pct * 100).toFixed(0)}`, cls: "hc-score-great" };
  if (pct >= 0.50) return { label: `${(pct * 100).toFixed(0)}`, cls: "hc-score-good"  };
  if (pct >= 0.25) return { label: `${(pct * 100).toFixed(0)}`, cls: "hc-score-fair"  };
  return               { label: `${(pct * 100).toFixed(0)}`, cls: "hc-score-poor"  };
}

function timeAgo(dateStr) {
  if (!dateStr) return null;
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days < 1)   return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30)  return `${days}d ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

/* ─────────────────────────────────────────────
   ICONS
───────────────────────────────────────────── */
const HeartIcon = ({ filled }) => (
  <svg
    className="hc-heart"
    width="13" height="13"
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

const StarIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.5 }}>
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
);

const CalIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4 }}>
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);

const SpinIcon = () => (
  <div style={{
    width: 11, height: 11,
    border: "1.5px solid rgba(239,68,68,0.3)",
    borderTopColor: "#f87171",
    borderRadius: "50%",
    animation: "hcSpin 0.65s linear infinite",
    display: "inline-block",
  }} />
);

/* ─────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────── */
export default function HotelCard({ review }) {
  const navigate          = useNavigate();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const { label: scoreLabel, cls: scoreCls } = getScoreMeta(review?.score);
  const ago = timeAgo(review?.reviewDate || review?.createdAt);

  const saveHotel = async (e) => {
    e.stopPropagation();
    if (saved || saving) return;
    setSaving(true);
    try {
      await API.post(`/user/wishlist/${review.hotelId}`);
      setSaved(true);
      toast.success("Added to wishlist");
    } catch (err) {
      console.error(err);
      toast.error("Login required");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <style>{`
        ${styles}
        @keyframes hcSpin { to { transform: rotate(360deg); } }
      `}</style>

      <div
        className="hc-card"
        onClick={() => navigate(`/hotel/${review?.hotelId}`)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && navigate(`/hotel/${review?.hotelId}`)}
        aria-label={`View details for ${review?.reviewerName}`}
      >
        {/* Avatar */}
        <div className="hc-avatar">
          {getInitial(review?.reviewerName)}
        </div>

        {/* Body */}
        <div className="hc-body">
          <div className="hc-top-row">
            <span className="hc-name">
              {review?.reviewerName || "Anonymous"}
            </span>
            <span className={`hc-score-pill ${scoreCls}`}>
              <StarIcon />
              {scoreLabel}
            </span>
          </div>

          {review?.text && (
            <p className="hc-text">{review.text}</p>
          )}

          <div className="hc-footer">
            <div className="hc-meta">
              {ago && (
                <span className="hc-meta-item">
                  <CalIcon /> {ago}
                </span>
              )}
              {review?.hotelName && (
                <>
                  <span className="hc-meta-dot" />
                  <span className="hc-meta-item">{review.hotelName}</span>
                </>
              )}
            </div>

            <button
              className={`hc-save-btn ${saved ? "saved" : ""}`}
              onClick={saveHotel}
              disabled={saving}
              aria-label={saved ? "Saved to wishlist" : "Save to wishlist"}
            >
              {saving ? <SpinIcon /> : <HeartIcon filled={saved} />}
              {saved ? "Saved" : "Save"}
            </button>
          </div>
        </div>

        {/* Arrow hint */}
        <div className="hc-arrow"><ArrowIcon /></div>
      </div>
    </>
  );
}