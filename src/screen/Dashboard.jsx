// src/components/Dashboard.js
import React, { useEffect, useState } from "react";
import { auth, db, get, ref } from "../utilities/firebaseConfig";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import verbg from "../assets/unverifiedbg.png";

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
      <div className='notver'>
        <div className='notaprv_cnt'>
          <div
            className='botaprvv_cert'
            style={{ backgroundImage: `url(${verbg})` }}
          >
            <p className='botarvtitle'>Your profile has be created.</p>
            <div className='botarvprocnt'>
              <p className='botarvname'>{userData.fullName}</p>
              <p className='botarvemail'>{userData.email}</p>
            </div>

            <div className='bovaprvdet'>
              <p className='bovaprvdetstatus'>{userData.approval}</p>
              <p className='bovaprvdettitle'>Documents under review</p>
            </div>
          </div>

          <div className='botbuttom'>
            <p className="dcarptext">
              Technician ID is yet to be generated as your application is
              currently under review to see if you are a good fit, we'll send an
              email to <span>{userData.email}</span>  once your application is successfull
            </p>
            <button className="cntdevns" onClick={handleSignOut}>Sign Out</button>
          </div>
        </div>
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
