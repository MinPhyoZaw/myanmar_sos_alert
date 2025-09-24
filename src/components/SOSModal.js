import React from "react";

function SOSModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-80 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">⚠️ Send SOS?</h2>
        <p className="text-gray-600 mb-6">
          This will notify your emergency contacts that you are not safe.
        </p>

        <div className="flex justify-between gap-4">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-700 font-semibold py-2 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              alert("🚨 SOS Sent (UI Only)"); // Placeholder
              onClose();
            }}
            className="flex-1 bg-red-600 text-white font-semibold py-2 rounded-lg hover:bg-red-700"
          >
            Send SOS
          </button>
        </div>
      </div>
    </div>
  );
}

export default SOSModal;
