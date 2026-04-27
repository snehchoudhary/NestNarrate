// import { useState, useEffect } from "react";
// import API from "../services/api"

// export default function Dashboard() {
//   const [savedHotels] = useState([]);
//   const [recentSearches] = useState([]);
//   const [wishlist, setWishlist] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchWishlist = async() => {
//       try {
//         const res = await API.get("/user/wishlist");
//         setWishlist(res.data);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchWishlist();
//   },[]);

//   if (loading) return <p>Loading...</p>;

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

//       {/* Saved Hotels */}
//       <h2 className="font-semibold mt-4">Saved Hotels</h2>

//       {wishlist.length === 0 ? (
//         <p>No saved hotels</p>
//       ) : (
//         <div className="grid gap-4">
//            {wishlist.map((hotel) => (
//             <div key={hotel._id} className="border p-4 rounded">
//               <h3 className="font-bold">{hotel.name}</h3>
//               <p>{hotel.location}</p>
//             </div>
//            ))}
//         </div>
//       )}
    

//       {/* Recent Searches */}
//       <h2 className="font-semibold mt-4">Recent Searches</h2>
//       <div className="border p-4">
//         {recentSearches.length === 0 ? (
//           <p>No searches yet</p>
//         ) : (
//           recentSearches.map((s, i) => <p key={i}>{s}</p>)
//         )}
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

const QUICK_STATS = [
  { label: "Stays Reviewed",  value: "12",  icon: "✦",  suffix: "" },
  { label: "Wishlist Hotels", value: "—",   icon: "♡",  suffix: "", dynamic: "wishlist" },
  { label: "Cities Explored", value: "7",   icon: "◎",  suffix: "" },
  { label: "Traveler Rank",   value: "Gold", icon: "◈", suffix: "" },
];

const RECENT_SEARCHES_MOCK = [];

