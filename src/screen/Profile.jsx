import { Menu, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ttime from "../assets/ttime.svg";
import tcalendar from "../assets/tcalendar.svg";
import tlocation from "../assets/tlocation.svg";
import profileimg from "../assets/profileimg.png";
import editingicon from "../assets/editicon.svg";
import notificationicon from "../assets/notificationicon.svg";
import { auth, db, ref } from "../utilities/firebaseConfig";
import { onValue } from "firebase/database";

const Profile = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [technician, setTechnician] = useState(null);
  const [online, setOnline] = useState(false);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      navigate("/");
      return;
    }

    const technicianId = auth.currentUser ? auth.currentUser.uid : null;
    if (!technicianId) return;

    // Fetch technician details
    const technicianRef = ref(db, `technicians/${user.uid}`);
    onValue(technicianRef, (snapshot) => {
      if (snapshot.exists()) {
        const techData = snapshot.val();
        setTechnician(techData);
        setOnline(techData.online);
      }
    });
  }, [navigate]);

  return (
    <>
      {isOpen && (
        <div className='sidebar-container' onClick={() => setIsOpen(false)}>
          <div className={`sidebar ${isOpen ? "open" : ""}`}>
            <button className='toggle-btn' onClick={() => setIsOpen(false)}>
              <X size={24} />
            </button>
            <h1 className='techdashgreet'>
              {technician?.fullName || "Loading..."}
            </h1>
            <div className='divider'></div>
            <div className='thesidelinks'>
              <Link to='/dashboard'>Home</Link>
              <Link to='/task'>Task</Link>
              <Link to='/earning'>Earning</Link>
              <Link to='/profile'>Profile</Link>
              <Link to='/notifications'>Notifications</Link>
              <Link to='/task-history'>Task History</Link>
              <Link to='/reviews'>My Reviews</Link>
              <Link to='/availability'>Availability</Link>
              <Link to='/settings'>Settings</Link>
              <Link to='/track-location'>Track Location</Link>
              <Link to='/scheduled-tasks'>Scheduled Tasks</Link>
              <Link to='/analytics'>Analytics</Link>
              <Link to='/map-view'>Map View</Link>
              <Link to='/live-location'>Live Location</Link>
              <Link to='/earnings-dashboard'>Earnings Dashboard</Link>
              <Link to='/service-pricing'>Service Pricing</Link>
              <Link to='/call-technician'>Call Technician</Link>
            </div>
          </div>
        </div>
      )}
      <div className='bookingpagecnt'>
        {isOpen ? (
          ""
        ) : (
          <div className='thebookingnav'>
            <button className='toggle-btn' onClick={() => setIsOpen(!isOpen)}>
              <Menu size={24} />
            </button>
            <div className='thebookingnavright'>
              <button className='bookingnotificationicon'>
                <img src={notificationicon} alt='' srcset='' />
              </button>
              <button
                className='bookingprofimg'
                onClick={() => navigate("/profile")}
              >
                <img src={profileimg} alt='' className='profimg' />
              </button>
            </div>
          </div>
        )}
        <h1 className='bookingtitle'>Profile</h1>
        <div className="thegap"></div>
        <div className='thetechprof'>
          <img className='theprofimg' src={profileimg} alt='' />
          <p className='theprofname'>{technician?.fullName}</p>
          <p className='theprofemail'>{technician?.email}</p>
          <div className='theprostarate'>
            <svg
              width='20'
              height='20'
              viewBox='0 0 15 15'
              fill='#feca57'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M7.22303 0.665992C7.32551 0.419604 7.67454 0.419604 7.77702 0.665992L9.41343 4.60039C9.45663 4.70426 9.55432 4.77523 9.66645 4.78422L13.914 5.12475C14.18 5.14607 14.2878 5.47802 14.0852 5.65162L10.849 8.42374C10.7636 8.49692 10.7263 8.61176 10.7524 8.72118L11.7411 12.866C11.803 13.1256 11.5206 13.3308 11.2929 13.1917L7.6564 10.9705C7.5604 10.9119 7.43965 10.9119 7.34365 10.9705L3.70718 13.1917C3.47945 13.3308 3.19708 13.1256 3.25899 12.866L4.24769 8.72118C4.2738 8.61176 4.23648 8.49692 4.15105 8.42374L0.914889 5.65162C0.712228 5.47802 0.820086 5.14607 1.08608 5.12475L5.3336 4.78422C5.44573 4.77523 5.54342 4.70426 5.58662 4.60039L7.22303 0.665992Z'
                fill='#feca57'
              ></path>
            </svg>
            <p className=''>
              4.5 (108 review) <span>see all review</span>
            </p>
          </div>
        </div>
        <div className="thegap"></div>
        <div className="theprofnap">
            <p>About me</p>
            <button><img src={editingicon} alt="" /> Edit</button>
        </div>
      </div>
    </>
  );
};

export default Profile;
