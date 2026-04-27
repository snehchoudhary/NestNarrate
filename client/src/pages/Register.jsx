// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import API from "../services/api";

// export default function Register() {
//   const [form, setForm] = useState({});
//   const navigate = useNavigate();

//   // ✅ Redirect if already logged in
//   useEffect(() => {
//     if (localStorage.getItem("token")) {
//       navigate("/home");
//     }
//   }, [navigate]);

//   const handleRegister = async () => {
//     try {
//       await API.post("/auth/register", form);
//       alert("Registered!");
//       navigate("/login"); // redirect after register
//     } catch (err) {
//       alert("Registration failed");
//       console.error(err);
//     }
//   };

//   return (
//     <div className="p-6">
//       <h1 className="text-xl mb-4">Register</h1>

//       <input
//         className="border p-2 mb-2 block"
//         placeholder="Name"
//         onChange={(e) =>
//           setForm({ ...form, name: e.target.value })
//         }
//       />

//       <input
//         className="border p-2 mb-2 block"
//         placeholder="Email"
//         onChange={(e) =>
//           setForm({ ...form, email: e.target.value })
//         }
//       />

//       <input
//         className="border p-2 mb-2 block"
//         type="password"
//         placeholder="Password"
//         onChange={(e) =>
//           setForm({ ...form, password: e.target.value })
//         }
//       />

//       <button
//         onClick={handleRegister}
//         className="bg-green-500 text-white px-4 py-2"
//       >
//         Register
//       </button>

//       {/* ✅ Login redirect */}
//       <p className="mt-4 text-sm text-gray-600">
//         Already have an account?{" "}
//         <span
//           onClick={() => navigate("/login")}
//           className="text-blue-600 cursor-pointer hover:underline"
//         >
//           Login
//         </span>
//       </p>
//     </div>
//   );
// }


import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

// Floating particle for background
function Particle({ style }) {
  return <div className="nn-particle" style={style} />;
}

