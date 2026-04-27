

// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import API from "../services/api";
// import toast from "react-hot-toast";

// export default function ForgotPassword() {
//   const [email, setEmail] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleSendOTP = async (e) => {
//     e.preventDefault();

//     if (!email) {
//       toast.error("Please enter your email");
//       return;
//     }

//     try {
//       setLoading(true);

//       const res = await API.post("/auth/forgot-password", {
//         email,
//       });

//       toast.success(res.data.msg || "OTP sent successfully!");

//       // Save email for reset page
//       localStorage.setItem("resetEmail", email);

//       navigate("/reset-password");
//     } catch (error) {
//       toast.error(
//         error.response?.data?.msg || "Failed to send OTP"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
//       <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
//         <h1 className="text-3xl font-bold text-center mb-6">
//           Forgot Password
//         </h1>

//         <form onSubmit={handleSendOTP}>
//           <input
//             type="email"
//             placeholder="Enter your registered email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="w-full border p-3 rounded-lg mb-4 outline-none focus:ring-2 focus:ring-blue-500"
//           />

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
//           >
//             {loading ? "Sending OTP..." : "Send OTP"}
//           </button>
//         </form>

//         <p
//           onClick={() => navigate("/login")}
//           className="text-center text-blue-600 mt-4 cursor-pointer hover:underline"
//         >
//           Back to Login
//         </p>
//       </div>
//     </div>
//   );
// }

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";

function Particle({ style }) {
  return <div className="nn-particle" style={style} />;
}

