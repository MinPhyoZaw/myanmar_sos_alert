import React from "react";
import { FaUserCircle } from "react-icons/fa";

function Navbar({ currentUser, onMenuClick }) {
  return (
    <div className="flex items-center justify-between px-6 py-4 bg-[#000B58] shadow-lg border-b border-cyan-800">
      <span className="text-2xl font-bold text-white font-mono tracking-widest">SafetyStep</span>
      <button
        onClick={onMenuClick}
        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-800 transition"
        title={currentUser ? currentUser.email : "Menu"}
      >
        <FaUserCircle className="text-white" size={28} />
      </button>
    </div>
  );
}

export default Navbar;