// Destination cards floating in background
const DESTINATIONS = [
  { city: "Bali", emoji: "🌴", rating: "4.9" },
  { city: "Paris", emoji: "🗼", rating: "4.8" },
  { city: "Tokyo", emoji: "⛩️", rating: "4.9" },
  { city: "Dubai", emoji: "🏙️", rating: "4.7" },
  { city: "Maldives", emoji: "🌊", rating: "5.0" },
  { city: "Rome", emoji: "🏛️", rating: "4.8" },
];

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [focused, setFocused] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [strength, setStrength] = useState(0);
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  useEffect(() => {
    if (localStorage.getItem("token")) navigate("/home");
    setTimeout(() => setMounted(true), 50);
  }, [navigate]);

  // Password strength
  useEffect(() => {
    const p = form.password;
    let s = 0;
    if (p.length >= 6) s++;
    if (p.length >= 10) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    setStrength(s);
  }, [form.password]);

  // Canvas globe animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    let t = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Generate globe dots
    const dots = [];
    for (let i = 0; i < 120; i++) {
      const phi = Math.acos(-1 + (2 * i) / 120);
      const theta = Math.sqrt(120 * Math.PI) * phi;
      dots.push({ phi, theta });
    }

    const draw = () => {
      const w = canvas.width, h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2, cy = h / 2;
      const R = Math.min(w, h) * 0.38;

      dots.forEach(({ phi, theta }) => {
        const x3 = R * Math.sin(phi) * Math.cos(theta + t * 0.3);
        const y3 = R * Math.sin(phi) * Math.sin(theta + t * 0.3);
        const z3 = R * Math.cos(phi);

        const px = cx + x3;
        const py = cy + y3 * 0.4 + z3 * 0.6;
        const visible = z3 > -R * 0.2;
        const alpha = visible ? (z3 + R) / (2 * R) : 0;

        if (alpha > 0.05) {
          ctx.beginPath();
          ctx.arc(px, py, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(212,175,55,${alpha * 0.7})`;
          ctx.fill();
        }
      });

      // Draw connecting arcs
      for (let i = 0; i < 6; i++) {
        const a1 = (t * 0.2 + (i * Math.PI * 2) / 6) % (Math.PI * 2);
        const a2 = a1 + 0.8;
        ctx.beginPath();
        ctx.arc(cx, cy, R * 0.95, a1, a2);
        ctx.strokeStyle = `rgba(212,175,55,0.15)`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      t += 0.008;
      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.password) return;
    setLoading(true);
    try {
      await API.post("/auth/register", form);
      navigate("/login");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong", "Perfect"];
  const strengthColor = ["", "#ef4444", "#f97316", "#eab308", "#22c55e", "#10b981"];

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
          position: relative;
        }

        @media (max-width: 768px) {
          .nn-root { grid-template-columns: 1fr; }
          .nn-left { display: none; }
        }

        /* ── LEFT PANEL ── */
        .nn-left {
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, #0d0f18 0%, #111520 50%, #0a0c14 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 48px;
        }

        .nn-left::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 60% 40% at 50% 50%, rgba(212,175,55,0.08) 0%, transparent 70%),
            radial-gradient(ellipse 30% 30% at 20% 80%, rgba(59,130,246,0.05) 0%, transparent 60%);
        }

        .nn-canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          opacity: 0.9;
        }

        .nn-left-content {
          position: relative;
          z-index: 2;
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

        .nn-logo em {
          font-style: italic;
          color: #d4af37;
        }

        .nn-tagline {
          font-size: 12px;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: rgba(212,175,55,0.6);
          margin-bottom: 56px;
          font-weight: 300;
        }

        /* Floating destination cards */
        .nn-dest-cards {
          display: flex;
          flex-direction: column;
          gap: 10px;
          width: 240px;
        }

        .nn-dest-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(212,175,55,0.15);
          border-radius: 10px;
          padding: 12px 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          backdrop-filter: blur(8px);
          animation: floatCard 4s ease-in-out infinite;
          transform: translateX(0);
        }

        .nn-dest-card:nth-child(2) { animation-delay: 0.4s; }
        .nn-dest-card:nth-child(3) { animation-delay: 0.8s; }

        @keyframes floatCard {
          0%,100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }

        .nn-dest-emoji { font-size: 22px; }

        .nn-dest-info { flex: 1; }
        .nn-dest-city { font-size: 13px; font-weight: 500; color: #fff; }
        .nn-dest-rating { font-size: 11px; color: #d4af37; }

        .nn-dest-badge {
          font-size: 10px;
          padding: 3px 8px;
          background: rgba(212,175,55,0.15);
          border: 1px solid rgba(212,175,55,0.3);
          border-radius: 20px;
          color: #d4af37;
        }

        .nn-left-footer {
          position: absolute;
          bottom: 32px;
          font-size: 11px;
          color: rgba(255,255,255,0.2);
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        /* ── RIGHT PANEL ── */
        .nn-right {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 48px 56px;
          background: #0b0d13;
          position: relative;
          overflow: hidden;
        }

        .nn-right::before {
          content: '';
          position: absolute;
          top: -200px; right: -200px;
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(212,175,55,0.04) 0%, transparent 70%);
          pointer-events: none;
        }

        .nn-right::after {
          content: '';
          position: absolute;
          bottom: -150px; left: -150px;
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(59,130,246,0.04) 0%, transparent 70%);
          pointer-events: none;
        }

        .nn-form-wrap {
          width: 100%;
          max-width: 400px;
          position: relative;
          z-index: 1;
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }

        .nn-form-wrap.mounted {
          opacity: 1;
          transform: translateY(0);
        }

        /* Mobile logo */
        .nn-mobile-logo {
          display: none;
          font-family: 'Cormorant Garamond', serif;
          font-size: 32px;
          font-weight: 300;
          color: #fff;
          letter-spacing: 2px;
          margin-bottom: 32px;
        }

        .nn-mobile-logo em { color: #d4af37; font-style: italic; }

        @media (max-width: 768px) {
          .nn-mobile-logo { display: block; text-align: center; }
          .nn-right { padding: 40px 28px; }
        }

        .nn-form-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 36px;
          font-weight: 300;
          color: #fff;
          letter-spacing: -0.5px;
          margin-bottom: 6px;
        }

        .nn-form-sub {
          font-size: 13px;
          color: rgba(255,255,255,0.35);
          margin-bottom: 40px;
          font-weight: 300;
        }

        /* Step indicators */
        .nn-steps {
          display: flex;
          gap: 6px;
          margin-bottom: 36px;
        }

        .nn-step {
          height: 3px;
          border-radius: 2px;
          background: rgba(255,255,255,0.1);
          transition: all 0.4s ease;
          flex: 1;
        }

        .nn-step.active { background: #d4af37; }

        /* Input groups */
        .nn-field {
          margin-bottom: 20px;
        }

        .nn-label {
          font-size: 11px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          margin-bottom: 8px;
          display: block;
          transition: color 0.3s;
        }

        .nn-field.focused .nn-label { color: #d4af37; }

        .nn-input-wrap {
          position: relative;
        }

        .nn-input-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255,255,255,0.2);
          font-size: 15px;
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

        .nn-input::placeholder { color: rgba(255,255,255,0.15); }

        .nn-input:focus {
          border-color: rgba(212,175,55,0.5);
          background: rgba(212,175,55,0.03);
          box-shadow: 0 0 0 3px rgba(212,175,55,0.08);
        }

        .nn-pass-toggle {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: rgba(255,255,255,0.25);
          cursor: pointer;
          font-size: 13px;
          padding: 4px;
          transition: color 0.2s;
        }

        .nn-pass-toggle:hover { color: rgba(255,255,255,0.6); }

        /* Password strength */
        .nn-strength {
          margin-top: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .nn-strength-bars {
          display: flex;
          gap: 3px;
          flex: 1;
        }

        .nn-strength-bar {
          height: 2px;
          flex: 1;
          border-radius: 1px;
          background: rgba(255,255,255,0.08);
          transition: background 0.4s ease;
        }

        .nn-strength-label {
          font-size: 10px;
          letter-spacing: 1px;
          text-transform: uppercase;
          font-weight: 500;
          min-width: 44px;
          text-align: right;
          transition: color 0.3s;
        }

        /* Submit button */
        .nn-btn {
          width: 100%;
          padding: 15px;
          border-radius: 10px;
          border: none;
          background: linear-gradient(135deg, #d4af37 0%, #f0d060 50%, #c9a227 100%);
          background-size: 200% 200%;
          color: #0b0d13;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 2px;
          text-transform: uppercase;
          cursor: pointer;
          margin-top: 28px;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .nn-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 32px rgba(212,175,55,0.35);
          background-position: right center;
        }

        .nn-btn:active:not(:disabled) { transform: translateY(0); }

        .nn-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Loading spinner inside button */
        .nn-spinner {
          display: inline-block;
          width: 14px; height: 14px;
          border: 2px solid rgba(0,0,0,0.3);
          border-top-color: #0b0d13;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          vertical-align: middle;
          margin-right: 8px;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        /* Divider */
        .nn-divider {
          display: flex;
          align-items: center;
          gap: 16px;
          margin: 28px 0;
        }

        .nn-divider-line {
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.07);
        }

        .nn-divider-text {
          font-size: 11px;
          color: rgba(255,255,255,0.2);
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        /* Social buttons */
        .nn-socials {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .nn-social-btn {
          padding: 11px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03);
          color: rgba(255,255,255,0.5);
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s;
        }

        .nn-social-btn:hover {
          border-color: rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.8);
        }

        /* Login link */
        .nn-login-link {
          text-align: center;
          margin-top: 32px;
          font-size: 13px;
          color: rgba(255,255,255,0.25);
        }

        .nn-login-link span {
          color: #d4af37;
          cursor: pointer;
          font-weight: 500;
          border-bottom: 1px solid transparent;
          transition: border-color 0.2s;
        }

        .nn-login-link span:hover { border-bottom-color: #d4af37; }

        /* Terms */
        .nn-terms {
          text-align: center;
          font-size: 10px;
          color: rgba(255,255,255,0.15);
          margin-top: 20px;
          line-height: 1.6;
          letter-spacing: 0.3px;
        }

        /* Floating particles */
        .nn-particles {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .nn-particle {
          position: absolute;
          width: 2px; height: 2px;
          border-radius: 50%;
          background: rgba(212,175,55,0.4);
          animation: floatUp linear infinite;
        }

        @keyframes floatUp {
          0% { transform: translateY(100vh) scale(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 0.5; }
          100% { transform: translateY(-10vh) scale(1); opacity: 0; }
        }
      `}</style>

      <div className="nn-root">
        {/* ── LEFT PANEL ── */}
        <div className="nn-left">
          <canvas ref={canvasRef} className="nn-canvas" />

          <div className="nn-left-content">
            <div className="nn-logo">Nest<em>Narrate</em></div>
            <div className="nn-tagline">Every stay has a story</div>

            {/* Floating destination cards */}
            <div className="nn-dest-cards">
              {DESTINATIONS.slice(0, 3).map((d, i) => (
                <div className="nn-dest-card" key={i}>
                  <div className="nn-dest-emoji">{d.emoji}</div>
                  <div className="nn-dest-info">
                    <div className="nn-dest-city">{d.city}</div>
                    <div className="nn-dest-rating">★ {d.rating} · Trending</div>
                  </div>
                  <div className="nn-dest-badge">Live</div>
                </div>
              ))}
            </div>
          </div>

          <div className="nn-left-footer">Trusted by 2M+ travelers</div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="nn-right">
          {/* Floating particles */}
          <div className="nn-particles">
            {Array.from({ length: 12 }).map((_, i) => (
              <Particle
                key={i}
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDuration: `${8 + Math.random() * 12}s`,
                  animationDelay: `${Math.random() * 8}s`,
                  width: `${1 + Math.random() * 2}px`,
                  height: `${1 + Math.random() * 2}px`,
                }}
              />
            ))}
          </div>

          <div className={`nn-form-wrap ${mounted ? "mounted" : ""}`}>

            <div className="nn-mobile-logo">Nest<em>Narrate</em></div>

            <div className="nn-form-title">Create account</div>
            <div className="nn-form-sub">Join millions discovering honest travel stories</div>

            {/* Step progress */}
            <div className="nn-steps">
              <div className={`nn-step ${form.name ? "active" : ""}`} />
              <div className={`nn-step ${form.email ? "active" : ""}`} />
              <div className={`nn-step ${form.password && strength >= 2 ? "active" : ""}`} />
            </div>

            {/* Name */}
            <div className={`nn-field ${focused === "name" ? "focused" : ""}`}>
              <label className="nn-label">Full Name</label>
              <div className="nn-input-wrap">
                <span className="nn-input-icon">✦</span>
                <input
                  className="nn-input"
                  placeholder="Your name"
                  onFocus={() => setFocused("name")}
                  onBlur={() => setFocused(null)}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
            </div>

            {/* Email */}
            <div className={`nn-field ${focused === "email" ? "focused" : ""}`}>
              <label className="nn-label">Email Address</label>
              <div className="nn-input-wrap">
                <span className="nn-input-icon">@</span>
                <input
                  className="nn-input"
                  placeholder="you@example.com"
                  type="email"
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused(null)}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
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
                  placeholder="Min. 8 characters"
                  type={showPass ? "text" : "password"}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused(null)}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <button className="nn-pass-toggle" onClick={() => setShowPass(!showPass)}>
                  {showPass ? "●" : "○"}
                </button>
              </div>

              {/* Strength meter */}
              {form.password && (
                <div className="nn-strength">
                  <div className="nn-strength-bars">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <div
                        key={n}
                        className="nn-strength-bar"
                        style={{ background: n <= strength ? strengthColor[strength] : undefined }}
                      />
                    ))}
                  </div>
                  <div className="nn-strength-label" style={{ color: strengthColor[strength] }}>
                    {strengthLabel[strength]}
                  </div>
                </div>
              )}
            </div>

            {/* CTA */}
            <button
              className="nn-btn"
              onClick={handleRegister}
              disabled={loading || !form.name || !form.email || !form.password}
            >
              {loading && <span className="nn-spinner" />}
              {loading ? "Creating your account..." : "Begin Your Journey"}
            </button>

            {/* Divider */}
            <div className="nn-divider">
              <div className="nn-divider-line" />
              <span className="nn-divider-text">or</span>
              <div className="nn-divider-line" />
            </div>

            {/* Social */}
            <div className="nn-socials">
              <button className="nn-social-btn">
                <span>G</span> Google
              </button>
              <button className="nn-social-btn">
                <span>✦</span> Apple
              </button>
            </div>

            {/* Login link */}
            <div className="nn-login-link">
              Already exploring?{" "}
              <span onClick={() => navigate("/login")}>Sign in</span>
            </div>

            <div className="nn-terms">
              By registering, you agree to NestNarrate's Terms of Service<br />and Privacy Policy
            </div>

          </div>
        </div>
      </div>
    </>
  );
}