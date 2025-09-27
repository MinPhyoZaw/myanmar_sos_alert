import React from "react";

function SOSButton({ contacts }) {
  const handleSOS = () => {
    if (!contacts.length) {
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

  return (
    <div className="flex justify-center mt-4">
      <button
        onClick={handleSOS}
        className="w-40 h-40 bg-yellow-600 text-white rounded-full shadow-2xl animate-pulse hover:bg-red-700 active:scale-95 transition duration-200"
      >
        SOS
      </button>
    </div>
  );
}

export default SOSButton;
