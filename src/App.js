import React, { useState, useEffect } from "react";
import { FaUserFriends, FaPlus, FaEdit, FaEye, FaTimes, FaUserCircle, FaCog, FaUsers, FaHandsHelping, FaShieldAlt, FaHeart, FaGlobe, FaStar } from "react-icons/fa";
import {  BsThreeDotsVertical } from "react-icons/bs";
import { auth, db } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "firebase/auth";
import { collection, addDoc, doc, setDoc, getDocs } from "firebase/firestore";

function App() {
  
  const [contacts, setContacts] = useState([]);
  const [modal, setModal] = useState(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [editingContact, setEditingContact] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [navbarMenuOpen, setNavbarMenuOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);


  // Auth state
  const [authModal, setAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  // Notifications
  const [notificationEnabled, setNotificationEnabled] = useState(() => {
    const v = localStorage.getItem("notificationEnabled");
    return v === null ? true : v === "true";
  });
  const [sosTrigger, setSosTrigger] = useState(() => {
    return localStorage.getItem("sosTrigger") || "power";
  });

  // Splash screen state
  const [showSplash, setShowSplash] = useState(true);

  // Watch Firebase login state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        // Load contacts for this user
        const snap = await getDocs(collection(db, "users", user.uid, "contacts"));
        const list = snap.docs.map((d) => d.data());
        setContacts(list);
      } else {
        setCurrentUser(null);
        setContacts([]);
      }
    });
    return () => unsub();
  }, []);

  // Dark mode toggle
  
  // Shake detection
  useEffect(() => {
    if (sosTrigger !== "shake" || !currentUser) return;
    let lastShake = 0;
    function handleMotion(e) {
      const acc = e.accelerationIncludingGravity;
      if (!acc) return;
      const magnitude = Math.sqrt(acc.x * acc.x + acc.y * acc.y + acc.z * acc.z);
      if (magnitude > 20) {
        const now = Date.now();
        if (now - lastShake > 2000) {
          lastShake = now;
          handleSOS();
        }
      }
    }
    window.addEventListener("devicemotion", handleMotion);
    return () => window.removeEventListener("devicemotion", handleMotion);
  }, [sosTrigger, currentUser, contacts]);

  // Save preferences
  useEffect(() => {
    localStorage.setItem("notificationEnabled", notificationEnabled);
  }, [notificationEnabled]);
  useEffect(() => {
    localStorage.setItem("sosTrigger", sosTrigger);
  }, [sosTrigger]);

  // Add contact
  const handleAddContact = async () => {
    if (!name || !phone || !currentUser) return;
    const newContact = { id: Date.now(), name, number: phone };
    try {
      await setDoc(
        doc(collection(db, "users", currentUser.uid, "contacts"), String(newContact.id)),
        newContact
      );
      setContacts([...contacts, newContact]);
      setName("");
      setPhone("");
      setModal(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Edit contact
  const handleEditContact = async () => {
    if (!editingContact || !currentUser) return;
    const updated = { ...editingContact, name, number: phone };
    try {
      await setDoc(
        doc(db, "users", currentUser.uid, "contacts", String(editingContact.id)),
        updated
      );
      setContacts(
        contacts.map((c) => (c.id === editingContact.id ? updated : c))
      );
      setEditingContact(null);
      setName("");
      setPhone("");
      setModal(null);
    } catch (err) {
      console.error(err);
    }
  };

  // SOS button
  const handleSOS = () => {
    if (!currentUser) {
      alert("Please login first.");
      return;
    }
    if (contacts.length === 0) {
      alert("No contacts saved.");
      return;
    }
    if (!navigator.geolocation) {
      alert("Geolocation not supported.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const location = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        try {
          const res = await fetch("http://localhost:5000/send-sos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contacts, location }),
          });
          const data = await res.json();
          if (data.success) alert("🚨 SOS sent successfully!");
          else alert("❌ Failed to send SOS");
        } catch (err) {
          console.error(err);
          alert("❌ Error sending SOS");
        }
      },
      (err) => {
        console.error(err);
        alert("❌ Failed to get location.");
      }
    );
  };

  // Auth handlers
  const handleSignup = async () => {
    if (!authName || !authEmail || !authPassword) return;
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        authEmail,
        authPassword
      );
      // Add user doc
      await addDoc(collection(db, "users"), {
        name: authName,
        email: authEmail,
        uid: userCredential.user.uid,
      });
      setAuthModal(false);
      setAuthName("");
      setAuthEmail("");
      setAuthPassword("");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, authEmail, authPassword);
      setAuthModal(false);
      setAuthEmail("");
      setAuthPassword("");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setCurrentUser(null);
    setContacts([]);
  };

  // Animated background SVG pattern
  const TechPatternBg = () => (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <svg width="100%" height="100%">
        <defs>
          <linearGradient id="techGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0f2027" />
            <stop offset="100%" stopColor="#2c5364" />
          </linearGradient>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <rect x="0" y="0" width="40" height="40" fill="url(#techGradient)" />
            <path d="M 0 0 L 40 0 L 40 40 L 0 40 Z" stroke="#00fff7" strokeWidth="0.5" opacity="0.2"/>
            <circle cx="20" cy="20" r="2" fill="#00fff7" opacity="0.3">
              <animate attributeName="r" values="2;6;2" dur="2s" repeatCount="indefinite" />
            </circle>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  );

  // Splash screen component
  const SplashScreen = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "linear-gradient(180deg, #0a0f2c 0%, #1a1f4c 100%)" }}>
      {/* Starry night background */}
      <div style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        zIndex: 1
      }}>
        {[...Array(80)].map((_, i) => (
          <div
            key={i}
            className="splash-star"
            style={{
              position: "absolute",
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              borderRadius: "50%",
              background: "#fff",
              opacity: Math.random() * 0.7 + 0.3,
              boxShadow: `0 0 8px #fff`
            }}
          />
        ))}
      </div>
      
      {/* Community Icons floating around */}
      <div className="absolute inset-0 z-5 pointer-events-none">
        <FaUsers className="absolute top-20 left-10 text-cyan-400 opacity-60 animate-bounce" size={32} style={{ animationDelay: '0s', animationDuration: '3s' }} />
        <FaHandsHelping className="absolute top-32 right-16 text-purple-400 opacity-50 animate-bounce" size={28} style={{ animationDelay: '1s', animationDuration: '4s' }} />
        <FaShieldAlt className="absolute bottom-40 left-20 text-green-400 opacity-70 animate-bounce" size={30} style={{ animationDelay: '2s', animationDuration: '3.5s' }} />
        <FaHeart className="absolute top-1/3 left-1/4 text-red-400 opacity-60 animate-pulse" size={24} style={{ animationDelay: '0.5s' }} />
        <FaGlobe className="absolute bottom-32 right-12 text-blue-400 opacity-50 animate-bounce" size={26} style={{ animationDelay: '1.5s', animationDuration: '4.5s' }} />
        <FaStar className="absolute top-1/4 right-1/3 text-yellow-400 opacity-70 animate-pulse" size={22} style={{ animationDelay: '2.5s' }} />
        <FaUserFriends className="absolute bottom-1/3 left-1/3 text-indigo-400 opacity-60 animate-bounce" size={28} style={{ animationDelay: '3s', animationDuration: '3.8s' }} />
        <FaUsers className="absolute top-1/2 right-20 text-pink-400 opacity-50 animate-pulse" size={25} style={{ animationDelay: '1.8s' }} />
      </div>
      
      <div className="relative z-10 flex flex-col items-center">
        <div className="flex items-center gap-4 mb-4">
          <FaShieldAlt className="text-cyan-400 drop-shadow-glow animate-pulse" size={48} />
          <FaUsers className="text-purple-400 drop-shadow-glow animate-pulse" size={40} style={{ animationDelay: '0.5s' }} />
          <FaHeart className="text-red-400 drop-shadow-glow animate-pulse" size={44} style={{ animationDelay: '1s' }} />
        </div>
        <span className="text-4xl md:text-6xl font-bold text-white font-mono drop-shadow-lg tracking-widest mb-4">
          SAFETY STEP
        </span>
        <div className="flex items-center gap-3 text-cyan-300 font-mono text-lg opacity-80">
          <FaHandsHelping className="animate-pulse" size={20} />
          <span>Community • Safety • Together</span>
          <FaGlobe className="animate-pulse" size={20} style={{ animationDelay: '1s' }} />
        </div>
      </div>
      <style>{`
        .splash-star {
          animation: sparkle 1.5s infinite alternate;
        }
        @keyframes sparkle {
          from { opacity: 0.3; box-shadow: 0 0 4px #fff; }
          to { opacity: 1; box-shadow: 0 0 12px #fff; }
        }
      `}</style>
    </div>
  );

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) return <SplashScreen />;

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      <TechPatternBg />

      {/* Navbar */}
      <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-gray-900 to-gray-800 shadow-lg border-b border-cyan-800">
        <span className="text-2xl font-bold text-cyan-300 font-mono tracking-widest">SafetyStep</span>
        <button
          onClick={() => setNavbarMenuOpen(true)}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-800 transition"
          title="Menu"
        >
          <BsThreeDotsVertical className="text-cyan-300" size={28} />
        </button>
      </div>

      {/* Left slide-in pane for menu */}
      {navbarMenuOpen && (
        <div
          className="fixed inset-0 z-50"
          onClick={() => setNavbarMenuOpen(false)}
        >
          <div
            className="fixed top-0 left-0 h-full w-80 bg-gradient-to-br from-gray-900 to-gray-800 shadow-2xl border-r-2 border-cyan-400 p-6 animate-fade-in flex flex-col"
            style={{ zIndex: 60 }}
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-6 text-cyan-400 hover:text-red-500"
              onClick={() => setNavbarMenuOpen(false)}
            >
              <FaTimes />
            </button>
            <h2 className="text-2xl font-bold mb-6 text-cyan-300 font-mono">Menu</h2>
            <div className="flex flex-col gap-6 mt-4">
              {/* Profile */}
              <button
                className="flex items-center gap-3 px-4 py-3 border border-cyan-400 rounded-lg bg-gray-800 hover:bg-cyan-950 transition font-mono text-cyan-300 shadow-md hover:shadow-cyan-400/40"
                onClick={() => {
                  setNavbarMenuOpen(false);
                  if (!currentUser) {
                    setAuthMode("login");
                    setAuthModal(true);
                  } else {
                    alert(
                      `Name: ${currentUser.displayName || "No Name"}\nEmail: ${currentUser.email}`
                    );
                  }
                }}
              >
                <FaUserCircle className="text-cyan-400" size={22} />
                <span>Profile</span>
              </button>
              {/* View Contacts */}
              <button
                className="flex items-center gap-3 px-4 py-3 border border-cyan-400 rounded-lg bg-gray-800 hover:bg-cyan-950 transition font-mono text-cyan-300 shadow-md hover:shadow-cyan-400/40"
                onClick={() => {
                  setNavbarMenuOpen(false);
                  setModal("show");
                }}
              >
                <FaUserFriends className="text-cyan-400" size={22} />
                <span>View Contacts</span>
              </button>
              {/* Add Contact */}
              <button
                className="flex items-center gap-3 px-4 py-3 border border-cyan-400 rounded-lg bg-gray-800 hover:bg-cyan-950 transition font-mono text-cyan-300 shadow-md hover:shadow-cyan-400/40"
                onClick={() => {
                  setNavbarMenuOpen(false);
                  setModal("add");
                }}
              >
                <FaPlus className="text-cyan-400" size={22} />
                <span>Add Emergency Contact</span>
              </button>
              {/* Settings */}
              <button
                className="flex items-center gap-3 px-4 py-3 border border-cyan-400 rounded-lg bg-gray-800 hover:bg-cyan-950 transition font-mono text-cyan-300 shadow-md hover:shadow-cyan-400/40"
                onClick={() => {
                  setNavbarMenuOpen(false);
                  setSettingsOpen(true);
                }}
              >
                <FaCog className="text-cyan-400" size={22} />
                <span>Settings</span>
              </button>
              {/* Auth buttons for not logged in */}
              {!currentUser && (
                <div className="flex gap-2 mt-2">
                  <button
                    className="flex-1 px-4 py-2 rounded-lg bg-cyan-500 text-white font-mono font-bold hover:bg-cyan-700 transition"
                    onClick={() => {
                      setNavbarMenuOpen(false);
                      setAuthMode("login");
                      setAuthModal(true);
                    }}
                  >
                    Login
                  </button>
                  <button
                    className="flex-1 px-4 py-2 rounded-lg bg-green-500 text-white font-mono font-bold hover:bg-green-700 transition"
                    onClick={() => {
                      setNavbarMenuOpen(false);
                      setAuthMode("signup");
                      setAuthModal(true);
                    }}
                  >
                    Sign-up
                  </button>
                </div>
              )}
              {/* Logout for logged in */}
              {currentUser && (
                <button
                  className="w-full mt-2 bg-red-500 text-white py-2 rounded font-mono font-bold hover:bg-red-700 transition-all border border-red-400 shadow-md"
                  onClick={() => {
                    handleLogout();
                    setNavbarMenuOpen(false);
                  }}
                >
                  Logout
                </button>
              )}
            </div>
            <div className="mt-auto pt-6">
              <hr className="border-cyan-700 mb-2" />
              <div className="text-xs text-cyan-700 text-center font-mono">
                &copy; {new Date().getFullYear()} SafetyStep
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Slide-in Panel */}
      {settingsOpen && (
        <div
          className="fixed inset-0 z-50"
          onClick={() => setSettingsOpen(false)}
        >
          <div
            className="fixed top-0 left-0 h-full w-80 bg-gradient-to-br from-gray-900 to-gray-800 shadow-2xl border-r-2 border-cyan-400 p-6 animate-fade-in"
            style={{ zIndex: 60 }}
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-6 text-cyan-400 hover:text-red-500"
              onClick={() => setSettingsOpen(false)}
            >
              <FaTimes />
            </button>
            <h2 className="text-2xl font-bold mb-6 text-cyan-300 font-mono">Settings</h2>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-cyan-200 font-mono">Notifications</span>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationEnabled}
                    onChange={e => setNotificationEnabled(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-10 h-6 flex items-center bg-gray-700 rounded-full p-1 transition-colors ${notificationEnabled ? "bg-green-500" : "bg-gray-700"}`}>
                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${notificationEnabled ? "translate-x-4" : ""}`}></div>
                  </div>
                </label>
              </div>
              <span className="text-xs text-cyan-400 font-mono">Enable/Disable notifications</span>
            </div>
            <div className="mb-6">
              <div className="text-cyan-200 font-mono mb-2">SOS Trigger</div>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="sosTrigger"
                    value="power"
                    checked={sosTrigger === "power"}
                    onChange={() => setSosTrigger("power")}
                  />
                  <span className="text-cyan-300 font-mono">Triple-press Power Button <span className="text-xs text-yellow-400">(native app only)</span></span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="sosTrigger"
                    value="shake"
                    checked={sosTrigger === "shake"}
                    onChange={() => setSosTrigger("shake")}
                  />
                  <span className="text-cyan-300 font-mono">Shake Phone <span className="text-xs text-green-400">(web supported)</span></span>
                </label>
              </div>
              <span className="text-xs text-cyan-400 font-mono">Default: Power Button (3x)</span>
            </div>
          </div>
        </div>
      )}

      {/* Top bar */}
      

      {/* SOS Button - centered both vertically and horizontally */}
      <div className="flex justify-center items-center" style={{ minHeight: "calc(100vh - 120px)" }}>
        <button
          onClick={handleSOS}
          className={`w-40 h-40 bg-gradient-to-br from-red-600 via-pink-500 to-purple-700 text-white rounded-full shadow-2xl border-4 border-cyan-400 animate-pulse hover:scale-105 hover:shadow-cyan-400/40 active:scale-95 transition-all duration-300 text-2xl font-bold relative
            ${!currentUser ? "opacity-50 cursor-not-allowed" : ""}`}
          style={{ boxShadow: "0 0 40px #00fff7, 0 0 10px #ff00cc inset" }}
          disabled={!currentUser}
        >
          <span className="absolute top-4 left-1/2 -translate-x-1/2 text-xs text-cyan-200 font-mono animate-pulse">DATAFLOW</span>
          SOS
          <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-cyan-200 font-mono animate-pulse">ALERT</span>
        </button>
      </div>
      {!currentUser && (
        <p className="text-center text-cyan-300 font-mono animate-pulse">
          Please log in to use SOS and manage contacts.
        </p>
      )}

      {/* Remove all bottom icon FAB */}
      {/* Contact FAB (only when logged in) */}
      {/* {currentUser && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 z-20">
          ...FAB code...
        </div>
      )} */}
      {/* ...existing code... */}

      {/* Auth Modal */}
      {authModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fade-in">
          <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg shadow-2xl border-2 border-cyan-400 p-6 w-80 animate-fade-in">
            <button
              onClick={() => setAuthModal(false)}
              className="absolute top-4 right-6 text-cyan-400 hover:text-red-500"
            >
              <FaTimes />
            </button>
            <div className="flex justify-center mb-4">
              <FaUserCircle className="text-cyan-300 drop-shadow-glow" size={40} />
            </div>
            <div className="flex justify-center mb-4 gap-2">
              <button
                onClick={() => setAuthMode("login")}
                className={`px-4 py-1 rounded font-mono ${
                  authMode === "login"
                    ? "bg-cyan-500 text-white"
                    : "bg-gray-700 text-cyan-300"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setAuthMode("signup")}
                className={`px-4 py-1 rounded font-mono ${
                  authMode === "signup"
                    ? "bg-green-500 text-white"
                    : "bg-gray-700 text-cyan-300"
                }`}
              >
                Sign-up
              </button>
            </div>

            {authMode === "login" ? (
              <>
                <h2 className="text-xl font-bold mb-2 text-center text-cyan-300 font-mono">Login</h2>
                <input
                  type="email"
                  placeholder="Email"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="w-full mb-2 p-2 border border-cyan-400 rounded bg-gray-900 text-cyan-200 font-mono"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  className="w-full mb-4 p-2 border border-cyan-400 rounded bg-gray-900 text-cyan-200 font-mono"
                />
                <button
                  onClick={handleLogin}
                  className="w-full bg-cyan-500 text-white py-2 rounded font-semibold font-mono hover:bg-cyan-700 transition-all"
                >
                  Login
                </button>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold mb-2 text-center text-green-300 font-mono">Sign-up</h2>
                <input
                  type="text"
                  placeholder="Name"
                  value={authName}
                  onChange={(e) => setAuthName(e.target.value)}
                  className="w-full mb-2 p-2 border border-green-400 rounded bg-gray-900 text-green-200 font-mono"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="w-full mb-2 p-2 border border-green-400 rounded bg-gray-900 text-green-200 font-mono"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  className="w-full mb-4 p-2 border border-green-400 rounded bg-gray-900 text-green-200 font-mono"
                />
                <button
                  onClick={handleSignup}
                  className="w-full bg-green-500 text-white py-2 rounded font-semibold font-mono hover:bg-green-700 transition-all"
                >
                  Sign-up
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Modal for contacts */}
      {modal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fade-in">
          <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg shadow-2xl border-2 border-cyan-400 p-6 w-80 animate-fade-in">
            <button
              onClick={() => {
                setModal(null);
                setEditingContact(null);
                setName("");
                setPhone("");
              }}
              className="absolute top-4 right-6 text-cyan-400 hover:text-red-500"
            >
              <FaTimes />
            </button>

            {/* Add */}
            {modal === "add" && (
              <>
                <h2 className="text-xl font-bold mb-4 text-cyan-300 font-mono">Add Emergency Contact</h2>
                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full mb-2 p-2 border border-cyan-400 rounded bg-gray-900 text-cyan-200 font-mono"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full mb-4 p-2 border border-cyan-400 rounded bg-gray-900 text-cyan-200 font-mono"
                />
                <button
                  onClick={handleAddContact}
                  className="w-full bg-cyan-500 text-white py-2 rounded font-mono hover:bg-cyan-700 transition-all"
                >
                  Save
                </button>
              </>
            )}

            {/* Edit */}
            

            {/* Show */}
            {modal === "show" && (
              <>
                <h2 className="text-xl font-bold mb-4 text-purple-300 font-mono">Contact List</h2>
                {contacts.length === 0 ? (
                  <p className="text-gray-400 font-mono">No contacts yet.</p>
                ) : (
                  <ul className="space-y-2 max-h-40 overflow-y-auto">
                    {contacts.map((c) => (
                      <li
                        key={c.id}
                        className="p-2 bg-gray-900 border border-cyan-400 rounded text-cyan-200 font-mono"
                      >
                        {c.name} - {c.number}
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Animations */}
      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.7s cubic-bezier(.4,0,.2,1);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95);}
          to { opacity: 1; transform: scale(1);}
        }
        .drop-shadow-glow {
          filter: drop-shadow(0 0 8px #00fff7);
        }
      `}</style>
    </div>
  );
}

export default App;
        