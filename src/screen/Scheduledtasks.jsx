// src/pages/ScheduledTasks.js
import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { ref, onValue } from "firebase/database";
import { auth, db } from "../utilities/firebaseConfig";

const ScheduledTasks = () => {
  const [date, setDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const tasksRef = ref(db, "tasks");
      onValue(tasksRef, (snapshot) => {
        if (snapshot.exists()) {
          const tasksData = Object.entries(snapshot.val()).map(([id, task]) => ({ id, ...task }));
          const myTasks = tasksData.filter((task) => task.technicianId === user.uid && task.scheduledDate);
          setTasks(myTasks);
        }
      });
    }
  }, []);

  const tasksForDate = tasks.filter((task) => {
    const taskDate = new Date(task.scheduledDate);
    return taskDate.toDateString() === date.toDateString();
  });

  return (
    <div>
      <h2>Scheduled Tasks</h2>
      <Calendar onChange={setDate} value={date} />
      <h3>Tasks on {date.toDateString()}</h3>
      {tasksForDate.length > 0 ? (
        tasksForDate.map((task) => (
          <div key={task.id} style={{ border: "1px solid #ccc", padding: "10px", margin: "10px" }}>
            <h4>{task.title}</h4>
            <p>{task.description}</p>
          </div>
        ))
      ) : (
        <p>No tasks scheduled for this date.</p>
      )}
    </div>
  );
};

export default ScheduledTasks;
