import React from "react";
import { FaTimes } from "react-icons/fa";

function ContactModal({
  modal,
  setModal,
  contacts,
  name,
  setName,
  phone,
  setPhone,
  editingContact,
  setEditingContact,
  handleAddContact,
  handleEditContact
}) {
  if (!modal) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fade-in">
      <div className="relative bg-[#000B58] rounded-lg shadow-2xl border-2 border-white p-6 w-80 animate-fade-in">
        <button
          onClick={() => {
            setModal(null);
            setEditingContact(null);
            setName("");
            setPhone("");
          }}
          className="absolute top-4 right-6 text-white hover:text-red-500"
        >
          <FaTimes />
        </button>
        {/* Add */}
        {modal === "add" && (
          <>
            <h2 className="text-xl font-bold mb-4 text-white font-mono">Add Contact</h2>
            <input
              type="text"
              placeholder="Name"
              value={name}
              
              onChange={(e) => setName(e.target.value)}
              className="w-full mb-2 p-2 border border-white rounded bg-white text-black font-mono"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full mb-4 p-2 border border-white rounded bg-white text-black  font-mono"
            />
            <button
              onClick={handleAddContact}
              className="w-full bg-[#000B58] text-white py-2 rounded border border-whitefont-mono hover:bg-cyan-700 transition-all"
            >
              Save
            </button>
          </>
        )}
        {/* Edit */}
        {modal === "edit" && (
          <>
            <h2 className="text-xl font-bold mb-4 text-yellow-300 font-mono">Edit Contact</h2>
            {contacts.length === 0 ? (
              <p className="text-gray-400 font-mono">No contacts yet to edit.</p>
            ) : (
              <>
                <ul className="max-h-40 overflow-y-auto space-y-1 mb-2">
                  {contacts.map((c) => (
                    <li
                      key={c.id}
                      className="p-2 bg-white border border-white rounded cursor-pointer  text-black font-mono"
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
                    className="w-full bg-yellow-500 text-white py-2 rounded font-mono hover:bg-yellow-700 transition-all"
                  >
                    Update
                  </button>
                )}
              </>
            )}
          </>
        )}
        {/* Show */}
        {modal === "show" && (
          <>
            <h2 className="text-xl font-bold mb-4 text-white font-mono">Contact List</h2>
            {contacts.length === 0 ? (
              <p className="text-white font-mono">No contacts yet.</p>
            ) : (
              <ul className="space-y-2 max-h-40 overflow-y-auto">
                {contacts.map((c) => (
                  <li
                    key={c.id}
                    className="p-2 bg-gray-900 border border-white rounded text-white font-mono"
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
  );
}

export default ContactModal;
