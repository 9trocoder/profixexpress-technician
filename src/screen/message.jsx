import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db, get, ref } from "../utilities/firebaseConfig";
import { Menu, X } from "lucide-react";
import profileavatar from "../assets/pravatar.png";

function Message() {
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
  return (
    <>
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
            <h1 className='techdashgreet'>{userData.fullName}</h1>
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
        <div className='techdashtop'>
          <h2 className='techdashgreet'>Messages</h2>
          <div className='tasksearch'>
            <input type='text' placeholder='Search messages...' />
          </div>
          <div className='thspp'></div>
        </div>

        <div className='thecontentbd'>
          <div className='themessagecnt'>
            <img src={profileavatar} alt='' className='pravatar' />
            <div className='themessageright'>
              <p className="tmname">Jyte Mfoniso</p>
              <p  className="tmcon">This conversation has now been closed. if you...</p>
              <p className="tmtime">3 days ago</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Message;
