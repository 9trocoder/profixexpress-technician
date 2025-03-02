// src/pages/UploadProof.js
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { ref as dbRef, update } from "firebase/database";
import { db, storage } from "../utilities/firebaseConfig";

const UploadProof = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files[0]) setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    const fileRef = storageRef(storage, `proofs/${taskId}/${file.name}`);
    try {
      const snapshot = await uploadBytes(fileRef, file);
      const url = await getDownloadURL(snapshot.ref);
      await update(dbRef(db, `tasks/${taskId}`), { proofUrl: url });
      alert("Proof uploaded successfully.");
      navigate(`/task_details/${taskId}`);
    } catch (error) {
      console.error("Error uploading file:", error.message);
    }
  };

  return (
    <div>
      <h2>Upload Task Completion Proof</h2>
      <input type="file" onChange={handleFileChange} accept="image/*" />
      <button onClick={handleUpload}>Upload Proof</button>
      <button onClick={() => navigate(-1)}>Cancel</button>
    </div>
  );
};

export default UploadProof;
