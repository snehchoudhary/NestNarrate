// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import API from "../services/api";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const handleLogin = async () => {
//     try {
//       const res = await API.post("/auth/login", { email, password });

//       localStorage.setItem("token", res.data.token);

//       navigate("/home"); // redirect after login
//     } catch (err) {
//       alert("Login failed");
//       console.error(err);
//     }
//   };


//    useEffect(() => {
//   if (localStorage.getItem("token")) {
//     navigate("/home");
//   }
// }, [navigate]);


//   return (
//     <div className="p-6">
//       <h1 className="text-xl mb-4">Login</h1>

//       <input
//         className="border p-2 mb-2 block"
//         placeholder="Email"
//         onChange={(e) => setEmail(e.target.value)}
//       />

//       <input
//         className="border p-2 mb-2 block"
//         type="password"
//         placeholder="Password"
//         onChange={(e) => setPassword(e.target.value)}
//       />

//       <button
//   onClick={handleLogin}
//   className="bg-blue-500 text-white px-4 py-2 w-full rounded"
// >
//   Login
// </button>

// <p
//   className="text-blue-600 cursor-pointer mt-4 text-center hover:underline"
//   onClick={() => navigate("/forgot-password")}
// >
//   Forgot Password?
// </p>

// <p className="mt-4 text-sm text-gray-600">
//   Don’t have an account?{" "}
//   <span
//     onClick={() => navigate("/register")}
//     className="text-blue-600 cursor-pointer hover:underline"
//   >
//     Register
//   </span>
// </p>
//     </div>
//   );
// }

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Particle({ style }) {
  return <div className="nn-particle" style={style} />;
}

const REVIEWS = [
  { text: "The rooftop view was absolutely breathtaking at sunset.", author: "Priya S.", hotel: "The Oberoi, Mumbai", stars: 5 },
  { text: "WiFi was lightning fast — worked perfectly for remote work.", author: "James K.", hotel: "Marina Bay Sands", stars: 5 },
  { text: "Staff went above and beyond to make us feel welcome.", author: "Aisha M.", hotel: "Burj Al Arab", stars: 5 },
  { text: "Breakfast spread was incredible, 40+ dishes every morning.", author: "Luca R.", hotel: "Park Hyatt, Tokyo", stars: 5 },
];

