import React from "react";
import { FaUserCircle, FaUserFriends, FaPlus, FaCog, FaTimes, FaEnvelope } from "react-icons/fa";

function MenuDrawer({
  open,
  onClose,
  currentUser,
  setAuthModal,
  setAuthMode,
  setModal,
  setSettingsOpen,
  handleLogout
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      <div
        className="fixed top-0 left-0 h-full w-80 bg-gradient-to-br bg-[#000B58] shadow-2xl border-r-2 border-cyan-400 p-6 animate-fade-in flex flex-col"
        style={{ zIndex: 60 }}
        onClick={e => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-6 text-white hover:text-red-500"
          onClick={onClose}
        >
          <FaTimes />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-white font-mono">PROFILE</h2>
        <div className="flex flex-col gap-6 mt-4">
          {/* Show user info as separate buttons if logged in */}
          {currentUser && (
            <div className="flex flex-col gap-2 mb-2">
              <button
                className="flex items-center gap-3 px-4 py-3 border  rounded-full bg-white  transition font-mono text-white shadow-md hover:shadow-cyan-400/40"
                style={{ cursor: "default" }}
                disabled
              >
                <FaUserCircle className="text-[#000B58]" size={22} />
                <span className="text-black">{currentUser.displayName || "No Name"}</span>
              </button>

              <button
                className="flex items-center mt-3 gap-3 px-4 py-3 border  rounded-full bg-white hover:bg-cyan-950 transition font-mono text-black shadow-md hover:shadow-cyan-400/40"
                style={{ cursor: "default" }}
                disabled
              >
                <FaEnvelope className="text-[#000B58]" size={18} />
                <span className="break-all">{currentUser.email}</span>
              </button>
            </div>
          )}
          {/* View Contacts */}
          <button
            className="flex items-center gap-3 px-4 py-3 border rounded-full bg-white hover:bg-cyan-950 transition font-mono text-black shadow-md hover:shadow-cyan-400/40"
            onClick={() => {
              onClose();
              setModal("show");
            }}
          >
            <FaUserFriends className="text-[#000B58]" size={22} />
            <span>View Contacts</span>
          </button>
          {/* Add Contact */}
          <button
            className="flex items-center gap-3 px-4 py-3 border rounded-full bg-white transition font-mono text-black shadow-md hover:shadow-cyan-400/40"
            onClick={() => {
              onClose();
              setModal("add");
            }}
          >
            <FaPlus className="text-[#000B58]" size={22} />
            <span>Add Contact</span>
          </button>
          {/* Settings */}
          <button
            className="flex items-center gap-3 px-4 py-3 border  rounded-full bg-white  transition font-mono text-black shadow-md hover:shadow-cyan-400/40"
            onClick={() => {
              onClose();
              setSettingsOpen(true);
            }}
          >
            <FaCog className="text-[#000B58]" size={22} />
            <span>Settings</span>
          </button>
          {/* Auth buttons for not logged in */}
          {!currentUser && (
            <div className="flex gap-2 mt-2">
              <button
                className="flex-1 px-4 py-2 rounded-lg bg-cyan-500 text-white font-mono font-bold hover:bg-cyan-700 transition"
                onClick={() => {
                  onClose();
                  setAuthMode("login");
                  setAuthModal(true);
                }}
              >
                Login
              </button>
              <button
                className="flex-1 px-4 py-2 rounded-lg bg-green-500 text-white font-mono font-bold hover:bg-green-700 transition"
                onClick={() => {
                  onClose();
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
                onClose();
              }}
            >
              Logout
            </button>
          )}
        </div>
        <div className="mt-auto pt-6">
          <hr className="border-white mb-2" />
          <div className="text-xs text-white text-center font-mono">
            &copy; {new Date().getFullYear()} SafetyStep
          </div>
        </div>
      </div>
    </div>
  );
}

export default MenuDrawer;
       
