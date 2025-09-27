import React, { useState, useEffect } from "react";
import { FaUserCircle, FaUserFriends, FaPlus, FaEdit, FaEye, FaCog, FaTimes } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
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
import Navbar from "./components/Navbar";
import MenuDrawer from "./components/MenuDrawer";
import AuthModal from "./components/AuthModal";
import SettingsPanel from "./components/SettingsPanel";
import ContactModal from "./components/ContactModal";

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
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ backgroundColor: "#000B58", color: "#fff" }}
    >
      <TechPatternBg />

      {/* Navbar */}
      <Navbar
        currentUser={currentUser}
        onMenuClick={() => setNavbarMenuOpen(true)}
      />

      {/* Menu Drawer */}
      <MenuDrawer
        open={navbarMenuOpen}
        onClose={() => setNavbarMenuOpen(false)}
        currentUser={currentUser}
        setAuthModal={setAuthModal}
        setAuthMode={setAuthMode}
        setModal={setModal}
        setSettingsOpen={setSettingsOpen}
        handleLogout={handleLogout}
      />

      {/* Settings Slide-in Panel */}
      <SettingsPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        notificationEnabled={notificationEnabled}
        setNotificationEnabled={setNotificationEnabled}
        sosTrigger={sosTrigger}
        setSosTrigger={setSosTrigger}
      />

      {/* SOS Button */}
      <div className="flex justify-center items-center" style={{ minHeight: "calc(100vh - 120px)" }}>
        <button
          onClick={handleSOS}
          className={`w-40 h-40 bg-red-500   text-white rounded-full shadow-2xl border-4 hover:scale-105 hover:shadow-cyan-400/40 active:scale-95 transition-all duration-300 text-2xl font-bold relative
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

      {/* Contact Modal */}
      <ContactModal
        modal={modal}
        setModal={setModal}
        contacts={contacts}
        name={name}
        setName={setName}
        phone={phone}
        setPhone={setPhone}
        editingContact={editingContact}
        setEditingContact={setEditingContact}
        handleAddContact={handleAddContact}
        handleEditContact={handleEditContact}
      />

      {/* Auth Modal */}
      <AuthModal
        open={authModal}
        onClose={() => setAuthModal(false)}
        authMode={authMode}
        setAuthMode={setAuthMode}
        authEmail={authEmail}
        setAuthEmail={setAuthEmail}
        authPassword={authPassword}
        setAuthPassword={setAuthPassword}
        authName={authName}
        setAuthName={setAuthName}
        handleLogin={handleLogin}
        handleSignup={handleSignup}
      />

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