export default function ForgotPassword() {
  const [email, setEmail]       = useState("");
  const [focused, setFocused]   = useState(false);
  const [loading, setLoading]   = useState(false);
  const [sent, setSent]         = useState(false);
  const [mounted, setMounted]   = useState(false);
  const canvasRef               = useRef(null);
  const navigate                = useNavigate();

  useEffect(() => {
    setTimeout(() => setMounted(true), 50);
  }, []);

  // Canvas: animated wave + dot-grid (matches Login page)
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

      for (let layer = 0; layer < 5; layer++) {
        ctx.beginPath();
        const amp   = 40 + layer * 20;
        const freq  = 0.008 - layer * 0.001;
        const speed = t * (0.4 + layer * 0.1);
        const yBase = h * (0.3 + layer * 0.12);

        ctx.moveTo(0, yBase);
        for (let x = 0; x <= w; x += 3) {
          const y = yBase
            + Math.sin(x * freq + speed) * amp
            + Math.sin(x * freq * 1.7 + speed * 0.8) * (amp * 0.4);
          ctx.lineTo(x, y);
        }
        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.closePath();

        const alpha = 0.03 + layer * 0.015;
        const grad  = ctx.createLinearGradient(0, 0, w, 0);
        grad.addColorStop(0,   `rgba(212,175,55,${alpha})`);
        grad.addColorStop(0.5, `rgba(59,130,246,${alpha * 0.6})`);
        grad.addColorStop(1,   `rgba(212,175,55,${alpha})`);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      const cols = 12, rows = 10;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x    = (w / cols) * c + w / (cols * 2);
          const y    = (h / rows) * r + h / (rows * 2);
          const wave = Math.sin(t * 0.5 + r * 0.4 + c * 0.3) * 0.5 + 0.5;
          ctx.beginPath();
          ctx.arc(x, y, 1, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(212,175,55,${wave * 0.12})`;
          ctx.fill();
        }
      }

      t += 0.02;
      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSendOTP = async () => {
    if (!isValidEmail) {
      toast.error("Please enter a valid email address");
      return;
    }
    setLoading(true);
    try {
      const res = await API.post("/auth/forgot-password", { email });
      toast.success(res.data.msg || "OTP sent successfully!");
      setSent(true);
      localStorage.setItem("resetEmail", email);
      setTimeout(() => navigate("/reset-password"), 1800);
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => { if (e.key === "Enter") handleSendOTP(); };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .nn-root {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          background: #08090d;
          font-family: 'DM Sans', sans-serif;
          overflow: hidden;
        }

        @media (max-width: 768px) {
          .nn-root { grid-template-columns: 1fr; }
          .nn-left { display: none; }
          .nn-right { padding: 40px 28px; }
          .nn-mobile-logo { display: block !important; }
        }

        /* ── LEFT PANEL ── */
        .nn-left {
          position: relative;
          overflow: hidden;
          background: linear-gradient(160deg, #0a0c16 0%, #0f1220 60%, #090b12 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 56px 48px;
        }

        .nn-canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }

        .nn-left-inner {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 340px;
          text-align: center;
        }

        .nn-logo {
          font-family: 'Cormorant Garamond', serif;
          font-size: 42px;
          font-weight: 300;
          letter-spacing: 3px;
          color: #fff;
          margin-bottom: 6px;
        }

        .nn-logo em { font-style: italic; color: #d4af37; }

        .nn-tagline {
          font-size: 11px;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: rgba(212,175,55,0.5);
          text-align: center;
          margin-bottom: 56px;
          font-weight: 300;
        }

        /* Recovery card */
        .nn-lock-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(212,175,55,0.18);
          border-radius: 20px;
          padding: 36px 28px;
          backdrop-filter: blur(12px);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 18px;
          position: relative;
          overflow: hidden;
        }

        .nn-lock-card::before {
          content: '';
          position: absolute;
          top: -40px; left: 50%;
          transform: translateX(-50%);
          width: 120px; height: 120px;
          background: radial-gradient(circle, rgba(212,175,55,0.12) 0%, transparent 70%);
          pointer-events: none;
        }

        .nn-lock-icon {
          width: 68px; height: 68px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(212,175,55,0.15), rgba(212,175,55,0.05));
          border: 1px solid rgba(212,175,55,0.3);
          display: flex; align-items: center; justify-content: center;
          font-size: 28px;
          animation: pulseGlow 3s ease-in-out infinite;
        }

        @keyframes pulseGlow {
          0%,100% { box-shadow: 0 0 0 0 rgba(212,175,55,0.15); }
          50%      { box-shadow: 0 0 0 12px rgba(212,175,55,0); }
        }

        .nn-lock-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px;
          font-weight: 300;
          color: rgba(255,255,255,0.9);
          font-style: italic;
          text-align: center;
          line-height: 1.4;
        }

        .nn-lock-body {
          font-size: 12px;
          color: rgba(255,255,255,0.35);
          text-align: center;
          line-height: 1.8;
          font-weight: 300;
          letter-spacing: 0.3px;
        }

        .nn-steps-list {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 4px;
        }

        .nn-step-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          background: rgba(255,255,255,0.03);
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.05);
        }

        .nn-step-num {
          width: 22px; height: 22px;
          border-radius: 50%;
          background: linear-gradient(135deg, #d4af37, #c9a227);
          color: #0b0d13;
          font-size: 10px;
          font-weight: 500;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }

        .nn-step-text { font-size: 11px; color: rgba(255,255,255,0.4); letter-spacing: 0.3px; }

        .nn-left-footer {
          position: absolute;
          bottom: 28px;
          font-size: 11px;
          color: rgba(255,255,255,0.15);
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        /* ── RIGHT PANEL ── */
        .nn-right {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 56px 64px;
          background: #0b0d13;
          position: relative;
          overflow: hidden;
        }

        .nn-right::before {
          content: '';
          position: absolute;
          top: -180px; right: -180px;
          width: 480px; height: 480px;
          background: radial-gradient(circle, rgba(212,175,55,0.05) 0%, transparent 70%);
          pointer-events: none;
        }

        .nn-right::after {
          content: '';
          position: absolute;
          bottom: -120px; left: -120px;
          width: 360px; height: 360px;
          background: radial-gradient(circle, rgba(59,130,246,0.04) 0%, transparent 70%);
          pointer-events: none;
        }

        .nn-particles { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }

        .nn-particle {
          position: absolute;
          border-radius: 50%;
          background: rgba(212,175,55,0.35);
          animation: floatUp linear infinite;
        }

        @keyframes floatUp {
          0%   { transform: translateY(100vh) scale(0); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 0.4; }
          100% { transform: translateY(-10vh) scale(1); opacity: 0; }
        }

        .nn-form-wrap {
          width: 100%;
          max-width: 380px;
          position: relative;
          z-index: 1;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }

        .nn-form-wrap.mounted { opacity: 1; transform: translateY(0); }

        .nn-mobile-logo {
          display: none;
          font-family: 'Cormorant Garamond', serif;
          font-size: 30px;
          font-weight: 300;
          color: #fff;
          letter-spacing: 2px;
          text-align: center;
          margin-bottom: 32px;
        }

        .nn-mobile-logo em { color: #d4af37; font-style: italic; }

        .nn-eyebrow {
          font-family: 'Cormorant Garamond', serif;
          font-size: 13px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #d4af37;
          margin-bottom: 8px;
        }

        .nn-form-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 40px;
          font-weight: 300;
          color: #fff;
          letter-spacing: -0.5px;
          margin-bottom: 6px;
          line-height: 1.1;
        }

        .nn-form-sub {
          font-size: 13px;
          color: rgba(255,255,255,0.3);
          margin-bottom: 44px;
          font-weight: 300;
          line-height: 1.7;
        }

        /* Success banner */
        .nn-success-banner {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 14px 16px;
          background: rgba(34,197,94,0.07);
          border: 1px solid rgba(34,197,94,0.2);
          border-radius: 10px;
          margin-bottom: 24px;
          max-height: 0;
          overflow: hidden;
          opacity: 0;
          transition: all 0.4s ease;
        }

        .nn-success-banner.visible {
          max-height: 80px;
          opacity: 1;
        }

        .nn-success-icon { font-size: 16px; flex-shrink: 0; }
        .nn-success-text { font-size: 12px; color: rgba(34,197,94,0.85); line-height: 1.6; font-weight: 300; }

        /* Field */
        .nn-field { margin-bottom: 20px; }

        .nn-label {
          font-size: 10px;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.25);
          margin-bottom: 8px;
          display: block;
          transition: color 0.3s;
        }

        .nn-field.focused .nn-label { color: #d4af37; }

        .nn-input-wrap { position: relative; }

        .nn-input-icon {
          position: absolute;
          left: 16px; top: 50%;
          transform: translateY(-50%);
          color: rgba(255,255,255,0.18);
          font-size: 14px;
          transition: color 0.3s;
          pointer-events: none;
        }

        .nn-field.focused .nn-input-icon { color: #d4af37; }

        .nn-input {
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
          transition: all 0.3s ease;
          caret-color: #d4af37;
        }

        .nn-input::placeholder { color: rgba(255,255,255,0.13); }

        .nn-input:focus {
          border-color: rgba(212,175,55,0.45);
          background: rgba(212,175,55,0.03);
          box-shadow: 0 0 0 3px rgba(212,175,55,0.07);
        }

        .nn-helper {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 8px;
          font-size: 11px;
          color: rgba(255,255,255,0.2);
          font-weight: 300;
        }

        .nn-helper-dot {
          width: 3px; height: 3px;
          border-radius: 50%;
          background: rgba(212,175,55,0.4);
          flex-shrink: 0;
        }

        /* CTA */
        .nn-btn {
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
        }

        .nn-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.18) 50%, transparent 60%);
          transform: translateX(-100%);
          transition: transform 0.5s ease;
        }

        .nn-btn:hover:not(:disabled)::after { transform: translateX(100%); }
        .nn-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 32px rgba(212,175,55,0.3); }
        .nn-btn:active:not(:disabled) { transform: translateY(0); }
        .nn-btn:disabled { opacity: 0.45; cursor: not-allowed; }

        .nn-spinner {
          display: inline-block;
          width: 13px; height: 13px;
          border: 2px solid rgba(0,0,0,0.25);
          border-top-color: #0b0d13;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          vertical-align: middle;
          margin-right: 8px;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        /* Back link */
        .nn-back-link {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 28px;
          font-size: 13px;
          color: rgba(255,255,255,0.22);
          cursor: pointer;
          transition: color 0.2s;
        }

        .nn-back-link:hover { color: rgba(255,255,255,0.5); }

        .nn-back-arrow { font-size: 16px; color: rgba(212,175,55,0.5); transition: transform 0.2s; }
        .nn-back-link:hover .nn-back-arrow { transform: translateX(-3px); }

        .nn-back-link span {
          color: #d4af37;
          font-weight: 500;
          border-bottom: 1px solid transparent;
          transition: border-color 0.2s;
        }

        .nn-back-link:hover span { border-bottom-color: rgba(212,175,55,0.5); }

        /* Trust */
        .nn-trust {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-top: 28px;
          padding-top: 24px;
          border-top: 1px solid rgba(255,255,255,0.05);
        }

        .nn-trust-item {
          font-size: 10px;
          color: rgba(255,255,255,0.15);
          letter-spacing: 0.5px;
          display: flex;
          align-items: center;
          gap: 5px;
        }
      `}</style>

      <div className="nn-root">

        {/* LEFT PANEL */}
        <div className="nn-left">
          <canvas ref={canvasRef} className="nn-canvas" />

          <div className="nn-left-inner">
            <div className="nn-logo">Nest<em>Narrate</em></div>
            <div className="nn-tagline">Every stay has a story</div>

            <div className="nn-lock-card">
              <div className="nn-lock-icon">🔑</div>
              <div className="nn-lock-title">Account recovery<br/>made simple</div>
              <div className="nn-lock-body">
                We'll send a one-time code to your email<br/>
                to securely restore access to your account.
              </div>
              <div className="nn-steps-list">
                {[
                  "Enter your registered email address",
                  "Receive a secure OTP in your inbox",
                  "Set a new password & continue exploring",
                ].map((text, i) => (
                  <div className="nn-step-item" key={i}>
                    <div className="nn-step-num">{i + 1}</div>
                    <div className="nn-step-text">{text}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="nn-left-footer">2M+ honest travel reviews</div>
        </div>

        {/* RIGHT PANEL */}
        <div className="nn-right">
          <div className="nn-particles">
            {Array.from({ length: 10 }).map((_, i) => (
              <Particle
                key={i}
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDuration: `${9 + Math.random() * 12}s`,
                  animationDelay: `${Math.random() * 9}s`,
                  width:  `${1 + Math.random() * 2}px`,
                  height: `${1 + Math.random() * 2}px`,
                }}
              />
            ))}
          </div>

          <div className={`nn-form-wrap ${mounted ? "mounted" : ""}`}>

            <div className="nn-mobile-logo">Nest<em>Narrate</em></div>

            <div className="nn-eyebrow">Account Recovery</div>
            <div className="nn-form-title">Forgot your<br/>password?</div>
            <div className="nn-form-sub">
              No worries — enter your email and we'll send<br/>
              you a one-time code to reset it.
            </div>

            {/* Success banner */}
            <div className={`nn-success-banner ${sent ? "visible" : ""}`}>
              <div className="nn-success-icon">✅</div>
              <div className="nn-success-text">
                OTP sent! Check your inbox — it may take a moment to arrive.
              </div>
            </div>

            {/* Email field */}
            <div className={`nn-field ${focused ? "focused" : ""}`}>
              <label className="nn-label">Email Address</label>
              <div className="nn-input-wrap">
                <span className="nn-input-icon">@</span>
                <input
                  className="nn-input"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  onKeyDown={handleKey}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="nn-helper">
                <div className="nn-helper-dot" />
                Use the email linked to your NestNarrate account
              </div>
            </div>

            {/* CTA */}
            <button
              className="nn-btn"
              onClick={handleSendOTP}
              disabled={loading || !isValidEmail || sent}
            >
              {loading && <span className="nn-spinner" />}
              {loading ? "Sending OTP..." : sent ? "OTP Sent ✓" : "Send OTP"}
            </button>

            {/* Back link */}
            <div className="nn-back-link" onClick={() => navigate("/login")}>
              <span className="nn-back-arrow">←</span>
              Back to <span>Sign In</span>
            </div>

            {/* Trust */}
            <div className="nn-trust">
              <div className="nn-trust-item"><span>🔒</span> SSL Secured</div>
              <div className="nn-trust-item"><span>🛡️</span> Privacy First</div>
              <div className="nn-trust-item"><span>✦</span> No Ads</div>
            </div>

          </div>
        </div>

      </div>
    </>
  );
}