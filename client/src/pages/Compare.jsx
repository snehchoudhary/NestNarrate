// import { useEffect, useState } from "react";
// import API from "../services/api";
// import {
//   RadarChart,
//   Radar,
//   PolarGrid,
//   PolarAngleAxis,
//   PolarRadiusAxis,
//   ResponsiveContainer,
//   Legend
// } from "recharts";

// export default function Compare() {
//   const [allHotels, setAllHotels] = useState([]);
//   const [selected, setSelected] = useState([]);
//   const [data, setData] = useState([]);
//   const [hotels, setHotels] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const colors = ["#3b82f6", "#10b981", "#f59e0b"];
//   // ✅ fetch all hotels for dropdown
//   useEffect(() => {
//     const fetchHotels = async () => {
//       const res = await API.get("/hotels");
//       setAllHotels(res.data);
//     };
//     fetchHotels();
//   }, []);

//   // ✅ fetch compare data
//   const handleCompare = async () => {
//     if (selected.length < 2) {
//       alert("Select at least 2 hotels");
//       return;
//     }

//     try {
//       setLoading(true);

//       const res = await API.get(
//         `/hotels/compare?ids=${selected.join(",")}`
//       );

//       setHotels(res.data);

//       // format for radar chart
//       const formatted = [
//         "WiFi",
//         "Cleanliness",
//         "Staff",
//         "Location",
//         "Noise",
//         "Value"
//       ].map((aspect) => {
//         const row = { aspect };

//         res.data.forEach((hotel, i) => {
//           row[`H${i}`] = hotel.aspectScores[aspect];
//         });

//         return row;
//       });

//       setData(formatted);

//     } catch (err) {
//       console.error(err);
//       alert("Error fetching compare data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ handle selection
//   const toggleSelect = (id) => {
//     if (selected.includes(id)) {
//       setSelected(selected.filter((s) => s !== id));
//     } else {
//       if (selected.length >= 3) {
//         alert("Max 3 hotels allowed");
//         return;
//       }
//       setSelected([...selected, id]);
//     }
//   };

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-6">Compare Hotels</h1>

//       {/* 🔽 HOTEL SELECTOR */}
//       <div className="grid grid-cols-2 gap-4 mb-6">
//         {allHotels.map((h) => (
//           <div
//             key={h._id}
//             onClick={() => toggleSelect(h._id)}
//             className={`p-3 border rounded cursor-pointer ${
//               selected.includes(h._id)
//                 ? "bg-blue-200"
//                 : "bg-white"
//             }`}
//           >
//             {h.name}
//           </div>
//         ))}
//       </div>

//       {/* 🔘 BUTTON */}
//       <button
//         onClick={handleCompare}
//         className="bg-blue-600 text-white px-6 py-2 rounded mb-6"
//       >
//         Compare
//       </button>

//       {/* ⏳ LOADING */}
//       {loading && <p>Loading comparison...</p>}

//       {/* 📊 RESULT */}
//       {data.length > 0 && (
//         <>
//           {/* Hotel labels */}
//           <div className="flex gap-6 mb-4">
//             {hotels.map((h, i) => (
//               <span key={i} className="font-semibold">
//                 {`H${i + 1}: ${h.name}`}
//               </span>
//             ))}
//           </div>

//           {/* Radar chart */}
//           <div className="w-full h-[400px] bg-white p-4 rounded shadow">
//             <ResponsiveContainer>
//               <RadarChart data={data}>
//                 <PolarGrid />
//                 <PolarAngleAxis dataKey="aspect" />
//                 <PolarRadiusAxis domain={[0, 1]} />

//                 {hotels.map((_, i) => (
//                   <Radar
//                     key={i}
//                     name={`Hotel ${i + 1}`}
//                     dataKey={`H${i}`}
//                     stroke={colors[i]}
//                     fill={colors[i]}
//                     fillOpacity={0.4}
//                   />
//                 ))}

//                 <Legend />
//               </RadarChart>
//             </ResponsiveContainer>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import API from "../services/api";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