export default function Dashboard() {
  const [wishlist, setWishlist]           = useState([]);
  const [recentSearches]                  = useState(RECENT_SEARCHES_MOCK);
  const [loading, setLoading]             = useState(true);
  const [mounted, setMounted]             = useState(false);
  const [activeTab, setActiveTab]         = useState("wishlist");
  const [removingId, setRemovingId]       = useState(null);
  const canvasRef                         = useRef(null);
  const navigate                          = useNavigate();

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await API.get("/user/wishlist");
        setWishlist(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
        setTimeout(() => setMounted(true), 60);
      }
    };
    fetchWishlist();
  }, []);

  // Subtle canvas: floating dot grid for header
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

    const draw = () => {
      const w = canvas.width, h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const cols = 20, rows = 6;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x    = (w / cols) * c + w / (cols * 2);
          const y    = (h / rows) * r + h / (rows * 2);
          const wave = Math.sin(t * 0.4 + r * 0.5 + c * 0.35) * 0.5 + 0.5;
          ctx.beginPath();
          ctx.arc(x, y, 1.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(212,175,55,${wave * 0.18})`;
          ctx.fill();
        }
      }

      t += 0.015;
      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);

  const stats = QUICK_STATS.map((s) =>
    s.dynamic === "wishlist" ? { ...s, value: loading ? "—" : String(wishlist.length) } : s
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .nn-dash {
          min-height: 100vh;
          background: #08090d;
          font-family: 'DM Sans', sans-serif;
          color: #fff;
          position: relative;
          overflow-x: hidden;
        }

        /* ── AMBIENT BACKGROUND ── */
        .nn-dash-bg {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
        }

        .nn-dash-bg::before {
          content: '';
          position: absolute;
          top: -200px; right: -200px;
          width: 700px; height: 700px;
          background: radial-gradient(circle, rgba(212,175,55,0.04) 0%, transparent 65%);
        }

        .nn-dash-bg::after {
          content: '';
          position: absolute;
          bottom: -150px; left: -150px;
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(59,130,246,0.03) 0%, transparent 65%);
        }

        .nn-particles { position: fixed; inset: 0; pointer-events: none; overflow: hidden; z-index: 0; }

        .nn-particle {
          position: absolute;
          border-radius: 50%;
          background: rgba(212,175,55,0.3);
          animation: floatUp linear infinite;
        }

        @keyframes floatUp {
          0%   { transform: translateY(100vh) scale(0); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 0.3; }
          100% { transform: translateY(-10vh) scale(1); opacity: 0; }
        }

        /* ── LAYOUT ── */
        .nn-dash-inner {
          position: relative;
          z-index: 1;
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 32px 80px;
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }

        .nn-dash-inner.mounted { opacity: 1; transform: translateY(0); }

        /* ── HEADER ── */
        .nn-header {
          position: relative;
          padding: 48px 0 40px;
          overflow: hidden;
        }

        .nn-header-canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          opacity: 0.7;
        }

        .nn-header-top {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
        }

        .nn-logo {
          font-family: 'Cormorant Garamond', serif;
          font-size: 28px;
          font-weight: 300;
          letter-spacing: 2px;
          color: #fff;
          cursor: pointer;
        }

        .nn-logo em { font-style: italic; color: #d4af37; }

        .nn-header-actions { display: flex; align-items: center; gap: 12px; }

        .nn-nav-btn {
          padding: 9px 18px;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03);
          color: rgba(255,255,255,0.45);
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s;
        }

        .nn-nav-btn:hover {
          border-color: rgba(255,255,255,0.15);
          color: rgba(255,255,255,0.75);
          background: rgba(255,255,255,0.05);
        }

        .nn-nav-btn.gold {
          background: linear-gradient(135deg, #d4af37, #c9a227);
          border-color: transparent;
          color: #0b0d13;
          font-weight: 500;
        }

        .nn-nav-btn.gold:hover {
          box-shadow: 0 4px 20px rgba(212,175,55,0.3);
          transform: translateY(-1px);
        }

        .nn-greeting {
          position: relative;
          z-index: 1;
          margin-top: 36px;
        }

        .nn-greeting-eyebrow {
          font-size: 11px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: rgba(212,175,55,0.6);
          margin-bottom: 8px;
          font-weight: 300;
        }

        .nn-greeting-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 52px;
          font-weight: 300;
          color: #fff;
          line-height: 1.05;
          letter-spacing: -1px;
        }

        .nn-greeting-title em { font-style: italic; color: #d4af37; }

        .nn-greeting-sub {
          font-size: 13px;
          color: rgba(255,255,255,0.3);
          margin-top: 10px;
          font-weight: 300;
          letter-spacing: 0.3px;
        }

        .nn-divider-line {
          height: 1px;
          background: linear-gradient(90deg, rgba(212,175,55,0.2) 0%, transparent 60%);
          margin: 32px 0;
        }

        /* ── STATS ROW ── */
        .nn-stats-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 40px;
        }

        @media (max-width: 768px) {
          .nn-stats-row { grid-template-columns: 1fr 1fr; }
          .nn-greeting-title { font-size: 36px; }
          .nn-dash-inner { padding: 0 20px 60px; }
        }

        .nn-stat-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          padding: 20px 22px;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
          animation: fadeSlideUp 0.6s ease both;
        }

        .nn-stat-card:nth-child(1) { animation-delay: 0.05s; }
        .nn-stat-card:nth-child(2) { animation-delay: 0.12s; }
        .nn-stat-card:nth-child(3) { animation-delay: 0.19s; }
        .nn-stat-card:nth-child(4) { animation-delay: 0.26s; }

        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .nn-stat-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(212,175,55,0.3), transparent);
          opacity: 0;
          transition: opacity 0.3s;
        }

        .nn-stat-card:hover { border-color: rgba(212,175,55,0.2); background: rgba(212,175,55,0.03); }
        .nn-stat-card:hover::before { opacity: 1; }

        .nn-stat-icon {
          font-size: 16px;
          color: rgba(212,175,55,0.5);
          margin-bottom: 12px;
        }

        .nn-stat-value {
          font-family: 'Cormorant Garamond', serif;
          font-size: 36px;
          font-weight: 300;
          color: #fff;
          line-height: 1;
          margin-bottom: 4px;
        }

        .nn-stat-label {
          font-size: 10px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.25);
          font-weight: 300;
        }

        /* ── TABS ── */
        .nn-tabs {
          display: flex;
          gap: 4px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px;
          padding: 4px;
          margin-bottom: 28px;
          width: fit-content;
        }

        .nn-tab {
          padding: 10px 22px;
          border-radius: 9px;
          border: none;
          background: transparent;
          color: rgba(255,255,255,0.3);
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.25s ease;
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .nn-tab.active {
          background: rgba(212,175,55,0.1);
          border: 1px solid rgba(212,175,55,0.25);
          color: #d4af37;
        }

        .nn-tab-count {
          background: rgba(212,175,55,0.15);
          color: rgba(212,175,55,0.8);
          font-size: 9px;
          padding: 1px 6px;
          border-radius: 10px;
          font-weight: 500;
          letter-spacing: 0;
        }

        .nn-tab.active .nn-tab-count {
          background: rgba(212,175,55,0.25);
          color: #d4af37;
        }

        /* ── SECTION HEADER ── */
        .nn-section-head {
          display: flex;
          align-items: baseline;
          gap: 12px;
          margin-bottom: 20px;
        }

        .nn-section-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 26px;
          font-weight: 300;
          color: #fff;
          letter-spacing: -0.3px;
        }

        .nn-section-sub {
          font-size: 11px;
          color: rgba(255,255,255,0.2);
          letter-spacing: 0.3px;
        }

        /* ── WISHLIST GRID ── */
        .nn-wishlist-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 16px;
        }

        .nn-hotel-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          padding: 22px;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
          cursor: pointer;
          animation: fadeSlideUp 0.5s ease both;
        }

        .nn-hotel-card::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(212,175,55,0.25), transparent);
          opacity: 0;
          transition: opacity 0.3s;
        }

        .nn-hotel-card:hover {
          border-color: rgba(212,175,55,0.2);
          background: rgba(212,175,55,0.03);
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.4);
        }

        .nn-hotel-card:hover::after { opacity: 1; }

        .nn-hotel-card-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 14px;
        }

        .nn-hotel-icon {
          width: 40px; height: 40px;
          border-radius: 10px;
          background: linear-gradient(135deg, rgba(212,175,55,0.15), rgba(212,175,55,0.05));
          border: 1px solid rgba(212,175,55,0.2);
          display: flex; align-items: center; justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
        }

        .nn-hotel-remove {
          width: 28px; height: 28px;
          border-radius: 7px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.2);
          font-size: 13px;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .nn-hotel-remove:hover {
          background: rgba(239,68,68,0.1);
          border-color: rgba(239,68,68,0.25);
          color: rgba(239,68,68,0.7);
        }

        .nn-hotel-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 19px;
          font-weight: 400;
          color: #fff;
          margin-bottom: 5px;
          line-height: 1.2;
        }

        .nn-hotel-location {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 12px;
          color: rgba(255,255,255,0.3);
          font-weight: 300;
        }

        .nn-hotel-location-dot {
          width: 4px; height: 4px;
          border-radius: 50%;
          background: rgba(212,175,55,0.5);
          flex-shrink: 0;
        }

        .nn-hotel-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 16px;
          padding-top: 14px;
          border-top: 1px solid rgba(255,255,255,0.05);
        }

        .nn-hotel-tag {
          font-size: 9px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: rgba(212,175,55,0.5);
          background: rgba(212,175,55,0.07);
          border: 1px solid rgba(212,175,55,0.15);
          padding: 3px 8px;
          border-radius: 20px;
        }

        .nn-hotel-arrow {
          font-size: 13px;
          color: rgba(255,255,255,0.15);
          transition: all 0.2s;
        }

        .nn-hotel-card:hover .nn-hotel-arrow { color: #d4af37; transform: translateX(3px); }

        /* ── EMPTY STATE ── */
        .nn-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 64px 32px;
          text-align: center;
          background: rgba(255,255,255,0.02);
          border: 1px dashed rgba(255,255,255,0.07);
          border-radius: 16px;
        }

        .nn-empty-icon {
          font-size: 40px;
          margin-bottom: 16px;
          opacity: 0.4;
        }

        .nn-empty-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px;
          font-weight: 300;
          font-style: italic;
          color: rgba(255,255,255,0.5);
          margin-bottom: 8px;
        }

        .nn-empty-sub {
          font-size: 12px;
          color: rgba(255,255,255,0.2);
          font-weight: 300;
          line-height: 1.7;
          max-width: 260px;
        }

        .nn-empty-btn {
          margin-top: 24px;
          padding: 11px 24px;
          border-radius: 9px;
          border: 1px solid rgba(212,175,55,0.3);
          background: rgba(212,175,55,0.07);
          color: #d4af37;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s;
        }

        .nn-empty-btn:hover {
          background: rgba(212,175,55,0.12);
          box-shadow: 0 4px 20px rgba(212,175,55,0.15);
        }

        /* ── RECENT SEARCHES ── */
        .nn-searches-list { display: flex; flex-direction: column; gap: 10px; }

        .nn-search-row {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 18px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px;
          transition: all 0.2s;
          cursor: pointer;
          animation: fadeSlideUp 0.4s ease both;
        }

        .nn-search-row:hover {
          border-color: rgba(212,175,55,0.15);
          background: rgba(212,175,55,0.03);
        }

        .nn-search-icon {
          width: 32px; height: 32px;
          border-radius: 8px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.06);
          display: flex; align-items: center; justify-content: center;
          font-size: 13px;
          color: rgba(212,175,55,0.5);
          flex-shrink: 0;
        }

        .nn-search-text { flex: 1; font-size: 13px; color: rgba(255,255,255,0.5); font-weight: 300; }
        .nn-search-time { font-size: 10px; color: rgba(255,255,255,0.15); letter-spacing: 0.3px; }

        /* ── LOADING ── */
        .nn-loading {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #08090d;
          gap: 20px;
        }

        .nn-loading-logo {
          font-family: 'Cormorant Garamond', serif;
          font-size: 32px;
          font-weight: 300;
          letter-spacing: 3px;
          color: #fff;
        }

        .nn-loading-logo em { color: #d4af37; font-style: italic; }

        .nn-loading-bar {
          width: 120px; height: 1px;
          background: rgba(255,255,255,0.06);
          border-radius: 1px;
          overflow: hidden;
          position: relative;
        }

        .nn-loading-bar::after {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, #d4af37, transparent);
          animation: shimmer 1.4s ease infinite;
        }

        @keyframes shimmer {
          to { left: 200%; }
        }

        .nn-loading-text {
          font-size: 11px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.2);
          font-weight: 300;
        }
      `}</style>

      {loading ? (
        <div className="nn-loading">
          <div className="nn-loading-logo">Nest<em>Narrate</em></div>
          <div className="nn-loading-bar" />
          <div className="nn-loading-text">Loading your journey</div>
        </div>
      ) : (
        <div className="nn-dash">
          {/* Ambient BG */}
          <div className="nn-dash-bg" />

          {/* Floating particles */}
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

          <div className={`nn-dash-inner ${mounted ? "mounted" : ""}`}>

            {/* ── HEADER ── */}
            <div className="nn-header">
              <canvas ref={canvasRef} className="nn-header-canvas" />

              <div className="nn-header-top">
                <div className="nn-logo" onClick={() => navigate("/home")}>
                  Nest<em>Narrate</em>
                </div>
                <div className="nn-header-actions">
                  <button className="nn-nav-btn" onClick={() => navigate("/home")}>Explore</button>
                  <button className="nn-nav-btn" onClick={() => navigate("/write-review")}>Write Review</button>
                  <button
                    className="nn-nav-btn gold"
                    onClick={() => { localStorage.removeItem("token"); navigate("/login"); }}
                  >
                    Sign Out
                  </button>
                </div>
              </div>

              <div className="nn-greeting">
                <div className="nn-greeting-eyebrow">Your Travel Hub</div>
                <div className="nn-greeting-title">
                  Welcome back,<br /><em>Explorer</em>
                </div>
                <div className="nn-greeting-sub">
                  Here's a snapshot of your journeys and saved stays.
                </div>
              </div>
            </div>

            <div className="nn-divider-line" />

            {/* ── STATS ── */}
            <div className="nn-stats-row">
              {stats.map((s, i) => (
                <div className="nn-stat-card" key={i}>
                  <div className="nn-stat-icon">{s.icon}</div>
                  <div className="nn-stat-value">{s.value}</div>
                  <div className="nn-stat-label">{s.label}</div>
                </div>
              ))}
            </div>

            {/* ── TABS ── */}
            <div className="nn-tabs">
              <button
                className={`nn-tab ${activeTab === "wishlist" ? "active" : ""}`}
                onClick={() => setActiveTab("wishlist")}
              >
                ♡ Saved Hotels
                <span className="nn-tab-count">{wishlist.length}</span>
              </button>
              <button
                className={`nn-tab ${activeTab === "searches" ? "active" : ""}`}
                onClick={() => setActiveTab("searches")}
              >
                ◎ Recent Searches
                <span className="nn-tab-count">{recentSearches.length}</span>
              </button>
            </div>

            {/* ── WISHLIST TAB ── */}
            {activeTab === "wishlist" && (
              <>
                <div className="nn-section-head">
                  <div className="nn-section-title">Saved Hotels</div>
                  <div className="nn-section-sub">
                    {wishlist.length > 0 ? `${wishlist.length} properties saved` : "No saves yet"}
                  </div>
                </div>

                {wishlist.length === 0 ? (
                  <div className="nn-empty">
                    <div className="nn-empty-icon">♡</div>
                    <div className="nn-empty-title">Your wishlist is empty</div>
                    <div className="nn-empty-sub">
                      Explore hotels and save your favourites to plan your next stay.
                    </div>
                    <button className="nn-empty-btn" onClick={() => navigate("/home")}>
                      Discover Hotels
                    </button>
                  </div>
                ) : (
                  <div className="nn-wishlist-grid">
                    {wishlist.map((hotel, idx) => (
                      <div
                        className="nn-hotel-card"
                        key={hotel._id}
                        style={{ animationDelay: `${idx * 0.06}s` }}
                        onClick={() => navigate(`/hotel/${hotel._id}`)}
                      >
                        <div className="nn-hotel-card-top">
                          <div className="nn-hotel-icon">🏨</div>
                          <button
                            className="nn-hotel-remove"
                            onClick={(e) => {
                              e.stopPropagation();
                              setRemovingId(hotel._id);
                              setTimeout(() => {
                                setWishlist((prev) => prev.filter((h) => h._id !== hotel._id));
                                setRemovingId(null);
                              }, 300);
                            }}
                          >
                            ✕
                          </button>
                        </div>

                        <div className="nn-hotel-name">{hotel.name}</div>
                        <div className="nn-hotel-location">
                          <div className="nn-hotel-location-dot" />
                          {hotel.location || "Location unavailable"}
                        </div>

                        <div className="nn-hotel-footer">
                          <div className="nn-hotel-tag">Saved</div>
                          <div className="nn-hotel-arrow">→</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* ── SEARCHES TAB ── */}
            {activeTab === "searches" && (
              <>
                <div className="nn-section-head">
                  <div className="nn-section-title">Recent Searches</div>
                  <div className="nn-section-sub">
                    {recentSearches.length > 0 ? `${recentSearches.length} searches` : "Nothing yet"}
                  </div>
                </div>

                {recentSearches.length === 0 ? (
                  <div className="nn-empty">
                    <div className="nn-empty-icon">◎</div>
                    <div className="nn-empty-title">No searches yet</div>
                    <div className="nn-empty-sub">
                      Start exploring hotels and your searches will appear here.
                    </div>
                    <button className="nn-empty-btn" onClick={() => navigate("/home")}>
                      Start Exploring
                    </button>
                  </div>
                ) : (
                  <div className="nn-searches-list">
                    {recentSearches.map((s, i) => (
                      <div className="nn-search-row" key={i} style={{ animationDelay: `${i * 0.05}s` }}>
                        <div className="nn-search-icon">◎</div>
                        <div className="nn-search-text">{s}</div>
                        <div className="nn-search-time">Recently</div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

          </div>
        </div>
      )}
    </>
  );
}