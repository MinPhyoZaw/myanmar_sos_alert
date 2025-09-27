import React from "react";
import { FaTimes } from "react-icons/fa";
import sosImage from "../assets/sos-icon.png"; // Ensure you have an SOS icon in assets
function SettingsPanel({
  open,
  onClose,
  notificationEnabled,
  setNotificationEnabled,
  sosTrigger,
  setSosTrigger
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      <div
        className="fixed top-0 left-0 h-full w-80 bg-[#000B58] shadow-2xl border-r-2 p-6 animate-fade-in relative"
        style={{ zIndex: 60 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-6 text-cyan-400 hover:text-red-500"
          onClick={onClose}
        >
          <FaTimes />
        </button>

        {/* Heading */}
        <h2 className="text-2xl font-bold mb-6 text-white font-mono">Settings</h2>
        <hr className="border-white " />
        <br />

        {/* Notifications */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white font-mono">Notifications</span>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationEnabled}
                onChange={(e) => setNotificationEnabled(e.target.checked)}
                className="sr-only"
              />
              <div
                className={`w-10 h-6 flex items-center bg-gray-700 rounded-full p-1 transition-colors ${
                  notificationEnabled ? "bg-green-500" : "bg-gray-700"
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    notificationEnabled ? "translate-x-4" : ""
                  }`}
                ></div>
              </div>
            </label>
          </div>
          <span className="text-xs text-white font-mono">
            Enable/Disable notifications
          </span>
        </div>

        {/* SOS Trigger */}
        <div className="mb-6">
          <div className="text-white font-mono mb-2">SOS Trigger</div>
          <hr className="border-white mt-2" />
          <br />
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="sosTrigger"
                value="power"
                checked={sosTrigger === "power"}
                onChange={() => setSosTrigger("power")}
              />
              <span className="text-white font-mono">
                Triple-press Power Button
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="sosTrigger"
                value="shake"
                checked={sosTrigger === "shake"}
                onChange={() => setSosTrigger("shake")}
              />
              <span className="text-white font-mono">Shake Phone</span>
            </label>
          </div>
          <span className="text-xs text-white font-mono">
            Default: Power Button (3x)
          </span>
        </div>

        {/* 🔽 Bottom-Center SVG Icon */}
        {/* <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
          <img src={sosImage} alt="SOS Icon" className="w-30 h-30" />
        </div> */}
      </div>
    </div>
  );
}

export default SettingsPanel;
