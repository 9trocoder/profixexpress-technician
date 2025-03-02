// src/pages/Settings.js
import React, { useState, useEffect } from "react";
import { ref, get, update } from "firebase/database";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../utilities/firebaseConfig";

const Settings = () => {
  const navigate = useNavigate();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const settingsRef = ref(db, `technicians/${user.uid}/settings`);
      get(settingsRef).then((snapshot) => {
        if (snapshot.exists()) {
          setNotificationsEnabled(snapshot.val().notificationsEnabled);
        }
      });
    }
  }, []);

  const handleSave = async () => {
    const user = auth.currentUser;
    if (user) {
      await update(ref(db, `technicians/${user.uid}/settings`), { notificationsEnabled });
      alert("Settings updated.");
      navigate("/dashboard");
    }
  };

  return (
    <div>
      <h2>Settings</h2>
      <label>
        <input type="checkbox" checked={notificationsEnabled} onChange={(e) => setNotificationsEnabled(e.target.checked)} />
        Enable Notifications
      </label>
      <br />
      <button onClick={handleSave}>Save Settings</button>
      <button onClick={() => navigate("/dashboard")}>Cancel</button>
    </div>
  );
};

export default Settings;
