// src/pages/Availability.js
import React, { useState, useEffect } from "react";
import { ref, get, update } from "firebase/database";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../utilities/firebaseConfig";

const Availability = () => {
  const navigate = useNavigate();
  const [availability, setAvailability] = useState("");

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const availabilityRef = ref(db, `technicians/${user.uid}/availability`);
      get(availabilityRef).then((snapshot) => {
        if (snapshot.exists()) {
          setAvailability(snapshot.val());
        }
      });
    }
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (user) {
      await update(ref(db, `technicians/${user.uid}`), { availability });
      alert("Availability updated.");
      navigate("/dashboard");
    }
  };

  return (
    <div>
      <h2>Update Availability</h2>
      <form onSubmit={handleSave}>
        <textarea placeholder="Enter your availability schedule (e.g., Monday morning, Tuesday afternoon, etc.)" value={availability} onChange={(e) => setAvailability(e.target.value)} rows="4" cols="50" required />
        <br />
        <button type="submit">Save Availability</button>
      </form>
      <button onClick={() => navigate("/dashboard")}>Cancel</button>
    </div>
  );
};

export default Availability;
