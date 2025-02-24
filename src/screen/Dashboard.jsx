// src/components/Dashboard.js
import React, { useEffect, useState } from "react";
import { auth, db, get, ref } from "../utilities/firebaseConfig";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // Check if a user is logged in
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userRef = ref(db, `technician/${currentUser.uid}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          setUserData(snapshot.val());
        } else {
          console.log("User data not found");
        }
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/signin");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  if (loading) return <p>Loading user data...</p>;
  if (userData.approval === "pending")
    return (
      <div>
        <p>{userData.fullName}</p>
        <p>{userData.email}</p>
        <p>{userData.approval}</p>
        <p>
          Technician ID is yet to be generated as your application is currently
          under review to see if you are a good fit, we'll send an email to{" "}
          {userData.email} once your application is successfull
        </p>
        <button onClick={handleSignOut}>Sign Out</button>
      </div>
    );
  return (
    <div>
      <h2>Welcome to the Dashboard</h2>
      <p>
        <strong>Name:</strong> {userData.fullName}
      </p>
      <p>
        <strong>Email:</strong> {userData.email}
      </p>
      <p>
        <strong>Phone:</strong> {userData.mobile}
      </p>
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  );
}

export default Dashboard;
