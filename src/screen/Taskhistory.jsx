// src/pages/TaskHistory.js
import React, { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { Link } from "react-router-dom";
import { auth, db } from "../utilities/firebaseConfig";

const TaskHistory = () => {
  const [completedTasks, setCompletedTasks] = useState([]);

  useEffect(() => {
    const user = auth.currentUser;
    const tasksRef = ref(db, "tasks");
    onValue(tasksRef, (snapshot) => {
      if (snapshot.exists()) {
        const tasksData = Object.entries(snapshot.val()).map(([id, task]) => ({ id, ...task }));
        const myCompletedTasks = tasksData.filter(task => task.technicianId === user.uid && task.status === "completed");
        setCompletedTasks(myCompletedTasks);
      }
    });
  }, []);

  return (
    <div>
      <h2>Task History</h2>
      {completedTasks.length > 0 ? (
        completedTasks.map(task => (
          <div key={task.id} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
            <h4>{task.title}</h4>
            <p>Status: {task.status}</p>
            <Link to={`/task/${task.id}`}>View Details</Link>
          </div>
        ))
      ) : (
        <p>No completed tasks.</p>
      )}
      <Link to="/dashboard">Back to Dashboard</Link>
    </div>
  );
};

export default TaskHistory;
