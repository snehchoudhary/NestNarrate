// import { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";
// import API from "../services/api";
// import HotelCard from "../components/HotelCard";

// export default function SearchResults() {
//   const [results, setResults] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const query = new URLSearchParams(useLocation().search).get("q");

//   useEffect(() => {
//     const fetchResults = async () => {
//       if (!query) return;

//       try {
//         setLoading(true);
//         setError("");

//         const res = await API.post("/search", { query });
//         setResults(res.data);
//       } catch (err) {
//         console.error(err);
//         setError("Failed to fetch results");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchResults();
//   }, [query]);

//   // ✅ Loading UI
//   if (loading) return <p className="p-6">Loading results...</p>;

//   // ✅ Error UI
//   if (error) return <p className="p-6 text-red-500">{error}</p>;

//   return (
//     <div className="p-6">
//       <h2 className="text-xl mb-4">Results for "{query}"</h2>

//       {results.length === 0 ? (
//         <p>No results found</p>
//       ) : (
//         <div className="grid gap-4">
//           {results.map((r) => (
//             <HotelCard key={r._id} review={r} />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }


import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import API from "../services/api";
import HotelCard from "../components/HotelCard";

/* ─────────────────────────────────────────────
   STYLES
───────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');

  .sr-root {
    min-height: 100vh;
    background: #080a0f;
    font-family: 'DM Sans', sans-serif;
    color: rgba(255,255,255,0.88);
    position: relative;
    overflow-x: hidden;
  }

  .sr-root::before {
    content: '';
    position: fixed;
    inset: 0;
    background:
      radial-gradient(ellipse 55% 35% at 80% 5%,  rgba(99,66,255,0.10)  0%, transparent 65%),
      radial-gradient(ellipse 45% 30% at 10% 80%, rgba(59,130,246,0.08)  0%, transparent 60%),
      radial-gradient(ellipse 40% 30% at 50% 98%, rgba(20,184,150,0.05)  0%, transparent 60%);
    pointer-events: none;
    z-index: 0;
  }

  .sr-root::after {
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

  .sr-inner {
    position: relative;
    z-index: 1;
    max-width: 1000px;
    margin: 0 auto;
    padding: 2.5rem 1.5rem 5rem;
  }

  /* ── Header ── */
  .sr-header {
    margin-bottom: 2.5rem;
    animation: srFadeUp 0.5s cubic-bezier(0.22,1,0.36,1) both;
  }

  .sr-breadcrumb {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: rgba(255,255,255,0.28);
    margin-bottom: 1rem;
    letter-spacing: 0.3px;
  }

  .sr-breadcrumb-link {
    cursor: pointer;
    transition: color 0.2s;
  }
  .sr-breadcrumb-link:hover { color: rgba(255,255,255,0.6); }

  .sr-title {
    font-family: 'Instrument Serif', serif;
    font-size: clamp(1.8rem, 4vw, 2.6rem);
    font-weight: 400;
    color: #fff;
    margin: 0 0 0.4rem;
    letter-spacing: -0.5px;
    line-height: 1.2;
  }

  .sr-title em {
    font-style: italic;
    background: linear-gradient(90deg, #a78bfa, #60a5fa);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .sr-meta-row {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
    margin-top: 0.5rem;
  }

  .sr-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 4px 12px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 500;
    border: 1px solid;
  }

  .sr-badge-purple {
    background: rgba(99,66,255,0.12);
    border-color: rgba(99,66,255,0.3);
    color: #a78bfa;
  }

  .sr-badge-blue {
    background: rgba(59,130,246,0.1);
    border-color: rgba(59,130,246,0.28);
    color: #60a5fa;
  }

  .sr-badge-teal {
    background: rgba(20,184,150,0.1);
    border-color: rgba(20,184,150,0.28);
    color: #34d9a5;
  }

  /* ── Search bar (re-search) ── */
  .sr-searchbar-wrap {
    margin-bottom: 2rem;
    animation: srFadeUp 0.5s cubic-bezier(0.22,1,0.36,1) 0.05s both;
  }

  .sr-searchbar {
    display: flex;
    align-items: center;
    gap: 0;
    background: rgba(13,15,22,0.82);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 14px;
    padding: 4px 4px 4px 16px;
    backdrop-filter: blur(20px);
    box-shadow: 0 0 0 1px rgba(255,255,255,0.03) inset, 0 12px 40px rgba(0,0,0,0.35);
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .sr-searchbar:focus-within {
    border-color: rgba(99,66,255,0.45);
    box-shadow: 0 0 0 3px rgba(99,66,255,0.1), 0 12px 40px rgba(0,0,0,0.35);
  }

  .sr-searchbar-icon {
    color: rgba(255,255,255,0.25);
    display: flex;
    align-items: center;
    margin-right: 10px;
    flex-shrink: 0;
    transition: color 0.2s;
  }

  .sr-searchbar:focus-within .sr-searchbar-icon {
    color: rgba(99,66,255,0.7);
  }

  .sr-searchbar-input {
    flex: 1;
    background: none;
    border: none;
    outline: none;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 400;
    color: rgba(255,255,255,0.88);
    padding: 10px 0;
    min-width: 0;
  }

  .sr-searchbar-input::placeholder { color: rgba(255,255,255,0.2); }

  .sr-searchbar-btn {
    padding: 9px 20px;
    background: linear-gradient(135deg, #6342ff 0%, #4a7bff 100%);
    border: none;
    border-radius: 10px;
    color: #fff;
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 500;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.15s;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .sr-searchbar-btn:hover { opacity: 0.88; transform: translateY(-1px); }
  .sr-searchbar-btn:active { transform: translateY(0); }
  .sr-searchbar-btn:disabled { opacity: 0.45; cursor: not-allowed; }

  /* ── Filter / sort row ── */
  .sr-filter-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
    animation: srFadeUp 0.5s cubic-bezier(0.22,1,0.36,1) 0.08s both;
  }

  .sr-filter-tabs {
    display: flex;
    gap: 6px;
  }

  .sr-filter-tab {
    padding: 6px 14px;
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.07);
    background: rgba(255,255,255,0.03);
    font-size: 12px;
    font-weight: 500;
    color: rgba(255,255,255,0.38);
    cursor: pointer;
    transition: all 0.2s;
    font-family: 'DM Sans', sans-serif;
  }

  .sr-filter-tab:hover {
    background: rgba(255,255,255,0.06);
    color: rgba(255,255,255,0.65);
  }

  .sr-filter-tab.active {
    background: rgba(99,66,255,0.15);
    border-color: rgba(99,66,255,0.35);
    color: #a78bfa;
  }

  .sr-sort-select {
    background: rgba(13,15,22,0.8);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 8px;
    padding: 6px 12px;
    font-size: 12px;
    font-family: 'DM Sans', sans-serif;
    color: rgba(255,255,255,0.45);
    outline: none;
    cursor: pointer;
    appearance: none;
    padding-right: 28px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='rgba(255,255,255,0.3)' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 10px center;
  }

  /* ── Skeleton loader ── */
  .sr-skeleton-list {
    display: grid;
    gap: 12px;
  }

  .sr-skel-card {
    background: rgba(13,15,22,0.82);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 14px;
    padding: 1.5rem;
    display: flex;
    gap: 1rem;
  }

  .sr-skel-block {
    border-radius: 8px;
    background: linear-gradient(90deg,
      rgba(255,255,255,0.04) 25%,
      rgba(255,255,255,0.08) 50%,
      rgba(255,255,255,0.04) 75%
    );
    background-size: 200% 100%;
    animation: srShimmer 1.4s infinite;
  }

  @keyframes srShimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  /* ── Results list ── */
  .sr-list {
    display: grid;
    gap: 12px;
  }

  .sr-result-item {
    animation: srFadeUp 0.45s cubic-bezier(0.22,1,0.36,1) both;
  }

  /* ── Empty state ── */
  .sr-empty {
    animation: srFadeUp 0.5s cubic-bezier(0.22,1,0.36,1) both;
    text-align: center;
    padding: 4rem 2rem;
    background: rgba(13,15,22,0.82);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 16px;
    backdrop-filter: blur(20px);
  }

  .sr-empty-icon {
    width: 52px;
    height: 52px;
    background: rgba(99,66,255,0.1);
    border: 1px solid rgba(99,66,255,0.2);
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1.25rem;
    color: #a78bfa;
  }

  .sr-empty-title {
    font-family: 'Instrument Serif', serif;
    font-size: 1.4rem;
    font-weight: 400;
    color: #fff;
    margin: 0 0 0.5rem;
    letter-spacing: -0.3px;
  }

  .sr-empty-sub {
    font-size: 13px;
    color: rgba(255,255,255,0.3);
    font-weight: 300;
    margin: 0;
    line-height: 1.7;
  }

  /* ── Error state ── */
  .sr-error {
    animation: srFadeUp 0.5s cubic-bezier(0.22,1,0.36,1) both;
    display: flex;
    align-items: flex-start;
    gap: 12px;
    background: rgba(220,60,60,0.08);
    border: 1px solid rgba(220,60,60,0.22);
    border-radius: 14px;
    padding: 1.5rem;
    color: #f87171;
    font-size: 14px;
    backdrop-filter: blur(20px);
  }

  .sr-error-icon { flex-shrink: 0; margin-top: 1px; }
  .sr-error-title { font-weight: 500; margin-bottom: 4px; }
  .sr-error-sub { font-size: 12px; color: rgba(248,113,113,0.65); font-weight: 300; }

  /* ── Result count chip ── */
  .sr-count-chip {
    font-size: 12px;
    color: rgba(255,255,255,0.3);
    font-weight: 300;
  }

  .sr-count-chip strong {
    color: rgba(255,255,255,0.65);
    font-weight: 500;
  }

  /* ── Divider ── */
  .sr-divider {
    height: 1px;
    background: rgba(255,255,255,0.06);
    margin: 2rem 0;
  }

  @keyframes srFadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 600px) {
    .sr-filter-tabs { display: none; }
    .sr-title { font-size: 1.6rem; }
  }
