// src/pages/Earnings.js
import React, { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { Link } from "react-router-dom";
import { auth, db } from "../utilities/firebaseConfig";

const Earnings = () => {
  const [payments, setPayments] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);

  useEffect(() => {
    const user = auth.currentUser;
    const paymentsRef = ref(db, `payments/${user.uid}`);
    onValue(paymentsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const paymentArray = Object.entries(data).map(([id, payment]) => ({ id, ...payment }));
        setPayments(paymentArray);
        const total = paymentArray.reduce((acc, curr) => acc + (curr.amount || 0), 0);
        setTotalEarnings(total);
      }
    });
  }, []);

  return (
    <div>
      <h2>Earnings</h2>
      <h3>Total Earnings: ${totalEarnings.toFixed(2)}</h3>
      {payments.length > 0 ? (
        payments.map((payment) => (
          <div key={payment.id} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
            <p><strong>Amount:</strong> ${payment.amount}</p>
            <p><strong>Date:</strong> {new Date(payment.date).toLocaleString()}</p>
            <p><strong>Task ID:</strong> {payment.taskId}</p>
          </div>
        ))
      ) : (
        <p>No payment records found.</p>
      )}
      <Link to="/dashboard">Back to Dashboard</Link>
    </div>
  );
};

export default Earnings;
