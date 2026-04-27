// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {motion} from "framer-motion";

// export default function Home() {
//   const [query, setQuery] = useState("");
//   const navigate = useNavigate();

//   const handleSearch = () => {
//     if (!query.trim()) return;
//     navigate(`/search?q=${query}`);
//   };

//   return (
//     <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
//       <motion.div
//       initial={{ opacity: 0, y: 30}}
//       animate={{opacity:1, y: 0}}
//       transition={{duration: 0.5}}
//       >
// <h1 className="text-5xl font-bold mb-6">
//         Ask anything about any hotel
//       </h1>
//       </motion.div>
      

//       <div className="flex gap-2">
//         <input
//           type="text"
//           placeholder="Is WiFi fast?"
//           className="p-3 w-96 rounded shadow"
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//         />

//         <button
//           onClick={handleSearch}
//           className="bg-blue-600 text-white px-6 rounded"
//         >
//           Search
//         </button>
//       </div>
//     </div>
//   );
// }

// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import API from "../services/api";

// export default function Home() {
//   const [query, setQuery] = useState("");
//   const [hotels, setHotels] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchHotels();
//   }, []);

//   const fetchHotels = async () => {
//     try {
//       const res = await API.get("/hotels");
//       setHotels(res.data);
//     } catch (error) {
//       console.error("Failed to fetch hotels:", error);
//     }
//   };

//   const handleSearch = async () => {
//     if (!query.trim()) {
//       fetchHotels();
//       return;
//     }

//     try {
//       const res = await API.get(
//         `/search?query=${encodeURIComponent(query)}`
//       );
//       setHotels(res.data);
//     } catch (error) {
//       console.error("Search failed:", error);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <div className="max-w-6xl mx-auto">
//         <h1 className="text-5xl font-bold text-center mb-10">
//           Ask anything about any hotel
//         </h1>

//         <div className="flex gap-4 justify-center mb-12">
//           <input
//             type="text"
//             placeholder="Is WiFi fast?"
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             className="w-full max-w-xl px-4 py-3 border rounded-lg shadow-sm"
//           />

//           <button
//             onClick={handleSearch}
//             className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700"
//           >
//             Search
//           </button>
//         </div>

//         {/* Hotels Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {hotels.length === 0 ? (
//             <p className="text-center col-span-full text-gray-500">
//               No hotels found.
//             </p>
//           ) : (
//             hotels.map((hotel) => (
//               <div
//                 key={hotel._id}
//                 onClick={() => navigate(`/hotel/${hotel._id}`)}
//                 className="bg-white rounded-xl shadow-md p-6 cursor-pointer hover:shadow-xl transition"
//               >
//                 <h2 className="text-2xl font-bold mb-2">
//                   {hotel.name}
//                 </h2>

//                 <p className="text-gray-600 mb-2">
//                   {hotel.location}
//                 </p>

//                 <p className="text-yellow-500 font-semibold">
//                   ⭐ {hotel.averageRating > 0 ? hotel.averageRating.toFixed(1) : "No Reviews Yet"}
//                 </p>
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }


import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Particle({ style }) {
  return <div className="nn-particle" style={style} />;
}

const SEARCH_SUGGESTIONS = [
  "Is the WiFi fast?",
  "Do rooms have sea views?",
  "Is breakfast included?",
  "Are pets allowed?",
  "Is there a rooftop pool?",
];

