import { ref, set, get } from "firebase/database";
import { db } from '../firebase'; // This should now correctly point to firebase.js in the src folder

export const addDocumentToDatabase = async () => {
  const docRef = ref(db, 'documents/doc1');
  
  // Check if document already exists
  const snapshot = await get(docRef);
  if (snapshot.exists()) {
    console.log("Document already exists, skipping addition");
    return;
  }

  set(docRef, {
    title: "Non-Disclosure Agreement",
    description: "Standard NDA document for review",
    status: "pending",
    pdfUrl: "nda.pdf",
    uploadDate: "2024-06-23"
  })
  .then(() => {
    console.log("Document added successfully");
  })
  .catch((error) => {
    console.error("Error adding document: ", error);
  });
};
