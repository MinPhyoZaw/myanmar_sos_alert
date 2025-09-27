import React from "react";
import { FaTimes, FaUserCircle } from "react-icons/fa";

function AuthModal({
  open,
  onClose,
  authMode,
  setAuthMode,
  authEmail,
  setAuthEmail,
  authPassword,
  setAuthPassword,
  authName,
  setAuthName,
  handleLogin,
  handleSignup
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fade-in">
      <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg shadow-2xl border-2 border-cyan-400 p-6 w-80 animate-fade-in">
        <button
          onClick={onClose}
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
  );
}

export default AuthModal;