export default function Home() {
  const [query, setQuery]         = useState("");
  const [hotels, setHotels]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [searching, setSearching] = useState(false);
  const [mounted, setMounted]     = useState(false);
  const [suggestion, setSuggestion] = useState(0);
  const [focused, setFocused]     = useState(false);
  const canvasRef                 = useRef(null);
  const navigate                  = useNavigate();

  useEffect(() => {
    fetchHotels();
    setTimeout(() => setMounted(true), 60);
  }, []);

  // Cycle placeholder suggestions
  useEffect(() => {
    const id = setInterval(() => setSuggestion((s) => (s + 1) % SEARCH_SUGGESTIONS.length), 3000);
    return () => clearInterval(id);
  }, []);

  // Canvas: animated globe dots (matching Register page)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId, t = 0;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const dots = [];
    for (let i = 0; i < 160; i++) {
      const phi   = Math.acos(-1 + (2 * i) / 160);
      const theta = Math.sqrt(160 * Math.PI) * phi;
      dots.push({ phi, theta });
    }

    const draw = () => {
      const w = canvas.width, h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Wave layers at bottom
      for (let layer = 0; layer < 4; layer++) {
        ctx.beginPath();
        const amp   = 30 + layer * 18;
        const freq  = 0.006 - layer * 0.001;
        const speed = t * (0.3 + layer * 0.08);
        const yBase = h * (0.55 + layer * 0.14);
        ctx.moveTo(0, yBase);
        for (let x = 0; x <= w; x += 4) {
          const y = yBase + Math.sin(x * freq + speed) * amp
                          + Math.sin(x * freq * 1.6 + speed * 0.9) * (amp * 0.35);
          ctx.lineTo(x, y);
        }
        ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.closePath();
        const alpha = 0.025 + layer * 0.01;
        const grad  = ctx.createLinearGradient(0, 0, w, 0);
        grad.addColorStop(0,   `rgba(212,175,55,${alpha})`);
        grad.addColorStop(0.5, `rgba(59,130,246,${alpha * 0.5})`);
        grad.addColorStop(1,   `rgba(212,175,55,${alpha})`);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      // Globe dots (top-right area)
      const cx = w * 0.82, cy = h * 0.28;
      const R  = Math.min(w, h) * 0.22;
      dots.forEach(({ phi, theta }) => {
        const x3 = R * Math.sin(phi) * Math.cos(theta + t * 0.25);
        const y3 = R * Math.sin(phi) * Math.sin(theta + t * 0.25);
        const z3 = R * Math.cos(phi);
        const px = cx + x3;
        const py = cy + y3 * 0.4 + z3 * 0.55;
        const alpha = z3 > -R * 0.2 ? ((z3 + R) / (2 * R)) * 0.55 : 0;
        if (alpha > 0.05) {
          ctx.beginPath();
          ctx.arc(px, py, 1.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(212,175,55,${alpha})`;
          ctx.fill();
        }
      });

      // Dot grid (left background)
      const cols = 16, rows = 8;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols / 2; c++) {
          const x    = (w * 0.45 / cols) * c + 20;
          const y    = (h / rows) * r + h / (rows * 2);
          const wave = Math.sin(t * 0.4 + r * 0.5 + c * 0.4) * 0.5 + 0.5;
          ctx.beginPath();
          ctx.arc(x, y, 0.8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(212,175,55,${wave * 0.1})`;
          ctx.fill();
        }
      }

      t += 0.014;
      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);

  const fetchHotels = async () => {
    setLoading(true);
    try {
      const res = await API.get("/hotels");
      setHotels(res.data);
    } catch (error) {
      console.error("Failed to fetch hotels:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!query.trim()) { fetchHotels(); return; }
    setSearching(true);
    try {
      const res = await API.get(`/search?query=${encodeURIComponent(query)}`);
      setHotels(res.data);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setSearching(false);
    }
  };

  const handleKey = (e) => { if (e.key === "Enter") handleSearch(); };

  const getRatingColor = (r) => {
    if (!r || r === 0) return "rgba(255,255,255,0.2)";
    if (r >= 4.5) return "#10b981";
    if (r >= 4.0) return "#22c55e";
    if (r >= 3.5) return "#eab308";
    return "#f97316";
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .nn-home {
          min-height: 100vh;
          background: #08090d;
          font-family: 'DM Sans', sans-serif;
          color: #fff;
          overflow-x: hidden;
          position: relative;
        }

        /* ── AMBIENT BG ── */
        .nn-home-bg {
          position: fixed; inset: 0;
          pointer-events: none; z-index: 0;
        }

        .nn-home-bg::before {
          content: '';
          position: absolute; top: -200px; right: -200px;
          width: 700px; height: 700px;
          background: radial-gradient(circle, rgba(212,175,55,0.05) 0%, transparent 65%);
        }

        .nn-home-bg::after {
          content: '';
          position: absolute; bottom: -150px; left: -150px;
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(59,130,246,0.03) 0%, transparent 65%);
        }

        .nn-particles { position: fixed; inset: 0; pointer-events: none; overflow: hidden; z-index: 0; }

        .nn-particle {
          position: absolute; border-radius: 50%;
          background: rgba(212,175,55,0.3);
          animation: floatUp linear infinite;
        }

        @keyframes floatUp {
          0%   { transform: translateY(100vh) scale(0); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 0.3; }
          100% { transform: translateY(-10vh) scale(1); opacity: 0; }
        }

        /* ── NAV ── */
        .nn-nav {
          position: relative; z-index: 10;
          display: flex; align-items: center; justify-content: space-between;
          padding: 24px 48px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          backdrop-filter: blur(8px);
          background: rgba(8,9,13,0.6);
        }

        @media (max-width: 768px) {
          .nn-nav { padding: 20px 24px; }
          .nn-nav-links { display: none; }
        }

        .nn-logo {
          font-family: 'Cormorant Garamond', serif;
          font-size: 26px; font-weight: 300;
          letter-spacing: 2px; color: #fff;
          cursor: pointer;
        }
        .nn-logo em { font-style: italic; color: #d4af37; }

        .nn-nav-links { display: flex; align-items: center; gap: 8px; }

        .nn-nav-btn {
          padding: 8px 18px; border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.03);
          color: rgba(255,255,255,0.4);
          font-family: 'DM Sans', sans-serif;
          font-size: 11px; letter-spacing: 1.5px;
          text-transform: uppercase; cursor: pointer;
          transition: all 0.2s;
        }

        .nn-nav-btn:hover {
          border-color: rgba(255,255,255,0.14);
          color: rgba(255,255,255,0.7);
          background: rgba(255,255,255,0.05);
        }

        .nn-nav-btn.gold {
          background: linear-gradient(135deg, #d4af37, #c9a227);
          border-color: transparent; color: #0b0d13; font-weight: 500;
        }

        .nn-nav-btn.gold:hover {
          box-shadow: 0 4px 20px rgba(212,175,55,0.3);
          transform: translateY(-1px);
        }

        /* ── HERO ── */
        .nn-hero {
          position: relative; overflow: hidden;
          padding: 80px 48px 72px;
          text-align: center;
          z-index: 1;
        }

        @media (max-width: 768px) {
          .nn-hero { padding: 56px 24px 52px; }
        }

        .nn-canvas {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          pointer-events: none;
        }

        .nn-hero-inner {
          position: relative; z-index: 2;
          max-width: 760px; margin: 0 auto;
          opacity: 0; transform: translateY(20px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }

        .nn-hero-inner.mounted { opacity: 1; transform: translateY(0); }

        .nn-hero-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 10px; letter-spacing: 3px;
          text-transform: uppercase; color: rgba(212,175,55,0.6);
          background: rgba(212,175,55,0.06);
          border: 1px solid rgba(212,175,55,0.15);
          padding: 6px 16px; border-radius: 20px;
          margin-bottom: 28px; font-weight: 300;
        }

        .nn-hero-eyebrow-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: #d4af37; animation: pulse 2s ease infinite;
        }

        @keyframes pulse {
          0%,100% { opacity: 1; } 50% { opacity: 0.3; }
        }

        .nn-hero-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 68px; font-weight: 300;
          color: #fff; line-height: 1.0;
          letter-spacing: -2px; margin-bottom: 18px;
        }

        .nn-hero-title em { font-style: italic; color: #d4af37; }

        @media (max-width: 768px) {
          .nn-hero-title { font-size: 40px; letter-spacing: -1px; }
        }

        .nn-hero-sub {
          font-size: 15px; color: rgba(255,255,255,0.3);
          font-weight: 300; line-height: 1.7;
          max-width: 480px; margin: 0 auto 48px;
        }

        /* ── SEARCH BAR ── */
        .nn-search-wrap {
          display: flex; gap: 10px;
          max-width: 640px; margin: 0 auto;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 14px;
          padding: 6px;
          transition: all 0.3s ease;
        }

        .nn-search-wrap.focused {
          border-color: rgba(212,175,55,0.4);
          background: rgba(212,175,55,0.03);
          box-shadow: 0 0 0 4px rgba(212,175,55,0.07);
        }

        .nn-search-icon-wrap {
          display: flex; align-items: center; justify-content: center;
          padding: 0 14px;
          color: rgba(255,255,255,0.2);
          font-size: 15px;
          transition: color 0.3s;
          flex-shrink: 0;
        }

        .nn-search-wrap.focused .nn-search-icon-wrap { color: #d4af37; }

        .nn-search-input {
          flex: 1; background: transparent; border: none;
          color: #fff; font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 300;
          outline: none; padding: 12px 0;
          caret-color: #d4af37;
        }

        .nn-search-input::placeholder { color: rgba(255,255,255,0.18); }

        .nn-search-btn {
          padding: 12px 28px; border-radius: 10px; border: none;
          background: linear-gradient(135deg, #d4af37 0%, #f0d060 50%, #c9a227 100%);
          color: #0b0d13; font-family: 'DM Sans', sans-serif;
          font-size: 11px; font-weight: 500;
          letter-spacing: 2px; text-transform: uppercase;
          cursor: pointer; position: relative; overflow: hidden;
          transition: all 0.3s ease; flex-shrink: 0;
        }

        .nn-search-btn::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.2) 50%, transparent 60%);
          transform: translateX(-100%); transition: transform 0.5s ease;
        }

        .nn-search-btn:hover::after { transform: translateX(100%); }
        .nn-search-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 24px rgba(212,175,55,0.3); }

        .nn-search-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        .nn-spinner {
          display: inline-block; width: 12px; height: 12px;
          border: 2px solid rgba(0,0,0,0.2);
          border-top-color: #0b0d13;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          vertical-align: middle; margin-right: 6px;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        /* Suggestion pills */
        .nn-suggestions {
          display: flex; flex-wrap: wrap; justify-content: center;
          gap: 8px; margin-top: 20px;
        }

        .nn-suggestion-pill {
          font-size: 11px; color: rgba(255,255,255,0.25);
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 20px; padding: 5px 14px;
          cursor: pointer; transition: all 0.2s;
          letter-spacing: 0.2px;
        }

        .nn-suggestion-pill:hover {
          color: rgba(212,175,55,0.8);
          border-color: rgba(212,175,55,0.2);
          background: rgba(212,175,55,0.05);
        }

        /* ── DIVIDER ── */
        .nn-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(212,175,55,0.15), transparent);
          margin: 0 48px;
          position: relative; z-index: 1;
        }

        /* ── HOTELS SECTION ── */
        .nn-hotels-section {
          position: relative; z-index: 1;
          max-width: 1140px; margin: 0 auto;
          padding: 52px 48px 80px;
        }

        @media (max-width: 768px) {
          .nn-hotels-section { padding: 40px 24px 60px; }
        }

        .nn-section-head {
          display: flex; align-items: baseline;
          justify-content: space-between;
          margin-bottom: 28px; flex-wrap: wrap; gap: 10px;
        }

        .nn-section-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 32px; font-weight: 300;
          color: #fff; letter-spacing: -0.5px;
        }

        .nn-section-count {
          font-size: 11px; letter-spacing: 1.5px;
          text-transform: uppercase; color: rgba(255,255,255,0.2);
        }

        /* ── HOTEL GRID ── */
        .nn-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }

        @media (max-width: 900px) { .nn-grid { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 580px) { .nn-grid { grid-template-columns: 1fr; } }

        /* ── HOTEL CARD ── */
        .nn-hotel-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          padding: 24px;
          cursor: pointer;
          position: relative; overflow: hidden;
          transition: all 0.35s ease;
          animation: fadeSlideUp 0.5s ease both;
        }

        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .nn-hotel-card::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(212,175,55,0.4), transparent);
          opacity: 0; transition: opacity 0.3s;
        }

        .nn-hotel-card::after {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(ellipse at 50% 0%, rgba(212,175,55,0.04) 0%, transparent 60%);
          opacity: 0; transition: opacity 0.4s;
        }

        .nn-hotel-card:hover {
          border-color: rgba(212,175,55,0.22);
          transform: translateY(-3px);
          box-shadow: 0 16px 48px rgba(0,0,0,0.5);
        }

        .nn-hotel-card:hover::before { opacity: 1; }
        .nn-hotel-card:hover::after  { opacity: 1; }

        .nn-hotel-card-top {
          display: flex; align-items: flex-start;
          justify-content: space-between; margin-bottom: 16px;
        }

        .nn-hotel-icon {
          width: 44px; height: 44px; border-radius: 12px;
          background: linear-gradient(135deg, rgba(212,175,55,0.14), rgba(212,175,55,0.05));
          border: 1px solid rgba(212,175,55,0.18);
          display: flex; align-items: center; justify-content: center;
          font-size: 20px; flex-shrink: 0;
        }

        .nn-hotel-rating-badge {
          display: flex; align-items: center; gap: 5px;
          padding: 4px 10px; border-radius: 20px;
          font-size: 11px; font-weight: 500;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          transition: all 0.3s;
        }

        .nn-hotel-rating-star { font-size: 10px; }

        .nn-hotel-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 21px; font-weight: 400;
          color: #fff; margin-bottom: 7px;
          line-height: 1.2;
          transition: color 0.2s;
        }

        .nn-hotel-card:hover .nn-hotel-name { color: rgba(255,255,255,0.95); }

        .nn-hotel-location {
          display: flex; align-items: center; gap: 6px;
          font-size: 12px; color: rgba(255,255,255,0.28);
          font-weight: 300; margin-bottom: 18px;
        }

        .nn-hotel-loc-dot {
          width: 4px; height: 4px; border-radius: 50%;
          background: rgba(212,175,55,0.5); flex-shrink: 0;
        }

        .nn-hotel-footer {
          display: flex; align-items: center; justify-content: space-between;
          padding-top: 16px;
          border-top: 1px solid rgba(255,255,255,0.05);
        }

        .nn-hotel-tag {
          font-size: 9px; letter-spacing: 1.5px;
          text-transform: uppercase; color: rgba(212,175,55,0.5);
          background: rgba(212,175,55,0.07);
          border: 1px solid rgba(212,175,55,0.15);
          padding: 3px 9px; border-radius: 20px;
        }

        .nn-hotel-arrow {
          font-size: 14px; color: rgba(255,255,255,0.12);
          transition: all 0.25s;
        }

        .nn-hotel-card:hover .nn-hotel-arrow {
          color: #d4af37; transform: translateX(4px);
        }

        /* ── SKELETON LOADER ── */
        .nn-skeleton {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 16px; padding: 24px;
          animation: shimmerBg 1.8s ease infinite;
        }

        @keyframes shimmerBg {
          0%,100% { background: rgba(255,255,255,0.03); }
          50%      { background: rgba(255,255,255,0.05); }
        }

        .nn-skel-line {
          border-radius: 4px; background: rgba(255,255,255,0.06);
          margin-bottom: 10px;
          animation: shimmerBg 1.8s ease infinite;
        }

        /* ── EMPTY STATE ── */
        .nn-empty {
          col-span: 3;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 72px 32px; text-align: center;
          background: rgba(255,255,255,0.02);
          border: 1px dashed rgba(255,255,255,0.06);
          border-radius: 18px;
          grid-column: 1 / -1;
        }

        .nn-empty-icon { font-size: 44px; margin-bottom: 18px; opacity: 0.35; }

        .nn-empty-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 24px; font-weight: 300; font-style: italic;
          color: rgba(255,255,255,0.45); margin-bottom: 8px;
        }

        .nn-empty-sub {
          font-size: 13px; color: rgba(255,255,255,0.18);
          font-weight: 300; line-height: 1.7;
        }

        .nn-empty-btn {
          margin-top: 24px; padding: 11px 26px;
          border-radius: 9px;
          border: 1px solid rgba(212,175,55,0.3);
          background: rgba(212,175,55,0.07);
          color: #d4af37;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px; letter-spacing: 1.5px;
          text-transform: uppercase; cursor: pointer;
          transition: all 0.2s;
        }

        .nn-empty-btn:hover {
          background: rgba(212,175,55,0.12);
          box-shadow: 0 4px 20px rgba(212,175,55,0.15);
        }

        /* ── FOOTER ── */
        .nn-footer {
          position: relative; z-index: 1;
          text-align: center;
          padding: 28px 48px;
          border-top: 1px solid rgba(255,255,255,0.05);
        }

        .nn-footer-text {
          font-size: 11px; letter-spacing: 2px;
          text-transform: uppercase; color: rgba(255,255,255,0.12);
        }

        .nn-footer-text em { color: rgba(212,175,55,0.4); font-style: italic; font-family: 'Cormorant Garamond', serif; }
      `}</style>

      <div className="nn-home">
        <div className="nn-home-bg" />

        {/* Particles */}
        <div className="nn-particles">
          {Array.from({ length: 10 }).map((_, i) => (
            <Particle
              key={i}
              style={{
                left: `${Math.random() * 100}%`,
                animationDuration: `${12 + Math.random() * 14}s`,
                animationDelay: `${Math.random() * 10}s`,
                width:  `${1 + Math.random() * 2}px`,
                height: `${1 + Math.random() * 2}px`,
              }}
            />
          ))}
        </div>

        {/* ── NAV ── */}
        <nav className="nn-nav">
          <div className="nn-logo" onClick={() => navigate("/home")}>
            Nest<em>Narrate</em>
          </div>
          <div className="nn-nav-links">
            <button className="nn-nav-btn" onClick={() => navigate("/dashboard")}>Dashboard</button>
            <button className="nn-nav-btn" onClick={() => navigate("/write-review")}>Write Review</button>
            <button
              className="nn-nav-btn gold"
              onClick={() => { localStorage.removeItem("token"); navigate("/login"); }}
            >
              Sign Out
            </button>
          </div>
        </nav>

        {/* ── HERO ── */}
        <section className="nn-hero">
          <canvas ref={canvasRef} className="nn-canvas" />

          <div className={`nn-hero-inner ${mounted ? "mounted" : ""}`}>
            <div className="nn-hero-eyebrow">
              <div className="nn-hero-eyebrow-dot" />
              2M+ Honest Hotel Reviews
            </div>

            <h1 className="nn-hero-title">
              Ask anything about<br /><em>any hotel</em>
            </h1>

            <p className="nn-hero-sub">
              Real stories from real travelers. No ads, no filters —
              just the truth about where you'll stay.
            </p>

            {/* Search bar */}
            <div className={`nn-search-wrap ${focused ? "focused" : ""}`}>
              <div className="nn-search-icon-wrap">◎</div>
              <input
                className="nn-search-input"
                type="text"
                placeholder={SEARCH_SUGGESTIONS[suggestion]}
                value={query}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKey}
              />
              <button
                className="nn-search-btn"
                onClick={handleSearch}
                disabled={searching}
              >
                {searching && <span className="nn-spinner" />}
                {searching ? "Searching..." : "Search"}
              </button>
            </div>

            {/* Suggestion pills */}
            <div className="nn-suggestions">
              {SEARCH_SUGGESTIONS.map((s, i) => (
                <div
                  key={i}
                  className="nn-suggestion-pill"
                  onClick={() => { setQuery(s); }}
                >
                  {s}
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="nn-divider" />

        {/* ── HOTELS SECTION ── */}
        <section className="nn-hotels-section">
          <div className="nn-section-head">
            <div className="nn-section-title">
              {query.trim() ? `Results for "${query}"` : "All Hotels"}
            </div>
            {!loading && (
              <div className="nn-section-count">
                {hotels.length} {hotels.length === 1 ? "property" : "properties"}
              </div>
            )}
          </div>

          <div className="nn-grid">
            {loading ? (
              // Skeleton cards
              Array.from({ length: 6 }).map((_, i) => (
                <div className="nn-skeleton" key={i}>
                  <div className="nn-skel-line" style={{ width: "40px", height: "40px", borderRadius: "12px", marginBottom: "16px" }} />
                  <div className="nn-skel-line" style={{ width: "70%", height: "14px" }} />
                  <div className="nn-skel-line" style={{ width: "50%", height: "10px" }} />
                  <div className="nn-skel-line" style={{ width: "30%", height: "10px", marginTop: "16px" }} />
                </div>
              ))
            ) : hotels.length === 0 ? (
              <div className="nn-empty">
                <div className="nn-empty-icon">🏨</div>
                <div className="nn-empty-title">No hotels found</div>
                <div className="nn-empty-sub">
                  Try a different search or explore all available properties.
                </div>
                <button className="nn-empty-btn" onClick={() => { setQuery(""); fetchHotels(); }}>
                  Clear Search
                </button>
              </div>
            ) : (
              hotels.map((hotel, idx) => (
                <div
                  key={hotel._id}
                  className="nn-hotel-card"
                  style={{ animationDelay: `${idx * 0.06}s` }}
                  onClick={() => navigate(`/hotel/${hotel._id}`)}
                >
                  <div className="nn-hotel-card-top">
                    <div className="nn-hotel-icon">🏨</div>
                    <div
                      className="nn-hotel-rating-badge"
                      style={{
                        color: getRatingColor(hotel.averageRating),
                        borderColor: `${getRatingColor(hotel.averageRating)}30`,
                      }}
                    >
                      <span className="nn-hotel-rating-star">★</span>
                      {hotel.averageRating > 0
                        ? hotel.averageRating.toFixed(1)
                        : "New"}
                    </div>
                  </div>

                  <div className="nn-hotel-name">{hotel.name}</div>
                  <div className="nn-hotel-location">
                    <div className="nn-hotel-loc-dot" />
                    {hotel.location || "Location unavailable"}
                  </div>

                  <div className="nn-hotel-footer">
                    <div className="nn-hotel-tag">
                      {hotel.averageRating > 0 ? "Reviewed" : "Be first"}
                    </div>
                    <div className="nn-hotel-arrow">→</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="nn-footer">
          <div className="nn-footer-text">
            <em>NestNarrate</em> · Every stay has a story · 2025
          </div>
        </footer>

      </div>
    </>
  );
}