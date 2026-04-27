// import { useParams } from "react-router-dom";
// import { useEffect, useState } from "react";
// import API from "../services/api";
// import ReviewList from "../components/ReviewList";
// import ReviewForm from "../components/ReviewForm";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";
// import AspectCard from "../components/AspectCard";

// export default function HotelDetail() {
//   const { id } = useParams();

//   const [hotel, setHotel] = useState(null);
//   const [reviews, setReviews] = useState([]);
//   const [aspectScores, setAspectScores] = useState({});
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchHotel = async () => {
//       try {
//         const res = await API.get(`/hotels/${id}`);

//         setHotel(res.data);
//         setReviews(res.data.reviews || []);
//         setAspectScores(res.data.aspectScores || {});
//       } catch (err) {
//         console.error("Error fetching hotel:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchHotel();
//   }, [id]);

//   // Add newly submitted review instantly
//   const handleReviewAdded = (newReview) => {
//     setReviews((prev) => [newReview, ...prev]);
//   };

//   const chartData = reviews.map((r) => ({
//     date: r.reviewDate
//       ? new Date(r.reviewDate).toLocaleDateString()
//       : "N/A",
//     sentiment:
//       typeof r.sentiment === "number"
//         ? r.sentiment
//         : r.rating
//         ? r.rating / 5
//         : 0,
//   }));

//   if (loading) {
//     return (
//       <div className="p-6 animate-pulse space-y-4">
//         <div className="h-6 bg-gray-300 rounded w-1/3"></div>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <div className="h-20 bg-gray-300 rounded"></div>
//           <div className="h-20 bg-gray-300 rounded"></div>
//           <div className="h-20 bg-gray-300 rounded"></div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 max-w-6xl mx-auto">
//       <h1 className="text-3xl font-bold mb-6">
//         {hotel?.name || "Hotel Details"}
//       </h1>

//       {/* Review Submission Form */}
//       <ReviewForm
//         hotelId={id}
//         onReviewAdded={handleReviewAdded}
//       />

//       {/* Aspect Analysis */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
//         {Object.keys(aspectScores).length === 0 ? (
//           <p className="text-gray-500">
//             No aspect analysis available yet.
//           </p>
//         ) : (
//           Object.entries(aspectScores).map(([key, value]) => (
//             <AspectCard
//               key={key}
//               label={key}
//               score={Number(value)}
//             />
//           ))
//         )}
//       </div>

//       {/* Sentiment Trend */}
//       <div className="bg-white rounded-xl shadow-md p-4 mb-8">
//         <h2 className="text-xl font-semibold mb-4">
//           Sentiment Trend
//         </h2>

//         <div className="w-full h-[300px]">
//           <ResponsiveContainer width="100%" height="100%">
//             <LineChart data={chartData}>
//               <XAxis dataKey="date" />
//               <YAxis domain={[0, 1]} />
//               <Tooltip />
//               <Line
//                 type="monotone"
//                 dataKey="sentiment"
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//       {/* Reviews */}
//       <div className="mt-8">
//         <h2 className="text-2xl font-bold mb-4">
//           Customer Reviews ({reviews.length})
//         </h2>

//         <ReviewList reviews={reviews} />
//       </div>
//     </div>
//   );
// }

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";
import ReviewList from "../components/ReviewList";
import ReviewForm from "../components/ReviewForm";
import AspectCard from "../components/AspectCard";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

/* ─────────────────────────────────────────────
   STYLES
───────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');

  .hd-root {
    min-height: 100vh;
    background: #080a0f;
    font-family: 'DM Sans', sans-serif;
    color: rgba(255,255,255,0.88);
    position: relative;
    overflow-x: hidden;
  }

  /* Ambient background glows */
  .hd-root::before {
    content: '';
    position: fixed;
    inset: 0;
    background:
      radial-gradient(ellipse 60% 35% at 75% 5%,  rgba(99,66,255,0.10) 0%, transparent 65%),
      radial-gradient(ellipse 45% 30% at 10% 70%, rgba(20,184,150,0.07) 0%, transparent 60%),
      radial-gradient(ellipse 50% 40% at 50% 95%, rgba(59,130,246,0.06) 0%, transparent 65%);
    pointer-events: none;
    z-index: 0;
  }

  .hd-root::after {
    content: '';
    position: fixed;
    inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.016) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.016) 1px, transparent 1px);
    background-size: 60px 60px;
    pointer-events: none;
    z-index: 0;
  }

  .hd-inner {
    position: relative;
    z-index: 1;
    max-width: 1100px;
    margin: 0 auto;
    padding: 2.5rem 1.5rem 5rem;
  }

  /* ── Hero Header ── */
  .hd-header {
    margin-bottom: 2.5rem;
    animation: fadeSlideUp 0.5s cubic-bezier(0.22,1,0.36,1) both;
  }

  .hd-breadcrumb {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: rgba(255,255,255,0.28);
    margin-bottom: 1rem;
    letter-spacing: 0.3px;
  }

  .hd-breadcrumb span { cursor: pointer; transition: color 0.2s; }
  .hd-breadcrumb span:hover { color: rgba(255,255,255,0.6); }
  .hd-breadcrumb-sep { opacity: 0.3; }

  .hd-title-row {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .hd-title {
    font-family: 'Instrument Serif', serif;
    font-size: clamp(2rem, 4vw, 2.8rem);
    font-weight: 400;
    color: #fff;
    margin: 0;
    letter-spacing: -0.5px;
    line-height: 1.15;
  }

  .hd-title em {
    font-style: italic;
    background: linear-gradient(90deg, #a78bfa, #60a5fa);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .hd-badge-row {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .hd-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 5px 12px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 500;
    border: 1px solid;
  }

  .hd-badge-purple {
    background: rgba(99,66,255,0.12);
    border-color: rgba(99,66,255,0.3);
    color: #a78bfa;
  }

  .hd-badge-teal {
    background: rgba(20,184,150,0.1);
    border-color: rgba(20,184,150,0.28);
    color: #34d9a5;
  }

  .hd-divider {
    width: 100%;
    height: 1px;
    background: rgba(255,255,255,0.07);
    margin: 2rem 0;
  }

  /* ── Section titles ── */
  .hd-section-title {
    font-family: 'Instrument Serif', serif;
    font-size: 1.35rem;
    font-weight: 400;
    color: #fff;
    margin: 0 0 1.25rem;
    letter-spacing: -0.3px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .hd-section-title::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(255,255,255,0.06);
  }

  /* ── Cards / panels ── */
  .hd-panel {
    background: rgba(13,15,22,0.82);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 16px;
    padding: 1.75rem;
    backdrop-filter: blur(20px);
    box-shadow: 0 0 0 1px rgba(255,255,255,0.03) inset, 0 20px 60px rgba(0,0,0,0.4);
  }

  /* ── Aspect grid ── */
  .hd-aspects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 14px;
    margin-bottom: 2.5rem;
  }

  .hd-aspect-card {
    background: rgba(13,15,22,0.82);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 14px;
    padding: 1.25rem 1rem;
    backdrop-filter: blur(20px);
    box-shadow: 0 0 0 1px rgba(255,255,255,0.03) inset;
    transition: border-color 0.2s, transform 0.2s;
    animation: fadeSlideUp 0.5s cubic-bezier(0.22,1,0.36,1) both;
  }

  .hd-aspect-card:hover {
    border-color: rgba(99,66,255,0.25);
    transform: translateY(-2px);
  }

  .hd-aspect-label {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.7px;
    text-transform: uppercase;
    color: rgba(255,255,255,0.35);
    margin-bottom: 0.6rem;
  }

  .hd-aspect-score {
    font-family: 'Instrument Serif', serif;
    font-size: 2rem;
    font-weight: 400;
    color: #fff;
    line-height: 1;
    margin-bottom: 0.75rem;
  }

  .hd-aspect-score span {
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    color: rgba(255,255,255,0.3);
    font-weight: 300;
    margin-left: 2px;
  }

  .hd-aspect-bar-track {
    height: 4px;
    background: rgba(255,255,255,0.07);
    border-radius: 999px;
    overflow: hidden;
  }

  .hd-aspect-bar-fill {
    height: 100%;
    border-radius: 999px;
    transition: width 1s cubic-bezier(0.22,1,0.36,1);
  }

  /* ── Chart ── */
  .hd-chart-wrap {
    margin-bottom: 2.5rem;
    animation: fadeSlideUp 0.55s cubic-bezier(0.22,1,0.36,1) 0.1s both;
  }

  .hd-chart-inner {
    width: 100%;
    height: 280px;
  }

  /* Recharts custom tooltip */
  .hd-tooltip {
    background: rgba(13,15,22,0.95);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px;
    padding: 10px 14px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    color: rgba(255,255,255,0.8);
    box-shadow: 0 8px 32px rgba(0,0,0,0.5);
  }

  .hd-tooltip-label {
    font-size: 11px;
    color: rgba(255,255,255,0.35);
    margin-bottom: 4px;
    letter-spacing: 0.3px;
  }

  .hd-tooltip-val {
    font-family: 'Instrument Serif', serif;
    font-size: 1.25rem;
    color: #a78bfa;
  }

  /* ── Review form wrap ── */
  .hd-form-wrap {
    margin-bottom: 2.5rem;
    animation: fadeSlideUp 0.5s cubic-bezier(0.22,1,0.36,1) 0.05s both;
  }

  /* ── Reviews section ── */
  .hd-reviews-wrap {
    animation: fadeSlideUp 0.5s cubic-bezier(0.22,1,0.36,1) 0.15s both;
  }

  .hd-review-count {
    font-size: 13px;
    color: rgba(255,255,255,0.3);
    font-weight: 300;
    margin-left: 4px;
  }

  /* ── Empty state ── */
  .hd-empty {
    text-align: center;
    padding: 2.5rem 1rem;
    color: rgba(255,255,255,0.25);
    font-size: 14px;
    font-weight: 300;
  }

  /* ── Loading skeleton ── */
  .hd-skeleton {
    min-height: 100vh;
    background: #080a0f;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding: 2.5rem 1.5rem;
    max-width: 1100px;
    margin: 0 auto;
  }

  .hd-skel-block {
    border-radius: 14px;
    background: linear-gradient(90deg,
      rgba(255,255,255,0.04) 25%,
      rgba(255,255,255,0.08) 50%,
      rgba(255,255,255,0.04) 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
  }

  @keyframes shimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* Responsive */
  @media (max-width: 640px) {
    .hd-title-row { flex-direction: column; align-items: flex-start; }
    .hd-aspects-grid { grid-template-columns: repeat(2, 1fr); }
  }
`;

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
function scoreColor(score) {
  if (score >= 0.75) return "linear-gradient(90deg, #14b896, #34d9a5)";
  if (score >= 0.5)  return "linear-gradient(90deg, #3b8bff, #60a5fa)";
  if (score >= 0.25) return "linear-gradient(90deg, #f59e0b, #fbbf24)";
  return "linear-gradient(90deg, #ef4444, #f87171)";
}

/* Custom recharts tooltip */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="hd-tooltip">
      <div className="hd-tooltip-label">{label}</div>
      <div className="hd-tooltip-val">
        {(payload[0].value * 100).toFixed(0)}
        <span style={{ fontSize: 13, fontFamily: "'DM Sans',sans-serif", color: "rgba(255,255,255,0.4)" }}>%</span>
      </div>
    </div>
  );
};

/* Inline aspect card so we keep all styles self-contained */
function AspectCardStyled({ label, score }) {
  const pct = Math.min(Math.max(score, 0), 1);
  return (
    <div className="hd-aspect-card">
      <div className="hd-aspect-label">{label}</div>
      <div className="hd-aspect-score">
        {(pct * 100).toFixed(0)}<span>/ 100</span>
      </div>
      <div className="hd-aspect-bar-track">
        <div
          className="hd-aspect-bar-fill"
          style={{ width: `${pct * 100}%`, background: scoreColor(pct) }}
        />
      </div>
    </div>
  );
}

/* Star icon */
const StarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
);

const MapPinIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function HotelDetail() {
  const { id } = useParams();

  const [hotel, setHotel]               = useState(null);
  const [reviews, setReviews]           = useState([]);
  const [aspectScores, setAspectScores] = useState({});
  const [loading, setLoading]           = useState(true);

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const res = await API.get(`/hotels/${id}`);
        setHotel(res.data);
        setReviews(res.data.reviews || []);
        setAspectScores(res.data.aspectScores || {});
      } catch (err) {
        console.error("Error fetching hotel:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHotel();
  }, [id]);

  const handleReviewAdded = (newReview) => {
    setReviews((prev) => [newReview, ...prev]);
  };

  const chartData = reviews.map((r) => ({
    date: r.reviewDate ? new Date(r.reviewDate).toLocaleDateString() : "N/A",
    sentiment:
      typeof r.sentiment === "number"
        ? r.sentiment
        : r.rating
        ? r.rating / 5
        : 0,
  }));

  /* Average sentiment */
  const avgSentiment =
    chartData.length > 0
      ? chartData.reduce((s, d) => s + d.sentiment, 0) / chartData.length
      : null;

  /* ── Loading ── */
  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <div className="hd-skeleton">
          <div className="hd-skel-block" style={{ height: 28, width: "40%" }} />
          <div className="hd-skel-block" style={{ height: 18, width: "25%" }} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
            {[1,2,3].map(i => (
              <div key={i} className="hd-skel-block" style={{ height: 100 }} />
            ))}
          </div>
          <div className="hd-skel-block" style={{ height: 280 }} />
          <div className="hd-skel-block" style={{ height: 180 }} />
        </div>
      </>
    );
  }

  /* ── Main render ── */
  return (
    <>
      <style>{styles}</style>
      <div className="hd-root">
        <div className="hd-inner">

          {/* ── Header ── */}
          <div className="hd-header">
            <div className="hd-breadcrumb">
              <span>Hotels</span>
              <span className="hd-breadcrumb-sep">›</span>
              <span style={{ color: "rgba(255,255,255,0.55)" }}>
                {hotel?.name || "Detail"}
              </span>
            </div>

            <div className="hd-title-row">
              <h1 className="hd-title">
                {hotel?.name
                  ? <>{hotel.name.split(" ").slice(0,-1).join(" ")} <em>{hotel.name.split(" ").slice(-1)}</em></>
                  : <em>Hotel Details</em>
                }
              </h1>

              <div className="hd-badge-row">
                {hotel?.location && (
                  <div className="hd-badge hd-badge-purple">
                    <MapPinIcon /> {hotel.location}
                  </div>
                )}
                {avgSentiment !== null && (
                  <div className="hd-badge hd-badge-teal">
                    <StarIcon /> {(avgSentiment * 5).toFixed(1)} avg rating
                  </div>
                )}
                <div className="hd-badge hd-badge-purple">
                  {reviews.length} review{reviews.length !== 1 ? "s" : ""}
                </div>
              </div>
            </div>
          </div>

          {/* ── Review Form ── */}
          <div className="hd-form-wrap">
            <h2 className="hd-section-title">Write a Review</h2>
            <div className="hd-panel">
              <ReviewForm hotelId={id} onReviewAdded={handleReviewAdded} />
            </div>
          </div>

          {/* ── Aspect Analysis ── */}
          <div style={{ marginBottom: "2.5rem" }}>
            <h2 className="hd-section-title">Aspect Analysis</h2>

            {Object.keys(aspectScores).length === 0 ? (
              <div className="hd-panel">
                <div className="hd-empty">No aspect analysis available yet.</div>
              </div>
            ) : (
              <div className="hd-aspects-grid">
                {Object.entries(aspectScores).map(([key, value], i) => (
                  <div key={key} style={{ animationDelay: `${i * 0.06}s` }}>
                    <AspectCardStyled label={key} score={Number(value)} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Sentiment Trend ── */}
          <div className="hd-chart-wrap">
            <h2 className="hd-section-title">Sentiment Trend</h2>
            <div className="hd-panel">
              {chartData.length === 0 ? (
                <div className="hd-empty">No sentiment data to display.</div>
              ) : (
                <div className="hd-chart-inner">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(255,255,255,0.05)"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="date"
                        tick={{ fill: "rgba(255,255,255,0.28)", fontSize: 11, fontFamily: "'DM Sans',sans-serif" }}
                        axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
                        tickLine={false}
                      />
                      <YAxis
                        domain={[0, 1]}
                        tick={{ fill: "rgba(255,255,255,0.28)", fontSize: 11, fontFamily: "'DM Sans',sans-serif" }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
                      />
                      <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(167,139,250,0.2)", strokeWidth: 1 }} />
                      <defs>
                        <linearGradient id="sentimentGrad" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#6342ff" />
                          <stop offset="100%" stopColor="#60a5fa" />
                        </linearGradient>
                        <filter id="glow">
                          <feGaussianBlur stdDeviation="3" result="blur" />
                          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                        </filter>
                      </defs>
                      <Line
                        type="monotone"
                        dataKey="sentiment"
                        stroke="url(#sentimentGrad)"
                        strokeWidth={2.5}
                        dot={{ r: 4, fill: "#6342ff", stroke: "#080a0f", strokeWidth: 2 }}
                        activeDot={{ r: 6, fill: "#a78bfa", stroke: "#080a0f", strokeWidth: 2, filter: "url(#glow)" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>

          {/* ── Reviews ── */}
          <div className="hd-reviews-wrap">
            <h2 className="hd-section-title">
              Customer Reviews
              <span className="hd-review-count">({reviews.length})</span>
            </h2>
            <div className="hd-panel">
              {reviews.length === 0 ? (
                <div className="hd-empty">No reviews yet. Be the first to share your experience.</div>
              ) : (
                <ReviewList reviews={reviews} />
              )}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}