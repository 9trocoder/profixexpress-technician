// src/pages/Analytics.js
import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { ref, onValue } from "firebase/database";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { auth, db } from "../utilities/firebaseConfig";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Analytics = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const tasksRef = ref(db, "jobs");
      onValue(tasksRef, (snapshot) => {
        if (snapshot.exists()) {
          const tasksData = Object.entries(snapshot.val()).map(([id, task]) => ({ id, ...task }));
          const myTasks = tasksData.filter((task) => task.technicianId === user.uid);
          const accepted = myTasks.filter((task) => task.status === "accepted").length;
          const rejected = myTasks.filter((task) => task.status === "rejected").length;
          const completed = myTasks.filter((task) => task.status === "completed").length;
          setChartData({
            labels: ["Accepted", "Rejected", "Completed"],
            datasets: [
              {
                label: "Task Count",
                data: [accepted, rejected, completed],
                backgroundColor: ["#36A2EB", "#FF6384", "#4BC0C0"],
              },
            ],
          });
        }
      });
    }
  }, []);

  return (
    <div>
      <h2>Analytics Dashboard</h2>
      <Bar data={chartData} />
    </div>
  );
};

export default Analytics;
