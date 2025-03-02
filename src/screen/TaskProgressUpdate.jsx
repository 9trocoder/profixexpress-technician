import React, { useState } from "react";
import { ref, update } from "firebase/database";
import { db } from "../utilities/firebaseConfig";

const TaskProgressUpdate = ({ taskId }) => {
  const [progress, setProgress] = useState("");

  const handleUpdate = async () => {
    try {
      await update(ref(db, `tasks/${taskId}`), { progress });
      alert("Task progress updated.");
    } catch (error) {
      console.error("Error updating progress:", error.message);
    }
  };

  return (
    <div>
      <h3>Update Task Progress</h3>
      <input type="number" placeholder="Progress (%)" value={progress} onChange={(e) => setProgress(e.target.value)} min="0" max="100" />
      <button onClick={handleUpdate}>Update Progress</button>
    </div>
  );
};

export default TaskProgressUpdate;
