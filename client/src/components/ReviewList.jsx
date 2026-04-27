// export default function ReviewList({ reviews, query }) {

//   const escapeRegExp = (string) => {
//     return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
//   };

//   const highlight = (text) => {
//     if (!query) return text;

//     const safeQuery = escapeRegExp(query);
//     const regex = new RegExp(`(${safeQuery})`, "gi");

//     return text.replace(regex, `<mark>$1</mark>`);
//   };

//   // ✅ Empty state (correct place)
//   if (!reviews || reviews.length === 0) {
//     return <p className="text-gray-500">No reviews yet</p>;
//   }

//   return (
//     <div className="space-y-2">
//       {reviews.map((r) => (
//         <p
//           key={r._id}
//           dangerouslySetInnerHTML={{
//             __html: highlight(r.text),
//           }}
//         />
//       ))}
//     </div>
//   );
// }

export default function ReviewList({ reviews, query }) {

  const escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  };

  const highlight = (text) => {
    if (!query) return text;
    const safeQuery = escapeRegExp(query);
    const regex = new RegExp(`(${safeQuery})`, "gi");
    return text.replace(regex, `<mark class="rl-mark">$1</mark>`);
  };

  const starColor = (rating) => {
    if (rating >= 5) return "#d4af37";
    if (rating >= 4) return "#22c55e";
    if (rating >= 3) return "#eab308";
    if (rating >= 2) return "#f97316";
    return "#ef4444";
  };

  const starLabel = (rating) => {
    if (rating >= 5) return "Perfect";
    if (rating >= 4) return "Great";
    if (rating >= 3) return "Good";
    if (rating >= 2) return "Fair";
    return "Poor";
  };

  const getInitial = (name) =>
    name ? name.charAt(0).toUpperCase() : "?";

  if (!reviews || reviews.length === 0) {
    return (
      <>
        <style>{baseStyles}</style>
        <div className="rl-empty">
          <div className="rl-empty-icon">✦</div>
          <div className="rl-empty-title">No stories yet</div>
          <div className="rl-empty-sub">Be the first to share your experience at this property</div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{baseStyles}</style>

      <div className="rl-header">
        <span className="rl-count-badge">{reviews.length} {reviews.length === 1 ? "Review" : "Reviews"}</span>
        {query && (
          <span className="rl-query-tag">
            Searching: <em>"{query}"</em>
          </span>
        )}
      </div>

      <div className="rl-list">
        {reviews.map((r, idx) => (
          <div
            className="rl-card"
            key={r._id}
            style={{ animationDelay: `${idx * 0.06}s` }}
          >
            {/* Top row: avatar + meta + rating */}
            <div className="rl-card-top">
              <div className="rl-avatar">
                {getInitial(r.user?.name || r.author)}
              </div>

              <div className="rl-meta">
                <div className="rl-author">{r.user?.name || r.author || "Anonymous Traveler"}</div>
                <div className="rl-date">
                  {r.createdAt
                    ? new Date(r.createdAt).toLocaleDateString("en-US", {
                        month: "short", day: "numeric", year: "numeric",
                      })
                    : "Recent stay"}
                </div>
              </div>

              {r.rating && (
                <div className="rl-rating-wrap">
                  <div
                    className="rl-rating-badge"
                    style={{
                      color: starColor(r.rating),
                      borderColor: `${starColor(r.rating)}33`,
                      background: `${starColor(r.rating)}12`,
                    }}
                  >
                    <span className="rl-rating-star">★</span>
                    <span className="rl-rating-num">{r.rating}</span>
                  </div>
                  <div
                    className="rl-rating-label"
                    style={{ color: starColor(r.rating) }}
                  >
                    {starLabel(r.rating)}
                  </div>
                </div>
              )}
            </div>

            {/* Star strip */}
            {r.rating && (
              <div className="rl-stars">
                {[1,2,3,4,5].map((n) => (
                  <span
                    key={n}
                    className="rl-star"
                    style={{ color: n <= r.rating ? starColor(r.rating) : "rgba(255,255,255,0.1)" }}
                  >★</span>
                ))}
              </div>
            )}

            {/* Review text */}
            <div
              className="rl-text"
              dangerouslySetInnerHTML={{ __html: highlight(r.text) }}
            />

            {/* Bottom divider accent */}
            <div className="rl-card-footer">
              <div className="rl-footer-dot" />
              <span className="rl-footer-label">Verified Stay</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

const baseStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  /* ── Header row ── */
  .rl-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 1.25rem;
    flex-wrap: wrap;
  }

  .rl-count-badge {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: rgba(255,255,255,0.28);
    font-family: 'DM Sans', sans-serif;
    padding: 5px 12px;
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 999px;
    background: rgba(255,255,255,0.03);
  }

  .rl-query-tag {
    font-size: 12px;
    color: rgba(212,175,55,0.6);
    font-family: 'DM Sans', sans-serif;
    font-weight: 300;
    letter-spacing: 0.3px;
    padding: 5px 12px;
    border: 1px solid rgba(212,175,55,0.18);
    border-radius: 999px;
    background: rgba(212,175,55,0.05);
  }

  .rl-query-tag em {
    font-style: italic;
    color: #d4af37;
  }

  /* ── List ── */
  .rl-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  /* ── Card ── */
  .rl-card {
    background: rgba(13, 15, 22, 0.75);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 14px;
    padding: 1.25rem 1.5rem;
    backdrop-filter: blur(16px);
    box-shadow: 0 0 0 1px rgba(255,255,255,0.025) inset, 0 8px 32px rgba(0,0,0,0.3);
    transition: border-color 0.25s ease, box-shadow 0.25s ease, transform 0.2s ease;
    animation: rlFadeUp 0.45s cubic-bezier(0.22,1,0.36,1) both;
    position: relative;
    overflow: hidden;
  }

  .rl-card::before {
    content: '"';
    position: absolute;
    top: -8px; right: 16px;
    font-family: 'Cormorant Garamond', serif;
    font-size: 72px;
    color: rgba(212,175,55,0.06);
    line-height: 1;
    pointer-events: none;
  }

  .rl-card:hover {
    border-color: rgba(212,175,55,0.18);
    box-shadow: 0 0 0 1px rgba(212,175,55,0.06) inset, 0 12px 40px rgba(0,0,0,0.4);
    transform: translateY(-2px);
  }

  @keyframes rlFadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Card top row ── */
  .rl-card-top {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 10px;
  }

  .rl-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: linear-gradient(135deg, #d4af37, #8b6914);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 600;
    color: #0b0d13;
    flex-shrink: 0;
    font-family: 'DM Sans', sans-serif;
  }

  .rl-meta {
    flex: 1;
    min-width: 0;
  }

  .rl-author {
    font-size: 13px;
    font-weight: 500;
    color: rgba(255,255,255,0.75);
    font-family: 'DM Sans', sans-serif;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .rl-date {
    font-size: 11px;
    color: rgba(255,255,255,0.22);
    font-weight: 300;
    font-family: 'DM Sans', sans-serif;
    margin-top: 1px;
    letter-spacing: 0.3px;
  }

  .rl-rating-wrap {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 3px;
    flex-shrink: 0;
  }

  .rl-rating-badge {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 3px 10px;
    border-radius: 999px;
    border: 1px solid;
    font-family: 'DM Sans', sans-serif;
  }

  .rl-rating-star { font-size: 11px; }
  .rl-rating-num  { font-size: 13px; font-weight: 500; }

  .rl-rating-label {
    font-size: 10px;
    letter-spacing: 0.5px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 400;
    opacity: 0.7;
  }

  /* ── Star strip ── */
  .rl-stars {
    display: flex;
    gap: 3px;
    margin-bottom: 10px;
  }

  .rl-star {
    font-size: 13px;
    transition: color 0.2s;
  }

  /* ── Review text ── */
  .rl-text {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.05rem;
    font-weight: 300;
    font-style: italic;
    color: rgba(255,255,255,0.7);
    line-height: 1.7;
    letter-spacing: 0.2px;
  }

  /* highlight mark */
  .rl-mark {
    background: rgba(212,175,55,0.22);
    color: #d4af37;
    border-radius: 3px;
    padding: 0 3px;
    font-style: normal;
    font-weight: 500;
  }

  /* ── Card footer ── */
  .rl-card-footer {
    display: flex;
    align-items: center;
    gap: 7px;
    margin-top: 14px;
    padding-top: 12px;
    border-top: 1px solid rgba(255,255,255,0.05);
  }

  .rl-footer-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: rgba(212,175,55,0.35);
    flex-shrink: 0;
  }

  .rl-footer-label {
    font-size: 10px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: rgba(255,255,255,0.15);
    font-family: 'DM Sans', sans-serif;
    font-weight: 400;
  }

  /* ── Empty state ── */
  .rl-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem 2rem;
    background: rgba(13,15,22,0.6);
    border: 1px dashed rgba(255,255,255,0.08);
    border-radius: 16px;
    text-align: center;
    gap: 10px;
  }

  .rl-empty-icon {
    font-size: 28px;
    color: rgba(212,175,55,0.25);
    margin-bottom: 4px;
    line-height: 1;
  }

  .rl-empty-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.4rem;
    font-weight: 300;
    font-style: italic;
    color: rgba(255,255,255,0.35);
  }

  .rl-empty-sub {
    font-size: 12px;
    color: rgba(255,255,255,0.18);
    font-family: 'DM Sans', sans-serif;
    font-weight: 300;
    max-width: 260px;
    line-height: 1.6;
  }
`;