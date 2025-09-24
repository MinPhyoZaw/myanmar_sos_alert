import React, { useState, useEffect } from "react";
import { FaUserFriends, FaPlus, FaEdit, FaEye, FaTimes } from "react-icons/fa";
import { BsMoon, BsSun } from "react-icons/bs";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [modal, setModal] = useState(null); // "add" | "edit" | "show" | null
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [editingContact, setEditingContact] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // Load contacts from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("contacts")) || [];
    setContacts(saved);
  }, []);

  // Save contacts whenever changed
  useEffect(() => {
    localStorage.setItem("contacts", JSON.stringify(contacts));
  }, [contacts]);

  // Dark mode toggle
  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);

  // Add contact
  const handleAddContact = () => {
    if (!name || !phone) return;
    const newContact = { id: Date.now(), name, number: phone };
    const updated = [...contacts, newContact];
    setContacts(updated);
    setName("");
    setPhone("");
    setModal(null);
  };

  // Edit contact
  const handleEditContact = () => {
    if (!editingContact) return;
    const updated = contacts.map((c) =>
      c.id === editingContact.id ? { ...c, name, number: phone } : c
    );
    setContacts(updated);
    setEditingContact(null);
    setName("");
    setPhone("");
    setModal(null);
  };

  // SOS button
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

        // Ensure contacts are in correct object format
        const formattedContacts = contacts.map((c) => ({
          name: c.name || "",
          number: c.number,
        }));

        try {
          const res = await fetch("http://localhost:5000/send-sos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contacts: formattedContacts, location }),
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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      {/* Top bar */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 shadow-lg"
        >
          {darkMode ? <BsSun className="text-yellow-500" /> : <BsMoon className="text-gray-700" />}
        </button>
      </div>

      {/* SOS Button */}
      <div className="flex justify-center mb-6">
        <button
          onClick={handleSOS}
          className="w-40 h-40 bg-red-600 text-white rounded-full shadow-2xl animate-pulse hover:bg-red-700 active:scale-95 transition duration-200 text-2xl font-bold"
        >
          SOS
        </button>
      </div>

      {/* Contact FAB */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="w-14 h-14 flex items-center justify-center rounded-full bg-blue-500 text-white shadow-lg hover:scale-110 transition-transform"
        >
          <FaUserFriends size={22} />
        </button>

        {menuOpen && (
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white dark:bg-gray-800 rounded-full px-3 py-2 shadow-lg">
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

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 w-80">
            <button
              onClick={() => {
                setModal(null);
                setEditingContact(null);
                setName("");
                setPhone("");
              }}
              className="absolute top-4 right-6 text-gray-500 hover:text-red-500"
            >
              <FaTimes />
            </button>

            {/* Add Contact */}
            {modal === "add" && (
              <>
                <h2 className="text-xl font-bold mb-4">Add Contact</h2>
                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full mb-2 p-2 border rounded"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full mb-4 p-2 border rounded"
                />
                <button
                  onClick={handleAddContact}
                  className="w-full bg-green-500 text-white py-2 rounded"
                >
                  Save
                </button>
              </>
            )}

            {/* Edit Contact */}
            {modal === "edit" && (
              <>
                <h2 className="text-xl font-bold mb-4">Edit Contact</h2>
                {contacts.length === 0 ? (
                  <p className="text-gray-600 dark:text-gray-400">No contacts yet to edit.</p>
                ) : (
                  <>
                    <ul className="max-h-40 overflow-y-auto space-y-1 mb-2">
                      {contacts.map((c) => (
                        <li
                          key={c.id}
                          className="p-2 bg-gray-100 dark:bg-gray-800 rounded cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
                          onClick={() => {
                            setEditingContact(c);
                            setName(c.name);
                            setPhone(c.number);
                          }}
                        >
                          {c.name} - {c.number}
                        </li>
                      ))}
                    </ul>
                    {editingContact && (
                      <button
                        onClick={handleEditContact}
                        className="w-full bg-yellow-500 text-white py-2 rounded"
                      >
                        Update
                      </button>
                    )}
                  </>
                )}
              </>
            )}

            {/* Show Contacts */}
            {modal === "show" && (
              <>
                <h2 className="text-xl font-bold mb-4">Contact List</h2>
                {contacts.length === 0 ? (
                  <p className="text-gray-600 dark:text-gray-400">No contacts yet.</p>
                ) : (
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
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
