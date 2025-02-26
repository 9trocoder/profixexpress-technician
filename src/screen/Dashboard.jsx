// src/components/Dashboard.js
import React, { useEffect, useState } from "react";
import { auth, db, get, ref } from "../utilities/firebaseConfig";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import verbg from "../assets/unverifiedbg.png";
import ttime from "../assets/ttime.svg";
import tcalendar from "../assets/tcalendar.svg";
import tlocation from "../assets/tlocation.svg";

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
            <p className='dcarptext'>
              Technician ID is yet to be generated as your application is
              currently under review to see if you are a good fit, we'll send an
              email to <span>{userData.email}</span> once your application is
              successfull
            </p>
            <button className='cntdevns' onClick={handleSignOut}>
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  return (
    <div>
      <h2>Hi {userData.fullName}</h2>
      <p>You have 1 pending task and 3 tasks to complete</p>
      <div className='taskalertcntoverlay'>
        <div className='taskalertcntbody'>
          <label htmlFor=''>Pending Tasks</label>
          <div className=''>
            <p>Pipe Repair</p>
            <p>Hi, I need help fixing a leaking faucet in my kitchen</p>
            <div className='divider'></div>
            <div className=''>
              <div className=''>
                <img src={tcalendar} alt='' srcset='' />
                <label htmlFor=''>Sun, Nov 25, 2024.</label>
              </div>
              <div className=''>
                <img src={ttime} alt='' srcset='' />
                <label htmlFor=''>9:30 Am. 1hr</label>
              </div>
              <div className=''>
                <img src={tlocation} alt='' srcset='' />
                <label htmlFor=''>No 25, Idunlami St lagos, Nigeria</label>
              </div>
            </div>
            <div className=''>
              <button>Accept</button>
              <button>Decline</button>
            </div>
          </div>
        </div>
      </div>
      <label htmlFor=''>Pending Tasks</label>
      <div className=''>
        <p>Pipe Repair</p>
        <p>Hi, I need help fixing a leaking faucet in my kitchen</p>
        <div className='divider'></div>
        <div className=''>
          <div className=''>
            <img src={tcalendar} alt='' srcset='' />
            <label htmlFor=''>Sun, Nov 25, 2024.</label>
          </div>
          <div className=''>
            <img src={ttime} alt='' srcset='' />
            <label htmlFor=''>9:30 Am. 1hr</label>
          </div>
          <div className=''>
            <img src={tlocation} alt='' srcset='' />
            <label htmlFor=''>No 25, Idunlami St lagos, Nigeria</label>
          </div>
        </div>
      </div>
      <label htmlFor=''>Active Tasks</label>
      <div className=''>
        <p>House Cleaning</p>
        <p>Hi, I need help fixing a leaking faucet in my kitchen...</p>
        <div className='divider'></div>
        <div className=''>
          <div className=''>
            <label htmlFor=''>Booked date</label>
            <div className=''>
              <img src={tcalendar} alt='' srcset='' />
              <p>Nov 25, 2024</p>
            </div>
          </div>
          <div className=''>
            <label htmlFor=''>Due</label>
            <div className=''>
              <img src={tcalendar} alt='' srcset='' />
              <p>Nov 25, 2024</p>
            </div>
          </div>
        </div>
      </div>
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