`;

/* ─────────────────────────────────────────────
   ICONS
───────────────────────────────────────────── */
const SearchIcon = ({ size = 17 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const AlertIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

const EmptyIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    <line x1="8" y1="11" x2="14" y2="11"/>
  </svg>
);

const SpinnerIcon = () => (
  <div style={{
    width: 15, height: 15,
    border: "2px solid rgba(255,255,255,0.25)",
    borderTopColor: "#fff",
    borderRadius: "50%",
    animation: "srSpin 0.65s linear infinite",
    display: "inline-block",
  }} />
);

/* ─────────────────────────────────────────────
   SORT HELPERS
───────────────────────────────────────────── */
const SORT_OPTIONS = [
  { value: "relevance", label: "Most Relevant" },
  { value: "rating_desc", label: "Highest Rated" },
  { value: "rating_asc",  label: "Lowest Rated"  },
  { value: "newest",      label: "Newest First"  },
];

const FILTER_TABS = ["All", "Hotels", "Reviews", "Locations"];

function sortResults(results, sort) {
  const arr = [...results];
  if (sort === "rating_desc") return arr.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
  if (sort === "rating_asc")  return arr.sort((a, b) => (a.rating ?? 0) - (b.rating ?? 0));
  if (sort === "newest")      return arr.sort((a, b) => new Date(b.createdAt ?? 0) - new Date(a.createdAt ?? 0));
  return arr; // relevance = original order
}

/* ─────────────────────────────────────────────
   SKELETON
───────────────────────────────────────────── */
function SkeletonCard({ delay = 0 }) {
  return (
    <div className="sr-skel-card" style={{ animationDelay: `${delay}s` }}>
      <div className="sr-skel-block" style={{ width: 52, height: 52, borderRadius: 12, flexShrink: 0 }} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
        <div className="sr-skel-block" style={{ height: 16, width: "55%" }} />
        <div className="sr-skel-block" style={{ height: 12, width: "80%" }} />
        <div className="sr-skel-block" style={{ height: 12, width: "40%" }} />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function SearchResults() {
  const [results, setResults]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [sort, setSort]           = useState("relevance");
  const [activeTab, setActiveTab] = useState("All");
  const [inputVal, setInputVal]   = useState("");

  const location = useLocation();
  const query    = new URLSearchParams(location.search).get("q") || "";
  const inputRef = useRef(null);

  /* Sync input with URL query */
  useEffect(() => { setInputVal(query); }, [query]);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
      try {
        setLoading(true);
        setError("");
        const res = await API.post("/search", { query });
        setResults(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch results. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [query]);

  /* Re-search handler */
  const handleSearch = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    window.location.href = `/search?q=${encodeURIComponent(inputVal.trim())}`;
  };

  const sorted   = sortResults(results, sort);
  const elapsed  = loading ? null : results.length;

  return (
    <>
      <style>{`
        ${styles}
        @keyframes srSpin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="sr-root">
        <div className="sr-inner">

          {/* ── Header ── */}
          <div className="sr-header">
            <div className="sr-breadcrumb">
              <span className="sr-breadcrumb-link" onClick={() => window.history.back()}>Hotels</span>
              <span style={{ opacity: 0.3 }}>›</span>
              <span style={{ color: "rgba(255,255,255,0.55)" }}>Search</span>
            </div>

            <h1 className="sr-title">
              Results for{" "}
              <em>"{query || "…"}"</em>
            </h1>

            <div className="sr-meta-row">
              {!loading && !error && (
                <div className="sr-badge sr-badge-purple">
                  {results.length} result{results.length !== 1 ? "s" : ""}
                </div>
              )}
              {loading && (
                <div className="sr-badge sr-badge-blue">
                  <SpinnerIcon /> Searching…
                </div>
              )}
              {!loading && !error && results.length > 0 && (
                <div className="sr-badge sr-badge-teal">
                  AI-powered semantic search
                </div>
              )}
            </div>
          </div>

          {/* ── Search Bar ── */}
          <div className="sr-searchbar-wrap">
            <form className="sr-searchbar" onSubmit={handleSearch}>
              <span className="sr-searchbar-icon"><SearchIcon /></span>
              <input
                ref={inputRef}
                className="sr-searchbar-input"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Search hotels, locations, reviews…"
                autoComplete="off"
              />
              <button
                type="submit"
                className="sr-searchbar-btn"
                disabled={loading || !inputVal.trim()}
              >
                {loading ? <SpinnerIcon /> : "Search"}
              </button>
            </form>
          </div>

          {/* ── Filter / Sort Row ── */}
          {!loading && !error && (
            <div className="sr-filter-row">
              <div className="sr-filter-tabs">
                {FILTER_TABS.map((tab) => (
                  <button
                    key={tab}
                    className={`sr-filter-tab ${activeTab === tab ? "active" : ""}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span className="sr-count-chip">
                  <strong>{results.length}</strong> found
                </span>
                <select
                  className="sr-sort-select"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* ── Loading skeleton ── */}
          {loading && (
            <div className="sr-skeleton-list">
              {[0, 0.08, 0.16, 0.24].map((delay, i) => (
                <SkeletonCard key={i} delay={delay} />
              ))}
            </div>
          )}

          {/* ── Error state ── */}
          {!loading && error && (
            <div className="sr-error">
              <span className="sr-error-icon"><AlertIcon /></span>
              <div>
                <div className="sr-error-title">{error}</div>
                <div className="sr-error-sub">
                  Check your connection or try a different search term.
                </div>
              </div>
            </div>
          )}

          {/* ── Empty state ── */}
          {!loading && !error && results.length === 0 && (
            <div className="sr-empty">
              <div className="sr-empty-icon"><EmptyIcon /></div>
              <h2 className="sr-empty-title">No results found</h2>
              <p className="sr-empty-sub">
                We couldn't find anything matching <strong style={{ color: "rgba(255,255,255,0.6)" }}>"{query}"</strong>.<br />
                Try different keywords or check for typos.
              </p>
            </div>
          )}

          {/* ── Results list ── */}
          {!loading && !error && sorted.length > 0 && (
            <div className="sr-list">
              {sorted.map((r, i) => (
                <div
                  key={r._id}
                  className="sr-result-item"
                  style={{ animationDelay: `${i * 0.045}s` }}
                >
                  <HotelCard review={r} />
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </>
  );
}