/* ─────────────────────────────────────────────
   STYLES
───────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');

  .cmp-root {
    min-height: 100vh;
    background: #080a0f;
    font-family: 'DM Sans', sans-serif;
    color: rgba(255,255,255,0.88);
    position: relative;
    overflow-x: hidden;
  }

  .cmp-root::before {
    content: '';
    position: fixed;
    inset: 0;
    background:
      radial-gradient(ellipse 55% 35% at 85% 8%,  rgba(59,130,246,0.10) 0%, transparent 65%),
      radial-gradient(ellipse 45% 30% at 8%  75%, rgba(99,66,255,0.09)  0%, transparent 60%),
      radial-gradient(ellipse 50% 35% at 50% 98%, rgba(20,184,150,0.06) 0%, transparent 60%);
    pointer-events: none;
    z-index: 0;
  }

  .cmp-root::after {
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

  .cmp-inner {
    position: relative;
    z-index: 1;
    max-width: 1100px;
    margin: 0 auto;
    padding: 2.5rem 1.5rem 5rem;
  }

  /* ── Header ── */
  .cmp-header {
    margin-bottom: 2.5rem;
    animation: cmpFadeUp 0.5s cubic-bezier(0.22,1,0.36,1) both;
  }

  .cmp-breadcrumb {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: rgba(255,255,255,0.28);
    margin-bottom: 1rem;
    letter-spacing: 0.3px;
  }

  .cmp-title {
    font-family: 'Instrument Serif', serif;
    font-size: clamp(2rem, 4vw, 2.8rem);
    font-weight: 400;
    color: #fff;
    margin: 0 0 0.4rem;
    letter-spacing: -0.5px;
    line-height: 1.15;
  }

  .cmp-title em {
    font-style: italic;
    background: linear-gradient(90deg, #60a5fa, #34d9a5);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .cmp-sub {
    font-size: 14px;
    color: rgba(255,255,255,0.35);
    font-weight: 300;
    margin: 0;
  }

  /* ── Panel ── */
  .cmp-panel {
    background: rgba(13,15,22,0.82);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 16px;
    padding: 1.75rem;
    backdrop-filter: blur(20px);
    box-shadow: 0 0 0 1px rgba(255,255,255,0.03) inset, 0 20px 60px rgba(0,0,0,0.4);
  }

  /* ── Section title ── */
  .cmp-section-title {
    font-family: 'Instrument Serif', serif;
    font-size: 1.2rem;
    font-weight: 400;
    color: #fff;
    margin: 0 0 1.25rem;
    letter-spacing: -0.3px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .cmp-section-title::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(255,255,255,0.06);
  }

  /* ── Selection counter ── */
  .cmp-counter-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.25rem;
    flex-wrap: wrap;
    gap: 8px;
  }

  .cmp-counter-pills {
    display: flex;
    gap: 6px;
  }

  .cmp-counter-pill {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: 1.5px dashed rgba(255,255,255,0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 500;
    color: rgba(255,255,255,0.2);
    transition: all 0.25s;
  }

  .cmp-counter-pill.filled-0 {
    background: rgba(59,130,246,0.15);
    border: 1.5px solid rgba(59,130,246,0.4);
    color: #60a5fa;
  }
  .cmp-counter-pill.filled-1 {
    background: rgba(20,184,150,0.13);
    border: 1.5px solid rgba(20,184,150,0.35);
    color: #34d9a5;
  }
  .cmp-counter-pill.filled-2 {
    background: rgba(245,158,11,0.13);
    border: 1.5px solid rgba(245,158,11,0.35);
    color: #fbbf24;
  }

  .cmp-counter-hint {
    font-size: 12px;
    color: rgba(255,255,255,0.28);
    font-weight: 300;
  }

  /* ── Hotel grid ── */
  .cmp-hotel-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 10px;
    margin-bottom: 1.5rem;
  }

  .cmp-hotel-card {
    padding: 14px 16px;
    border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.08);
    background: rgba(255,255,255,0.03);
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s, transform 0.15s;
    display: flex;
    align-items: center;
    gap: 10px;
    user-select: none;
  }

  .cmp-hotel-card:hover {
    background: rgba(255,255,255,0.055);
    border-color: rgba(255,255,255,0.15);
    transform: translateY(-1px);
  }

  .cmp-hotel-card.sel-0 {
    border-color: rgba(59,130,246,0.45);
    background: rgba(59,130,246,0.08);
  }
  .cmp-hotel-card.sel-1 {
    border-color: rgba(20,184,150,0.4);
    background: rgba(20,184,150,0.07);
  }
  .cmp-hotel-card.sel-2 {
    border-color: rgba(245,158,11,0.4);
    background: rgba(245,158,11,0.07);
  }

  .cmp-hotel-check {
    width: 18px;
    height: 18px;
    border-radius: 5px;
    border: 1.5px solid rgba(255,255,255,0.15);
    background: rgba(255,255,255,0.04);
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  }

  .cmp-hotel-card.sel-0 .cmp-hotel-check { background: #3b82f6; border-color: #3b82f6; }
  .cmp-hotel-card.sel-1 .cmp-hotel-check { background: #14b896; border-color: #14b896; }
  .cmp-hotel-card.sel-2 .cmp-hotel-check { background: #f59e0b; border-color: #f59e0b; }

  .cmp-hotel-name {
    font-size: 13px;
    font-weight: 400;
    color: rgba(255,255,255,0.75);
    line-height: 1.4;
    transition: color 0.2s;
  }

  .cmp-hotel-card.sel-0 .cmp-hotel-name { color: #93c5fd; }
  .cmp-hotel-card.sel-1 .cmp-hotel-name { color: #6ee7cf; }
  .cmp-hotel-card.sel-2 .cmp-hotel-name { color: #fcd34d; }

  .cmp-hotel-idx {
    margin-left: auto;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.5px;
    padding: 2px 7px;
    border-radius: 999px;
    flex-shrink: 0;
    opacity: 0;
    transition: opacity 0.2s;
  }

  .cmp-hotel-card.sel-0 .cmp-hotel-idx { opacity: 1; background: rgba(59,130,246,0.2); color: #60a5fa; }
  .cmp-hotel-card.sel-1 .cmp-hotel-idx { opacity: 1; background: rgba(20,184,150,0.18); color: #34d9a5; }
  .cmp-hotel-card.sel-2 .cmp-hotel-idx { opacity: 1; background: rgba(245,158,11,0.18); color: #fbbf24; }

  /* ── Compare button ── */
  .cmp-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 11px 28px;
    background: linear-gradient(135deg, #3b82f6 0%, #6342ff 100%);
    border: none;
    border-radius: 10px;
    color: #fff;
    font-size: 14px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 500;
    cursor: pointer;
    transition: transform 0.15s, box-shadow 0.2s, opacity 0.2s;
    box-shadow: 0 4px 24px rgba(59,130,246,0.28);
    position: relative;
    overflow: hidden;
  }

  .cmp-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 60%);
    opacity: 0;
    transition: opacity 0.2s;
  }

  .cmp-btn:hover::before { opacity: 1; }
  .cmp-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 32px rgba(59,130,246,0.4); }
  .cmp-btn:active { transform: translateY(0); }
  .cmp-btn:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }

  .cmp-spinner {
    width: 15px;
    height: 15px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: cmpSpin 0.65s linear infinite;
  }

  @keyframes cmpSpin { to { transform: rotate(360deg); } }

  /* ── Error ── */
  .cmp-error {
    background: rgba(220,60,60,0.1);
    border: 1px solid rgba(220,60,60,0.25);
    border-radius: 8px;
    padding: 10px 14px;
    font-size: 13px;
    color: #f87171;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 8px;
    animation: cmpShake 0.35s cubic-bezier(0.36,0.07,0.19,0.97);
  }

  @keyframes cmpShake {
    0%,100% { transform: translateX(0); }
    20%      { transform: translateX(-5px); }
    40%      { transform: translateX(5px); }
    60%      { transform: translateX(-3px); }
    80%      { transform: translateX(3px); }
  }

  /* ── Results ── */
  .cmp-results {
    margin-top: 2.5rem;
    animation: cmpFadeUp 0.5s cubic-bezier(0.22,1,0.36,1) both;
  }

  /* Hotel legend strip */
  .cmp-legend-strip {
    display: flex;
    gap: 10px;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
  }

  .cmp-legend-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    border-radius: 10px;
    border: 1px solid;
    font-size: 13px;
    font-weight: 400;
  }

  .cmp-legend-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .cmp-legend-item-0 { background: rgba(59,130,246,0.08); border-color: rgba(59,130,246,0.3); color: #93c5fd; }
  .cmp-legend-item-1 { background: rgba(20,184,150,0.08); border-color: rgba(20,184,150,0.28); color: #6ee7cf; }
  .cmp-legend-item-2 { background: rgba(245,158,11,0.08); border-color: rgba(245,158,11,0.28); color: #fcd34d; }

  /* Radar chart panel */
  .cmp-chart-panel {
    background: rgba(13,15,22,0.82);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 16px;
    padding: 2rem;
    backdrop-filter: blur(20px);
    box-shadow: 0 0 0 1px rgba(255,255,255,0.03) inset, 0 20px 60px rgba(0,0,0,0.4);
    margin-bottom: 2rem;
  }

  .cmp-chart-wrap {
    width: 100%;
    height: 420px;
  }

  /* Score table */
  .cmp-table-panel {
    background: rgba(13,15,22,0.82);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 16px;
    overflow: hidden;
    backdrop-filter: blur(20px);
    box-shadow: 0 0 0 1px rgba(255,255,255,0.03) inset, 0 20px 60px rgba(0,0,0,0.4);
  }

  .cmp-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
  }

  .cmp-table th {
    padding: 14px 20px;
    text-align: left;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.6px;
    text-transform: uppercase;
    color: rgba(255,255,255,0.3);
    border-bottom: 1px solid rgba(255,255,255,0.06);
    background: rgba(255,255,255,0.02);
  }

  .cmp-table td {
    padding: 13px 20px;
    border-bottom: 1px solid rgba(255,255,255,0.04);
    color: rgba(255,255,255,0.7);
    vertical-align: middle;
  }

  .cmp-table tr:last-child td { border-bottom: none; }
  .cmp-table tr:hover td { background: rgba(255,255,255,0.02); }

  .cmp-table-aspect {
    font-weight: 500;
    color: rgba(255,255,255,0.55);
    font-size: 12px;
    letter-spacing: 0.3px;
  }

  .cmp-score-cell {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .cmp-score-num {
    font-family: 'Instrument Serif', serif;
    font-size: 1.1rem;
    min-width: 36px;
  }

  .cmp-score-bar-track {
    flex: 1;
    height: 4px;
    background: rgba(255,255,255,0.06);
    border-radius: 999px;
    overflow: hidden;
    min-width: 60px;
  }

  .cmp-score-bar-fill {
    height: 100%;
    border-radius: 999px;
    transition: width 0.8s cubic-bezier(0.22,1,0.36,1);
  }

  /* Tooltip */
  .cmp-tooltip {
    background: rgba(13,15,22,0.96);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px;
    padding: 10px 14px;
    font-family: 'DM Sans', sans-serif;
    font-size: 12px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.5);
  }

  .cmp-tooltip-label {
    font-size: 11px;
    color: rgba(255,255,255,0.3);
    margin-bottom: 6px;
    letter-spacing: 0.3px;
  }

  .cmp-tooltip-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 3px;
  }

  .cmp-tooltip-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .cmp-tooltip-name { color: rgba(255,255,255,0.65); flex: 1; }
  .cmp-tooltip-val  { font-weight: 500; color: #fff; }

  @keyframes cmpFadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 640px) {
    .cmp-hotel-grid { grid-template-columns: 1fr 1fr; }
    .cmp-chart-wrap { height: 300px; }
    .cmp-table th:not(:first-child):not(:nth-child(2)) { display: none; }
    .cmp-table td:not(:first-child):not(:nth-child(2)) { display: none; }
  }
`;

/* ─────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────── */
const COLORS      = ["#3b82f6", "#14b896", "#f59e0b"];
const FILL_COLORS = ["rgba(59,130,246,0.18)", "rgba(20,184,150,0.15)", "rgba(245,158,11,0.13)"];
const ASPECTS     = ["WiFi", "Cleanliness", "Staff", "Location", "Noise", "Value"];

/* ─────────────────────────────────────────────
   ICONS
───────────────────────────────────────────── */
const CheckIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const AlertIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink:0 }}>
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

const ChartIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

/* ─────────────────────────────────────────────
   CUSTOM TOOLTIP
───────────────────────────────────────────── */
const CustomTooltip = ({ active, payload, label, hotels }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="cmp-tooltip">
      <div className="cmp-tooltip-label">{label}</div>
      {payload.map((entry, i) => (
        <div key={i} className="cmp-tooltip-row">
          <div className="cmp-tooltip-dot" style={{ background: entry.stroke }} />
          <span className="cmp-tooltip-name">{hotels[i]?.name || `Hotel ${i+1}`}</span>
          <span className="cmp-tooltip-val">{((entry.value || 0) * 100).toFixed(0)}%</span>
        </div>
      ))}
    </div>
  );
};

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function Compare() {
  const [allHotels, setAllHotels] = useState([]);
  const [selected, setSelected]   = useState([]);
  const [data, setData]           = useState([]);
  const [hotels, setHotels]       = useState([]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await API.get("/hotels");
        setAllHotels(res.data);
      } catch {
        setError("Failed to load hotels.");
      }
    };
    fetchHotels();
  }, []);

  const handleCompare = async () => {
    if (selected.length < 2) {
      setError("Please select at least 2 hotels to compare.");
      return;
    }
    setError("");
    try {
      setLoading(true);
      const res = await API.get(`/hotels/compare?ids=${selected.join(",")}`);
      setHotels(res.data);

      const formatted = ASPECTS.map((aspect) => {
        const row = { aspect };
        res.data.forEach((hotel, i) => {
          row[`H${i}`] = hotel.aspectScores?.[aspect] ?? 0;
        });
        return row;
      });

      setData(formatted);
    } catch {
      setError("Error fetching comparison data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleSelect = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((s) => s !== id));
    } else {
      if (selected.length >= 3) {
        setError("Maximum 3 hotels can be compared at once.");
        return;
      }
      setError("");
      setSelected([...selected, id]);
    }
  };

  const selIndex = (id) => selected.indexOf(id);

  return (
    <>
      <style>{styles}</style>
      <div className="cmp-root">
        <div className="cmp-inner">

          {/* ── Header ── */}
          <div className="cmp-header">
            <div className="cmp-breadcrumb">
              <span>Hotels</span>
              <span style={{ opacity: 0.3 }}>›</span>
              <span style={{ color: "rgba(255,255,255,0.55)" }}>Compare</span>
            </div>
            <h1 className="cmp-title">
              Side-by-side <em>comparison</em>
            </h1>
            <p className="cmp-sub">
              Select up to 3 hotels to compare aspect scores on a radar chart
            </p>
          </div>

          {/* ── Selector Panel ── */}
          <div className="cmp-panel" style={{ marginBottom: "1.5rem", animation: "cmpFadeUp 0.5s cubic-bezier(0.22,1,0.36,1) both" }}>
            <h2 className="cmp-section-title">Select Hotels</h2>

            {/* Counter pills */}
            <div className="cmp-counter-row">
              <div className="cmp-counter-pills">
                {[0,1,2].map((i) => (
                  <div
                    key={i}
                    className={`cmp-counter-pill ${i < selected.length ? `filled-${i}` : ""}`}
                  >
                    {i < selected.length
                      ? <CheckIcon />
                      : i + 1
                    }
                  </div>
                ))}
              </div>
              <span className="cmp-counter-hint">
                {selected.length === 0
                  ? "Choose 2–3 hotels"
                  : selected.length === 1
                  ? "Select 1 more to compare"
                  : `${selected.length} selected — ready to compare`}
              </span>
            </div>

            {/* Error */}
            {error && (
              <div className="cmp-error">
                <AlertIcon /> {error}
              </div>
            )}

            {/* Hotel cards */}
            <div className="cmp-hotel-grid">
              {allHotels.map((h) => {
                const idx  = selIndex(h._id);
                const isSel = idx !== -1;
                return (
                  <div
                    key={h._id}
                    className={`cmp-hotel-card ${isSel ? `sel-${idx}` : ""}`}
                    onClick={() => toggleSelect(h._id)}
                  >
                    <div className="cmp-hotel-check">
                      {isSel && <CheckIcon />}
                    </div>
                    <span className="cmp-hotel-name">{h.name}</span>
                    {isSel && (
                      <span className="cmp-hotel-idx">H{idx + 1}</span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Compare button */}
            <button
              className="cmp-btn"
              onClick={handleCompare}
              disabled={loading || selected.length < 2}
            >
              {loading
                ? <><div className="cmp-spinner" /> Comparing…</>
                : <><ChartIcon /> Compare Hotels</>
              }
            </button>
          </div>

          {/* ── Results ── */}
          {data.length > 0 && (
            <div className="cmp-results">

              {/* Legend strip */}
              <div className="cmp-legend-strip">
                {hotels.map((h, i) => (
                  <div key={i} className={`cmp-legend-item cmp-legend-item-${i}`}>
                    <div className="cmp-legend-dot" style={{ background: COLORS[i] }} />
                    <span>H{i+1} — {h.name}</span>
                  </div>
                ))}
              </div>

              {/* Radar chart */}
              <div className="cmp-chart-panel">
                <h2 className="cmp-section-title">Radar Overview</h2>
                <div className="cmp-chart-wrap">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={data} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                      <PolarGrid
                        stroke="rgba(255,255,255,0.07)"
                        gridType="polygon"
                      />
                      <PolarAngleAxis
                        dataKey="aspect"
                        tick={{
                          fill: "rgba(255,255,255,0.45)",
                          fontSize: 12,
                          fontFamily: "'DM Sans', sans-serif",
                          fontWeight: 500,
                        }}
                      />
                      <PolarRadiusAxis
                        domain={[0, 1]}
                        tick={{
                          fill: "rgba(255,255,255,0.2)",
                          fontSize: 10,
                          fontFamily: "'DM Sans', sans-serif",
                        }}
                        tickCount={5}
                        axisLine={false}
                        tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
                      />
                      <Tooltip content={<CustomTooltip hotels={hotels} />} />
                      {hotels.map((_, i) => (
                        <Radar
                          key={i}
                          name={`Hotel ${i + 1}`}
                          dataKey={`H${i}`}
                          stroke={COLORS[i]}
                          fill={FILL_COLORS[i]}
                          fillOpacity={1}
                          strokeWidth={2}
                          dot={{ r: 4, fill: COLORS[i], stroke: "#080a0f", strokeWidth: 2 }}
                          activeDot={{ r: 6, fill: COLORS[i], stroke: "#080a0f", strokeWidth: 2 }}
                        />
                      ))}
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Score table */}
              <div className="cmp-table-panel">
                <h2 className="cmp-section-title" style={{ padding: "1.25rem 1.75rem 0", marginBottom: "0" }}>
                  Score Breakdown
                </h2>
                <table className="cmp-table">
                  <thead>
                    <tr>
                      <th>Aspect</th>
                      {hotels.map((h, i) => (
                        <th key={i} style={{ color: COLORS[i] }}>
                          H{i+1} — {h.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((row) => (
                      <tr key={row.aspect}>
                        <td className="cmp-table-aspect">{row.aspect}</td>
                        {hotels.map((_, i) => {
                          const val = row[`H${i}`] ?? 0;
                          return (
                            <td key={i}>
                              <div className="cmp-score-cell">
                                <span className="cmp-score-num" style={{ color: COLORS[i] }}>
                                  {(val * 100).toFixed(0)}
                                </span>
                                <div className="cmp-score-bar-track">
                                  <div
                                    className="cmp-score-bar-fill"
                                    style={{
                                      width: `${val * 100}%`,
                                      background: COLORS[i],
                                      opacity: 0.7,
                                    }}
                                  />
                                </div>
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

        </div>
      </div>
    </>
  );
}