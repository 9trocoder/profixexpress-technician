// src/pages/RaiseDispute.js
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ref, push } from "firebase/database";
import { auth, db } from "../utilities/firebaseConfig";

const RaiseDispute = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const disputeData = {
      taskId,
      technicianId: auth.currentUser.uid,
      description,
      status: "open",
      timestamp: Date.now(),
    };
    try {
      await push(ref(db, "disputes"), disputeData);
      alert("Dispute raised successfully.");
      navigate(`/task_details/${taskId}`);
    } catch (error) {
      console.error("Error raising dispute:", error.message);
    }
  };

  return (
    <div>
      <h2>Raise Dispute for Task: {taskId}</h2>
      <form onSubmit={handleSubmit}>
        <textarea placeholder="Describe the issue..." value={description} onChange={(e) => setDescription(e.target.value)} required rows="5" cols="50" />
        <br />
        <button type="submit">Submit Dispute</button>
      </form>
      <button onClick={() => navigate(-1)}>Cancel</button>
    </div>
  );
};

export default RaiseDispute;
