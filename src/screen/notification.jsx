// src/pages/Notifications.js
import React, { useState, useEffect } from "react";

import { ref, onValue, update } from "firebase/database";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../utilities/firebaseConfig";

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const userId = auth.currentUser.uid;
    const notificationRef = ref(db, `notifications/${userId}`);
    onValue(notificationRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const notifArray = Object.entries(data).map(([id, notif]) => ({ id, ...notif }));
        setNotifications(notifArray);
      }
    });
  }, []);

  const markAsRead = (notifId) => {
    update(ref(db, `notifications/${auth.currentUser.uid}/${notifId}`), { read: true });
  };

  return (
    <div>
      <h2>Notifications</h2>
      {notifications.length > 0 ? (
        notifications.map((notif) => (
          <div key={notif.id} style={{ background: notif.read ? "#eee" : "#fff", margin: "10px", padding: "10px", border: "1px solid #ccc" }}>
            <h4>{notif.title}</h4>
            <p>{notif.message}</p>
            {!notif.read && <button onClick={() => markAsRead(notif.id)}>Mark as Read</button>}
          </div>
        ))
      ) : (
        <p>No notifications.</p>
      )}
      <button onClick={() => navigate("/dashboard")}>Back to Dashboard</button>
    </div>
  );
};

export default Notifications;
