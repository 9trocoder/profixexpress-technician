import { Menu, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ttime from "../assets/ttime.svg";
import tcalendar from "../assets/tcalendar.svg";
import tlocation from "../assets/tlocation.svg";
import profileimg from "../assets/profileimg.png";
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
        <h1 className="bookingtitle">Profile</h1>
        <div className="thetechprof">
            <img src={profileimg} alt="" />
            <p className=''>
              {technician?.fullName }
            </p>
            <p>{technician?.email}</p>
        </div>
      </div>
    </>
  );
};

export default Profile;
