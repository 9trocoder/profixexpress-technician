// src/components/Dashboard.js
import React, { useEffect, useState } from "react";
import { auth, db, get, ref } from "../utilities/firebaseConfig";
import { signOut } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import verbg from "../assets/unverifiedbg.png";
import ttime from "../assets/ttime.svg";
import tcalendar from "../assets/tcalendar.svg";
import tlocation from "../assets/tlocation.svg";
import { Menu, X } from "lucide-react";

function Dashboard() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(true);
  const [acceptedtsk, setAcceptedtsk] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
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

  const handleaccept = () => {
    setAcceptedtsk(true);
    setActive(false);
  };

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
    <>
      {active && (
        <>
          <div className='modal-overlay'>
            <div className='modal'>
              <div className='taskalertmain'>
                <p className='tasktitle'>Pipe Repair</p>
                <p className='taskparam'>
                  Hi, I need help fixing a leaking faucet in my kitchen, kindly
                  come now because it is an emergency. it needs to be fixed
                  immediately
                </p>
                <div className='divider'></div>
                <div className='taskprops'>
                  <div className='taskpropsitem'>
                    <img src={tcalendar} alt='' srcset='' />
                    <label htmlFor=''>Sun, Nov 25, 2024.</label>
                  </div>
                  <div className='taskpropsitem'>
                    <img src={ttime} alt='' srcset='' />
                    <label htmlFor=''>9:30 Am. 1hr</label>
                  </div>
                  <div className='taskpropsitem'>
                    <img src={tlocation} alt='' srcset='' />
                    <label htmlFor=''>No 25, Idunlami St lagos, Nigeria</label>
                  </div>
                </div>
                <div className='taskpropsbtn'>
                  <button className='tpbaccept' onClick={handleaccept}>
                    Accept
                  </button>
                  <button
                    className='tpbdecline'
                    onClick={() => setActive(false)}
                  >
                    Decline
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {acceptedtsk && (
        <>
          <div className='modal-overlay'>
            <div className='modal'>
              <div className='taskalertmain'>
                <div className='taskalertmainpro'>
                  <h2 className='tmptitle'>Success!</h2>
                  <p className='tmpsubtitle'>You have accepted this booking</p>
                  <p className='tmppara'>
                    You've successfully accepted the task. Click below to view
                    the full details and proceed. We look forward to your
                    excellent work!
                  </p>
                  <div className='taskpropsbtn'>
                    <button
                      className='tpbaccept'
                      onClick={() => {
                        setAcceptedtsk(false);
                        navigate("/task_details");
                      }}
                    >
                      Proceed to Task Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {isOpen && (
        <div className=''>
          <div
            className='sidebar-container'
            onClick={() => setIsOpen(!isOpen)}
          ></div>
          <div className={`sidebar ${isOpen ? "open" : ""}`}>
            <button className='toggle-btn' onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className='thsp'></div>
            <h1 className="techdashgreet">{userData.fullName}</h1>
            <div className='thsp'></div>
            <div className='divider'></div>
            <div className='thsp'></div>
            <div className='thesidelinks'>
              <Link to='/dashboard'>Home</Link>
              <Link to='/task'>Task</Link>
              <Link to='/message'>Message</Link>
              <Link to='/earning'>Earning</Link>
              <Link to='/profile'>Profile</Link>
            </div>
          </div>
        </div>
      )}

      <div className='techdash'>
        <button className='toggle-btn' onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <h2 className='techdashgreet'>Hi {userData.fullName}</h2>
        <p className='techdashpar'>
          You have 1 pending task and 3 tasks to complete
        </p>

        <p className='taskpropss'>Pending Tasks</p>
        <div className='taskalertmain'>
          <p className='tasktitle'>Pipe Repair</p>
          <p className='taskparam'>
            Hi, I need help fixing a leaking faucet in my kitchen
          </p>
          <div className='divider'></div>
          <div className='taskprops'>
            <div className='taskpropsitem'>
              <img src={tcalendar} alt='' srcset='' />
              <label htmlFor=''>Sun, Nov 25, 2024.</label>
            </div>
            <div className='taskpropsitem'>
              <img src={ttime} alt='' srcset='' />
              <label htmlFor=''>9:30 Am. 1hr</label>
            </div>
            <div className='taskpropsitem'>
              <img src={tlocation} alt='' srcset='' />
              <label htmlFor=''>No 25, Idunlami St lagos, Nigeria</label>
            </div>
          </div>
          <div className='taskpropsbtn'>
            <button
              className='tpbaccept'
              onClick={() => navigate("/task_details")}
            >
              View Task Details
            </button>
          </div>
        </div>
        <p className='taskpropss'>Active Tasks</p>
        <div
          className='taskalertmain'
          onClick={() => navigate("/task_details")}
        >
          <p className='tasktitle'>House Cleaning</p>
          <p className='taskparam'>
            Hi, I need help fixing a leaking faucet in my kitchen...
          </p>
          <div className='divider'></div>
          <div className='taskbookdatecnt'>
            <div className=''>
              <p className='taskbookdat'>Booked date</p>
              <div className='taskbookcd'>
                <img src={tcalendar} alt='' srcset='' />
                <p>Nov 25, 2024</p>
              </div>
            </div>
            <div className=''>
              <p className='taskbookdat'>Due</p>
              <div className='taskbookcd'>
                <img src={tcalendar} alt='' srcset='' />
                <p>Nov 25, 2024</p>
              </div>
            </div>
          </div>
        </div>
        <div className='thsp'></div>
        <p>
          <strong>Name:</strong> {userData.fullName}
        </p>
        <p>
          <strong>Email:</strong> {userData.email}
        </p>
        <p>
          <strong>Phone:</strong> {userData.mobile}
        </p>
        <button onClick={() => navigate("/task")}>go to task</button>
        <button onClick={handleSignOut}>Sign Out</button>
      </div>
    </>
  );
}

export default Dashboard;
