import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";

async function addDummyUser() {
  try {
    const docRef = await addDoc(collection(db, "users"), {
      name: "min",
      email: "example123@gmail.com",
      contact: "+959969471202"
    });
    console.log("Dummy user added with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding dummy user: ", e);
  }
}

addDummyUser();
