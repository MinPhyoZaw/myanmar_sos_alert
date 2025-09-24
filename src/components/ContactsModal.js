import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, TextField, Button, IconButton, List, ListItem } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

function ContactsModal({ open, onClose, contacts, setContacts }) {
  const [phone, setPhone] = useState("");

  const addContact = () => {
    if (!phone) return;
    const updated = [...contacts, phone];
    setContacts(updated);
    localStorage.setItem("contacts", JSON.stringify(updated));
    setPhone("");
  };

  const removeContact = (phoneToRemove) => {
    const updated = contacts.filter((c) => c !== phoneToRemove);
    setContacts(updated);
    localStorage.setItem("contacts", JSON.stringify(updated));
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Emergency Contacts</DialogTitle>
      <DialogContent>
        <div className="flex gap-2 mb-4">
          <TextField
            label="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            fullWidth
            variant="outlined"
            size="small"
          />
          <Button onClick={addContact} variant="contained" color="success">Add</Button>
        </div>
        <List>
          {contacts.map((c, i) => (
            <ListItem key={i} className="flex justify-between items-center">
              {c}
              <IconButton onClick={() => removeContact(c)} color="error">
                <DeleteIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
}

export default ContactsModal;
