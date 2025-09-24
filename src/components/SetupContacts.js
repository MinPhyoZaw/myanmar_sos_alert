import React, { useState, useEffect } from "react";

function SetupContacts({ contacts, setContacts }) {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");

  // Load contacts from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("contacts")) || [];
    setContacts(saved);
  }, [setContacts]);

  // Add a new contact
  const addContact = () => {
    if (!name || !phone) return;

    const newContact = { id: Date.now(), name, number: phone };
    const updated = [...contacts, newContact];
    setContacts(updated);
    localStorage.setItem("contacts", JSON.stringify(updated));
    setName("");
    setPhone("");
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-2 dark:text-white">
        Add Emergency Contacts
      </h2>
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="flex-1 p-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
        />
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone number"
          className="flex-1 p-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
        />
        <button
          onClick={addContact}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Add
        </button>
      </div>

      {contacts.length > 0 && (
        <ul className="space-y-1 dark:text-white">
          {contacts.map((c) => (
            <li key={c.id}>
              {c.name} - {c.number}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SetupContacts;
