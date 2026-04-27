// import { Link } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
// import { useState, useEffect } from "react";
// import API from "../services/api";

// export default function Navbar() {


//    const navigate = useNavigate();

//    const [user, setUser] = useState(null);

//    useEffect(() => {
//   const fetchUser = async () => {
//     const token = localStorage.getItem("token");

//     if (!token) return;

//     try {
//       const res = await API.get("/auth/me", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       setUser(res.data);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   fetchUser();
// }, []);

//     const handlelogout = () => {
//   localStorage.removeItem("token");
//   navigate("/login");
// };

//   return (
//     <nav className="flex justify-between items-center p-4 bg-gray-900 text-white">
//       <Link to="/" className="text-xl font-bold">NestNarrate</Link>

//       <div className="flex gap-4">
//         <Link to="/compare">Compare</Link>
//         <Link to="/dashboard">Dashboard</Link>
//       </div>


//        <div className="flex items-center gap-4">
//   {user && (
//     <span className="text-white">
//       Welcome, {user.name}
//     </span>
//   )}
//        {localStorage.getItem("token") && (
//  <button onClick={handlelogout}
//       className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
//       >Logout</button>
//        )}
//      </div>
//     </nav>
//   );
// }

import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import API from "../services/api";

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await API.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        .nn-nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 40px;
          height: 64px;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.35s ease;
          background: transparent;
        }

        .nn-nav.scrolled {
          background: rgba(11, 13, 19, 0.92);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(212, 175, 55, 0.1);
          box-shadow: 0 4px 32px rgba(0, 0, 0, 0.4);
        }

        /* ── Logo ── */
        .nn-nav-logo {
          font-family: 'Cormorant Garamond', serif;
          font-size: 26px;
          font-weight: 300;
          letter-spacing: 2px;
          color: #fff;
          text-decoration: none;
          transition: opacity 0.2s;
          flex-shrink: 0;
        }

        .nn-nav-logo:hover { opacity: 0.85; }

        .nn-nav-logo em {
          font-style: italic;
          color: #d4af37;
        }

        /* ── Center nav links ── */
        .nn-nav-links {
          display: flex;
          align-items: center;
          gap: 6px;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
        }

        .nn-nav-link {
          font-size: 12px;
          font-weight: 400;
          letter-spacing: 1.8px;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.45);
          text-decoration: none;
          padding: 7px 14px;
          border-radius: 8px;
          border: 1px solid transparent;
          transition: all 0.25s ease;
          position: relative;
        }

        .nn-nav-link:hover {
          color: rgba(255, 255, 255, 0.85);
          background: rgba(255, 255, 255, 0.04);
          border-color: rgba(255, 255, 255, 0.07);
        }

        .nn-nav-link.active {
          color: #d4af37;
          background: rgba(212, 175, 55, 0.07);
          border-color: rgba(212, 175, 55, 0.2);
        }

        /* ── Right section ── */
        .nn-nav-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        /* ── Welcome chip ── */
        .nn-nav-welcome {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 5px 12px 5px 5px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 999px;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.5);
          font-weight: 300;
          letter-spacing: 0.3px;
        }

        .nn-nav-avatar {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: linear-gradient(135deg, #d4af37, #8b6914);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 600;
          color: #0b0d13;
          flex-shrink: 0;
          font-family: 'DM Sans', sans-serif;
        }

        .nn-nav-welcome-name {
          color: rgba(255, 255, 255, 0.75);
          font-weight: 400;
        }

        /* ── Logout button ── */
        .nn-nav-logout {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 7px 16px;
          border-radius: 8px;
          border: 1px solid rgba(212, 175, 55, 0.2);
          background: transparent;
          color: rgba(212, 175, 55, 0.7);
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 400;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .nn-nav-logout:hover {
          border-color: rgba(212, 175, 55, 0.5);
          background: rgba(212, 175, 55, 0.06);
          color: #d4af37;
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(212, 175, 55, 0.12);
        }

        .nn-nav-logout:active {
          transform: translateY(0);
        }

        /* ── Divider between welcome and logout ── */
        .nn-nav-sep {
          width: 1px;
          height: 20px;
          background: rgba(255, 255, 255, 0.07);
        }

        /* ── Mobile hamburger ── */
        .nn-nav-burger {
          display: none;
          flex-direction: column;
          justify-content: center;
          gap: 5px;
          width: 32px;
          height: 32px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
        }

        .nn-nav-burger span {
          display: block;
          height: 1px;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 1px;
          transition: all 0.25s ease;
        }

        .nn-nav-burger.open span:nth-child(1) { transform: translateY(6px) rotate(45deg); }
        .nn-nav-burger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
        .nn-nav-burger.open span:nth-child(3) { transform: translateY(-6px) rotate(-45deg); }

        /* ── Mobile drawer ── */
        .nn-nav-drawer {
          display: none;
          position: fixed;
          top: 64px;
          left: 0; right: 0;
          background: rgba(11, 13, 19, 0.97);
          backdrop-filter: blur(24px);
          border-bottom: 1px solid rgba(212, 175, 55, 0.1);
          padding: 24px 28px 32px;
          z-index: 99;
          flex-direction: column;
          gap: 8px;
          animation: slideDown 0.25s ease forwards;
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .nn-nav-drawer.open { display: flex; }

        .nn-drawer-link {
          font-size: 13px;
          font-weight: 400;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.5);
          text-decoration: none;
          padding: 12px 16px;
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          transition: all 0.2s;
        }

        .nn-drawer-link:hover {
          color: #d4af37;
          border-color: rgba(212, 175, 55, 0.2);
          background: rgba(212, 175, 55, 0.04);
        }

        .nn-drawer-sep {
          height: 1px;
          background: rgba(255, 255, 255, 0.05);
          margin: 8px 0;
        }

        .nn-drawer-user {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .nn-drawer-avatar {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: linear-gradient(135deg, #d4af37, #8b6914);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 600;
          color: #0b0d13;
        }

        .nn-drawer-name {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.7);
        }

        .nn-drawer-logout {
          padding: 12px 16px;
          border-radius: 10px;
          border: 1px solid rgba(212, 175, 55, 0.2);
          background: transparent;
          color: rgba(212, 175, 55, 0.7);
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          cursor: pointer;
          text-align: left;
          transition: all 0.2s;
        }

        .nn-drawer-logout:hover {
          background: rgba(212, 175, 55, 0.06);
          color: #d4af37;
        }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .nn-nav { padding: 0 20px; }
          .nn-nav-links { display: none; }
          .nn-nav-right { display: none; }
          .nn-nav-burger { display: flex; }
        }
      `}</style>

      <nav className={`nn-nav ${scrolled ? "scrolled" : ""}`}>

        {/* Logo */}
        <Link to="/" className="nn-nav-logo">
          Nest<em>Narrate</em>
        </Link>

        {/* Center nav links */}
        <div className="nn-nav-links">
          <Link to="/compare" className="nn-nav-link">Compare</Link>
          <Link to="/dashboard" className="nn-nav-link">Dashboard</Link>
        </div>

        {/* Right section */}
        <div className="nn-nav-right">
          {user && (
            <>
              <div className="nn-nav-welcome">
                <div className="nn-nav-avatar">
                  {user.name?.charAt(0)?.toUpperCase()}
                </div>
                <span className="nn-nav-welcome-name">{user.name}</span>
              </div>
              <div className="nn-nav-sep" />
            </>
          )}

          {localStorage.getItem("token") && (
            <button className="nn-nav-logout" onClick={handleLogout}>
              ✦ Sign out
            </button>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className={`nn-nav-burger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* Mobile drawer */}
      <div className={`nn-nav-drawer ${menuOpen ? "open" : ""}`}>
        <Link to="/compare" className="nn-drawer-link" onClick={() => setMenuOpen(false)}>Compare</Link>
        <Link to="/dashboard" className="nn-drawer-link" onClick={() => setMenuOpen(false)}>Dashboard</Link>

        {user && (
          <>
            <div className="nn-drawer-sep" />
            <div className="nn-drawer-user">
              <div className="nn-drawer-avatar">{user.name?.charAt(0)?.toUpperCase()}</div>
              <span className="nn-drawer-name">{user.name}</span>
            </div>
          </>
        )}

        {localStorage.getItem("token") && (
          <button className="nn-drawer-logout" onClick={() => { setMenuOpen(false); handleLogout(); }}>
            ✦ Sign out
          </button>
        )}
      </div>
    </>
  );
}