import React, { useState, useEffect } from "react";
import { FaUserFriends, FaPlus, FaEdit, FaEye } from "react-icons/fa";
import { BsMoon, BsSun } from "react-icons/bs";

function BottomBar({ darkMode, setDarkMode }) {
  const [open, setOpen] = useState(false);
  const [modal, setModal] = useState(null); // "add" | "edit" | "show" | null
  const [contacts, setContacts] = useState([]);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  // Load contacts from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("contacts")) || [];
    setContacts(saved);
  }, []);

  // Save contacts to localStorage
  useEffect(() => {
    localStorage.setItem("contacts", JSON.stringify(contacts));
  }, [contacts]);

  // Handle Add Contact
  const handleAddContact = () => {
    if (!name || !phone) return;
    const newContact = { id: Date.now(), name, number: phone };
    setContacts([...contacts, newContact]);
    setName("");
    setPhone("");
    setModal(null);
  };

  // Handle SOS
  const handleSOS = () => {
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

  return (
    <>
      {/* Bottom Bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-8">
        {/* Contact FAB */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="w-14 h-14 flex items-center justify-center rounded-full bg-blue-500 text-white shadow-lg hover:scale-110 transition-transform"
          >
            <FaUserFriends size={22} />
          </button>

          {open && (
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-white dark:bg-gray-800 rounded-full px-4 py-2 shadow-lg">
              <button
                onClick={() => setModal("add")}
                className="w-12 h-12 flex items-center justify-center rounded-full bg-green-500 text-white hover:scale-110 transition-transform"
              >
                <FaPlus size={18} />
              </button>

              <button
                onClick={() => setModal("edit")}
                className="w-12 h-12 flex items-center justify-center rounded-full bg-yellow-500 text-white hover:scale-110 transition-transform"
              >
                <FaEdit size={18} />
              </button>

              <button
                onClick={() => setModal("show")}
                className="w-12 h-12 flex items-center justify-center rounded-full bg-purple-500 text-white hover:scale-110 transition-transform"
              >
                <FaEye size={18} />
              </button>
            </div>
          )}
        </div>

        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="w-14 h-14 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 shadow-lg hover:scale-110 transition-transform"
        >
          {darkMode ? (
            <BsSun size={22} className="text-yellow-500" />
          ) : (
            <BsMoon size={22} className="text-gray-700" />
          )}
        </button>

        {/* SOS Button */}
        <button
          onClick={handleSOS}
          className="w-20 h-20 bg-red-600 text-white rounded-full shadow-2xl animate-pulse hover:bg-red-700 active:scale-95 transition duration-200"
        >
          SOS
        </button>
      </div>

      {/* MODALS */}
      {modal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 w-80">
            {/* Close Button */}
            <button
              onClick={() => setModal(null)}
              className="absolute top-4 right-6 text-gray-500 hover:text-red-500"
            >
              ✕
            </button>

            {modal === "add" && (
              <>
                <h2 className="text-xl font-bold mb-4">Add New Contact</h2>
                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full mb-3 p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full mb-3 p-2 border rounded"
                />
                <button
                  onClick={handleAddContact}
                  className="w-full bg-green-500 text-white p-2 rounded"
                >
                  Save
                </button>
              </>
            )}

            {modal === "edit" && (
              <>
                <h2 className="text-xl font-bold mb-4">Edit Contact</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  (Editing feature coming soon)
                </p>
              </>
            )}

            {modal === "show" && (
              <>
                <h2 className="text-xl font-bold mb-4">Contact List</h2>
                {contacts.length > 0 ? (
                  <ul className="space-y-2 max-h-40 overflow-y-auto">
                    {contacts.map((c) => (
                      <li
                        key={c.id}
                        className="p-2 bg-gray-100 dark:bg-gray-800 rounded"
                      >
                        {c.name} - {c.number}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">
                    No contacts yet.
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default BottomBar;
