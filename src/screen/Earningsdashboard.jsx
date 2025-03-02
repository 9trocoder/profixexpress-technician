// src/pages/EarningsDashboard.js
import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { ref, onValue } from "firebase/database";
import { auth, db } from "../utilities/firebaseConfig";

const EarningsDashboard = () => {
  const [earnings, setEarnings] = useState([]);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const earningsRef = ref(db, `earnings/${user.uid}`);
      onValue(earningsRef, (snapshot) => {
        if (snapshot.exists()) {
          setEarnings(Object.values(snapshot.val()));
        }
      });
    }
  }, []);

  const totalEarnings = earnings.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div>
      <h2>Earnings Dashboard</h2>
      <h3>Total Earnings: ${totalEarnings.toFixed(2)}</h3>
      <Bar
        data={{
          labels: earnings.map((e) => e.date),
          datasets: [{ label: "Earnings", data: earnings.map((e) => e.amount), backgroundColor: "#4CAF50" }],
        }}
      />
    </div>
  );
};

export default EarningsDashboard;
