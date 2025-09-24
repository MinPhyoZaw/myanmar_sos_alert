import React from "react";

function ContactList({ contacts, setContacts }) {
  const removeContact = (phone) => {
    const updated = contacts.filter((c) => c !== phone);
    setContacts(updated);
    localStorage.setItem("contacts", JSON.stringify(updated));
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-2 dark:text-white">Your Contacts</h2>
      <ul>
        {contacts.map((phone, index) => (
          <li
            key={index}
            className="flex justify-between items-center p-2 mb-2 bg-gray-100 dark:bg-gray-800 rounded"
          >
            <span className="text-gray-800 dark:text-white">{phone}</span>
            <button
              onClick={() => removeContact(phone)}
              className="text-red-600 font-bold hover:text-red-800"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ContactList;
