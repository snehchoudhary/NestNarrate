// import { useState } from "react";
// import API from "../services/api";
// import toast from "react-hot-toast";

// export default function ReviewForm({ hotelId, onReviewAdded }) {
//   const [rating, setRating] = useState(5);
//   const [text, setText] = useState("");
//   const [loading, setLoading] = useState(false);

//   const submitReview = async (e) => {
//     e.preventDefault();

//     if (!text.trim()) {
//       toast.error("Please write a review");
//       return;
//     }

//     try {
//       setLoading(true);

//       const token = localStorage.getItem("token");

//       const res = await API.post(
//         "/reviews",
//         { hotelId, rating, text },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       toast.success("Review added successfully!");

//       setText("");
//       setRating(5);

//       onReviewAdded(res.data);
//     } catch (error) {
//       toast.error(
//         error.response?.data?.message || "Failed to add review"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form
//       onSubmit={submitReview}
//       className="bg-white shadow-md rounded-xl p-6 mb-6"
//     >
//       <h2 className="text-2xl font-bold mb-4">Write a Review</h2>

//       <select
//         value={rating}
//         onChange={(e) => setRating(Number(e.target.value))}
//         className="w-full border p-3 rounded-lg mb-4"
//       >
//         {[1, 2, 3, 4, 5].map((num) => (
//           <option key={num} value={num}>
//             {num} Star{num > 1 ? "s" : ""}
//           </option>
//         ))}
//       </select>

//       <textarea
//         rows="4"
//         placeholder="Share your experience..."
//         value={text}
//         onChange={(e) => setText(e.target.value)}
//         className="w-full border p-3 rounded-lg mb-4"
//       />

//       <button
//         type="submit"
//         disabled={loading}
//         className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
//       >
//         {loading ? "Submitting..." : "Submit Review"}
//       </button>
//     </form>
//   );
// }

import { useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";

export default function ReviewForm({ hotelId, onReviewAdded }) {
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(null);
  const [hovered, setHovered] = useState(null);

  const submitReview = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      toast.error("Please write a review");
      return;
    }
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await API.post(
        "/reviews",
        { hotelId, rating, text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Review added successfully!");
      setText("");
      setRating(5);
      onReviewAdded(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add review");
    } finally {
      setLoading(false);
    }
  };

  const starLabels = ["", "Poor", "Fair", "Good", "Great", "Perfect"];
  const starColors = ["", "#ef4444", "#f97316", "#eab308", "#22c55e", "#d4af37"];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        .rf-wrap {
          background: rgba(13, 15, 22, 0.82);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 2rem;
          backdrop-filter: blur(20px);
          box-shadow: 0 0 0 1px rgba(255,255,255,0.03) inset, 0 20px 60px rgba(0,0,0,0.4);
          position: relative;
          overflow: hidden;
          font-family: 'DM Sans', sans-serif;
        }

        .rf-wrap::before {
          content: '';
          position: absolute;
          top: -100px; right: -100px;
          width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(212,175,55,0.05) 0%, transparent 70%);
          pointer-events: none;
        }

        /* ── Title ── */
        .rf-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.7rem;
          font-weight: 300;
          color: #fff;
          letter-spacing: -0.3px;
          margin: 0 0 0.4rem;
          line-height: 1.2;
        }

        .rf-title em {
          font-style: italic;
          color: #d4af37;
        }

        .rf-subtitle {
          font-size: 12px;
          color: rgba(255,255,255,0.28);
          font-weight: 300;
          letter-spacing: 0.3px;
          margin-bottom: 1.75rem;
        }

        .rf-divider {
          height: 1px;
          background: rgba(255,255,255,0.06);
          margin-bottom: 1.75rem;
        }

        /* ── Star rating ── */
        .rf-label {
          font-size: 10px;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.25);
          display: block;
          margin-bottom: 10px;
          transition: color 0.3s;
        }

        .rf-label.active { color: #d4af37; }

        .rf-stars {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 1.5rem;
        }

        .rf-star {
          font-size: 26px;
          cursor: pointer;
          transition: transform 0.15s ease, filter 0.15s ease;
          line-height: 1;
          filter: grayscale(1) brightness(0.4);
          user-select: none;
        }

        .rf-star.lit {
          filter: grayscale(0) brightness(1);
        }

        .rf-star:hover {
          transform: scale(1.2);
        }

        .rf-star-meta {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-left: 6px;
        }

        .rf-star-label {
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.5px;
          transition: color 0.3s;
        }

        .rf-star-bars {
          display: flex;
          gap: 3px;
        }

        .rf-star-bar {
          height: 2px;
          width: 14px;
          border-radius: 1px;
          background: rgba(255,255,255,0.08);
          transition: background 0.3s ease;
        }

        /* ── Textarea ── */
        .rf-field {
          margin-bottom: 1.25rem;
        }

        .rf-textarea-wrap {
          position: relative;
        }

        .rf-textarea-icon {
          position: absolute;
          left: 16px;
          top: 16px;
          color: rgba(255,255,255,0.18);
          font-size: 14px;
          transition: color 0.3s;
          pointer-events: none;
          line-height: 1;
        }

        .rf-field.focused .rf-label { color: #d4af37; }
        .rf-field.focused .rf-textarea-icon { color: #d4af37; }

        .rf-textarea {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          padding: 14px 16px 14px 44px;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 300;
          outline: none;
          resize: none;
          transition: all 0.3s ease;
          caret-color: #d4af37;
          line-height: 1.6;
        }

        .rf-textarea::placeholder { color: rgba(255,255,255,0.13); }

        .rf-textarea:focus {
          border-color: rgba(212,175,55,0.45);
          background: rgba(212,175,55,0.03);
          box-shadow: 0 0 0 3px rgba(212,175,55,0.07);
        }

        /* char count */
        .rf-char-count {
          text-align: right;
          font-size: 10px;
          color: rgba(255,255,255,0.18);
          margin-top: 6px;
          letter-spacing: 0.5px;
          transition: color 0.2s;
        }

        .rf-char-count.warn { color: rgba(212,175,55,0.5); }

        /* ── Submit button ── */
        .rf-btn {
          width: 100%;
          padding: 15px;
          border-radius: 10px;
          border: none;
          background: linear-gradient(135deg, #d4af37 0%, #f0d060 50%, #c9a227 100%);
          background-size: 200% 200%;
          color: #0b0d13;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
          margin-top: 0.25rem;
        }

        .rf-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.18) 50%, transparent 60%);
          transform: translateX(-100%);
          transition: transform 0.5s ease;
        }

        .rf-btn:hover:not(:disabled)::after { transform: translateX(100%); }
        .rf-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 32px rgba(212,175,55,0.3);
        }
        .rf-btn:active:not(:disabled) { transform: translateY(0); }
        .rf-btn:disabled { opacity: 0.45; cursor: not-allowed; }

        .rf-spinner {
          display: inline-block;
          width: 13px; height: 13px;
          border: 2px solid rgba(0,0,0,0.25);
          border-top-color: #0b0d13;
          border-radius: 50%;
          animation: rfSpin 0.7s linear infinite;
          vertical-align: middle;
          margin-right: 8px;
        }

        @keyframes rfSpin { to { transform: rotate(360deg); } }

        /* ── Footer trust row ── */
        .rf-trust {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-top: 1.25rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(255,255,255,0.05);
        }

        .rf-trust-item {
          font-size: 10px;
          color: rgba(255,255,255,0.15);
          letter-spacing: 0.5px;
          display: flex;
          align-items: center;
          gap: 5px;
        }
      `}</style>

      <div className="rf-wrap">
        <div className="rf-title">Share your <em>story</em></div>
        <div className="rf-subtitle">Your honest review helps fellow travelers find their perfect stay</div>
        <div className="rf-divider" />

        <form onSubmit={submitReview}>

          {/* ── Star Rating ── */}
          <span className="rf-label active">Your Rating</span>
          <div className="rf-stars">
            {[1, 2, 3, 4, 5].map((num) => (
              <span
                key={num}
                className={`rf-star ${num <= (hovered ?? rating) ? "lit" : ""}`}
                style={{ color: num <= (hovered ?? rating) ? starColors[hovered ?? rating] : undefined }}
                onClick={() => setRating(num)}
                onMouseEnter={() => setHovered(num)}
                onMouseLeave={() => setHovered(null)}
              >
                ★
              </span>
            ))}

            <div className="rf-star-meta">
              <div className="rf-star-bars">
                {[1,2,3,4,5].map((n) => (
                  <div
                    key={n}
                    className="rf-star-bar"
                    style={{
                      background: n <= (hovered ?? rating)
                        ? starColors[hovered ?? rating]
                        : undefined,
                    }}
                  />
                ))}
              </div>
              <span
                className="rf-star-label"
                style={{ color: starColors[hovered ?? rating] }}
              >
                {starLabels[hovered ?? rating]}
              </span>
            </div>
          </div>

          {/* ── Review text ── */}
          <div className={`rf-field ${focused === "text" ? "focused" : ""}`}>
            <label className="rf-label">Your Experience</label>
            <div className="rf-textarea-wrap">
              <span className="rf-textarea-icon">✦</span>
              <textarea
                rows={5}
                placeholder="What made your stay memorable? Be honest — your words matter."
                value={text}
                onChange={(e) => setText(e.target.value)}
                onFocus={() => setFocused("text")}
                onBlur={() => setFocused(null)}
                className="rf-textarea"
                maxLength={600}
              />
            </div>
            <div className={`rf-char-count ${text.length > 500 ? "warn" : ""}`}>
              {text.length} / 600
            </div>
          </div>

          {/* ── Submit ── */}
          <button type="submit" className="rf-btn" disabled={loading}>
            {loading && <span className="rf-spinner" />}
            {loading ? "Publishing your story…" : "Publish Review"}
          </button>
        </form>

        <div className="rf-trust">
          <div className="rf-trust-item"><span>✦</span> Verified Stay</div>
          <div className="rf-trust-item"><span>🛡️</span> No Fake Reviews</div>
          <div className="rf-trust-item"><span>🔒</span> Anonymous Option</div>
        </div>
      </div>
    </>
  );
}