export default function Login() {
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [focused, setFocused]     = useState(null);
  const [showPass, setShowPass]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [mounted, setMounted]     = useState(false);
  const [reviewIdx, setReviewIdx] = useState(0);
  const [reviewVisible, setReviewVisible] = useState(true);
  const canvasRef = useRef(null);
  const navigate  = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) navigate("/home");
    setTimeout(() => setMounted(true), 50);
  }, [navigate]);

  // Rotate review cards
  useEffect(() => {
    const interval = setInterval(() => {
      setReviewVisible(false);
      setTimeout(() => {
        setReviewIdx((i) => (i + 1) % REVIEWS.length);
        setReviewVisible(true);
      }, 500);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  // Canvas: animated wave + dot-grid background
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

      // Flowing wave layers
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

      // Floating dot grid
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

  const handleLogin = async () => {
    if (!email || !password) return;
    setLoading(true);
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/home");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => { if (e.key === "Enter") handleLogin(); };

  const review = REVIEWS[reviewIdx];

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
          .nn-left  { display: none; }
          .nn-right { padding: 40px 28px; }
          .nn-mobile-logo { display: block !important; }
        }

        /* LEFT PANEL */
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
        }

        .nn-logo {
          font-family: 'Cormorant Garamond', serif;
          font-size: 40px;
          font-weight: 300;
          letter-spacing: 3px;
          color: #fff;
          margin-bottom: 4px;
          text-align: center;
        }

        .nn-logo em { font-style: italic; color: #d4af37; }

        .nn-tagline {
          font-size: 11px;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: rgba(212,175,55,0.5);
          text-align: center;
          margin-bottom: 64px;
          font-weight: 300;
        }

        /* Review card */
        .nn-review-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(212,175,55,0.18);
          border-radius: 14px;
          padding: 24px;
          backdrop-filter: blur(12px);
          transition: opacity 0.5s ease, transform 0.5s ease;
          position: relative;
          overflow: hidden;
        }

        .nn-review-card::before {
          content: '"';
          position: absolute;
          top: -10px; left: 16px;
          font-family: 'Cormorant Garamond', serif;
          font-size: 80px;
          color: rgba(212,175,55,0.12);
          line-height: 1;
          pointer-events: none;
        }

        .nn-review-card.hidden  { opacity: 0; transform: translateY(8px); }
        .nn-review-card.visible { opacity: 1; transform: translateY(0); }

        .nn-review-stars { color: #d4af37; font-size: 12px; letter-spacing: 2px; margin-bottom: 12px; }

        .nn-review-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: 18px;
          font-weight: 300;
          font-style: italic;
          color: rgba(255,255,255,0.85);
          line-height: 1.6;
          margin-bottom: 16px;
        }

        .nn-review-author { display: flex; align-items: center; gap: 10px; }

        .nn-review-avatar {
          width: 32px; height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #d4af37, #8b6914);
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 500; color: #0b0d13;
          flex-shrink: 0;
        }

        .nn-review-name  { font-size: 12px; font-weight: 500; color: rgba(255,255,255,0.7); }
        .nn-review-hotel { font-size: 11px; color: rgba(212,175,55,0.6); margin-top: 1px; }

        .nn-review-dots { display: flex; justify-content: center; gap: 6px; margin-top: 20px; }

        .nn-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: rgba(255,255,255,0.15);
          transition: all 0.4s ease;
        }

        .nn-dot.active { background: #d4af37; width: 18px; border-radius: 3px; }

        .nn-left-footer {
          position: absolute;
          bottom: 28px;
          font-size: 11px;
          color: rgba(255,255,255,0.15);
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        /* RIGHT PANEL */
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

        .nn-welcome {
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
        }

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

        .nn-pass-toggle {
          position: absolute;
          right: 14px; top: 50%;
          transform: translateY(-50%);
          background: none; border: none;
          color: rgba(255,255,255,0.22);
          cursor: pointer;
          font-size: 13px; padding: 4px;
          transition: color 0.2s;
        }

        .nn-pass-toggle:hover { color: rgba(255,255,255,0.55); }

        .nn-forgot { text-align: right; margin-top: -10px; margin-bottom: 28px; }

        .nn-forgot span {
          font-size: 11px;
          color: rgba(212,175,55,0.6);
          cursor: pointer;
          letter-spacing: 0.5px;
          transition: color 0.2s;
          border-bottom: 1px solid transparent;
        }

        .nn-forgot span:hover { color: #d4af37; border-bottom-color: rgba(212,175,55,0.4); }

        /* CTA Button */
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

        .nn-divider { display: flex; align-items: center; gap: 14px; margin: 28px 0; }
        .nn-divider-line { flex: 1; height: 1px; background: rgba(255,255,255,0.07); }
        .nn-divider-text { font-size: 10px; color: rgba(255,255,255,0.18); letter-spacing: 2px; text-transform: uppercase; }

        .nn-socials { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }

        .nn-social-btn {
          padding: 11px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.03);
          color: rgba(255,255,255,0.4);
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          gap: 8px;
          transition: all 0.2s;
          letter-spacing: 0.5px;
        }

        .nn-social-btn:hover {
          border-color: rgba(255,255,255,0.14);
          background: rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.7);
        }

        .nn-register-link { text-align: center; margin-top: 32px; font-size: 13px; color: rgba(255,255,255,0.22); }

        .nn-register-link span {
          color: #d4af37;
          cursor: pointer;
          font-weight: 500;
          border-bottom: 1px solid transparent;
          transition: border-color 0.2s;
        }

        .nn-register-link span:hover { border-bottom-color: #d4af37; }

        .nn-trust {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-top: 28px;
          padding-top: 24px;
          border-top: 1px solid rgba(255,255,255,0.05);
        }

        .nn-trust-item { font-size: 10px; color: rgba(255,255,255,0.15); letter-spacing: 0.5px; display: flex; align-items: center; gap: 5px; }
      `}</style>

      <div className="nn-root">

        {/* LEFT PANEL */}
        <div className="nn-left">
          <canvas ref={canvasRef} className="nn-canvas" />

          <div className="nn-left-inner">
            <div className="nn-logo">Nest<em>Narrate</em></div>
            <div className="nn-tagline">Every stay has a story</div>

            <div className={`nn-review-card ${reviewVisible ? "visible" : "hidden"}`}>
              <div className="nn-review-stars">{"★".repeat(review.stars)}</div>
              <div className="nn-review-text">{review.text}</div>
              <div className="nn-review-author">
                <div className="nn-review-avatar">{review.author.charAt(0)}</div>
                <div>
                  <div className="nn-review-name">{review.author}</div>
                  <div className="nn-review-hotel">{review.hotel}</div>
                </div>
              </div>
            </div>

            <div className="nn-review-dots">
              {REVIEWS.map((_, i) => (
                <div key={i} className={`nn-dot ${i === reviewIdx ? "active" : ""}`} />
              ))}
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

            <div className="nn-welcome">Welcome back</div>
            <div className="nn-form-title">Sign in to<br />your journey</div>
            <div className="nn-form-sub">Continue exploring honest hotel stories</div>

            {/* Email */}
            <div className={`nn-field ${focused === "email" ? "focused" : ""}`}>
              <label className="nn-label">Email Address</label>
              <div className="nn-input-wrap">
                <span className="nn-input-icon">@</span>
                <input
                  className="nn-input"
                  placeholder="you@example.com"
                  type="email"
                  value={email}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused(null)}
                  onKeyDown={handleKey}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password */}
            <div className={`nn-field ${focused === "password" ? "focused" : ""}`}>
              <label className="nn-label">Password</label>
              <div className="nn-input-wrap">
                <span className="nn-input-icon">◈</span>
                <input
                  className="nn-input"
                  placeholder="Your password"
                  type={showPass ? "text" : "password"}
                  value={password}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused(null)}
                  onKeyDown={handleKey}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button className="nn-pass-toggle" onClick={() => setShowPass(!showPass)}>
                  {showPass ? "●" : "○"}
                </button>
              </div>
            </div>

            {/* Forgot */}
            <div className="nn-forgot">
              <span onClick={() => navigate("/forgot-password")}>Forgot password?</span>
            </div>

            {/* CTA */}
            <button
              className="nn-btn"
              onClick={handleLogin}
              disabled={loading || !email || !password}
            >
              {loading && <span className="nn-spinner" />}
              {loading ? "Signing you in..." : "Continue Your Journey"}
            </button>

            {/* Divider */}
            <div className="nn-divider">
              <div className="nn-divider-line" />
              <span className="nn-divider-text">or</span>
              <div className="nn-divider-line" />
            </div>

            {/* Social */}
            <div className="nn-socials">
              <button className="nn-social-btn"><span>G</span> Google</button>
              <button className="nn-social-btn"><span>✦</span> Apple</button>
            </div>

            {/* Register link */}
            <div className="nn-register-link">
              New to NestNarrate?{" "}
              <span onClick={() => navigate("/register")}>Create account</span>
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