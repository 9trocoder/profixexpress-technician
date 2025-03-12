import React, { useEffect, useState } from "react";
import { auth, db } from "../utilities/firebaseConfig";
import { signOut } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import verbg from "../assets/unverifiedbg.png";
import ttime from "../assets/ttime.svg";
import tcalendar from "../assets/tcalendar.svg";
import tlocation from "../assets/tlocation.svg";
import { Menu, X } from "lucide-react";
import { ref, onValue, update } from "firebase/database";
import Chat from "./message_details";
import profileimg from "../assets/profileimg.png";
import notificationicon from "../assets/notificationicon.svg";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [online, setOnline] = useState(false);
  const [technician, setTechnician] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [pendingJobs, setPendingJobs] = useState([]);

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

    // Fetch tasks assigned to the technician
    const tasksRef = ref(db, "jobs");
    onValue(tasksRef, (snapshot) => {
      if (snapshot.exists()) {
        const tasksData = Object.entries(snapshot.val()).map(([id, task]) => ({
          id,
          ...task,
        }));
        const pendingJobs = tasksData.filter(
          (task) =>
            task.technicianId === technicianId && task.status === "pending"
        );
        setPendingJobs(pendingJobs);
        setPendingCount(pendingJobs.length);
        setTasks(tasksData.filter((task) => task.technicianId === user.uid));
      }
    });
  }, [navigate]);

  const toggleOnlineStatus = () => {
    if (!auth.currentUser) return;
    const newStatus = !online;
    setOnline(newStatus);
    update(ref(db, `technicians/${auth.currentUser.uid}`), {
      online: newStatus,
    });
  };

  const acceptTask = (taskId) => {
    update(ref(db, `jobs/${taskId}`), { status: "accepted" });
  };

  const rejectTask = (taskId) => {
    update(ref(db, `jobs/${taskId}`), { status: "rejected" });
  };

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
              <Link to='/edit-profile'>Edit Profile</Link>
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
              <button className='bookingprofimg'>
                <img src={profileimg} alt='' className='profimg' />
              </button>
            </div>
          </div>
        )}

        {technician ? (
          <>
          <div className="thegap"></div>
            <h1 className='bookingtitle'>Hi {technician.fullName}</h1>
            <p>
              You have {pendingCount} pending task and {tasks.length} tasks to complete
            </p>
           
            {/* <button onClick={toggleOnlineStatus}>
              {online ? "Go Offline" : "Go Online"}
            </button> */}
          </>
        ) : (
          <p>Loading technician info...</p>
        )}

        <h3>Pending Tasks</h3>
        {pendingJobs.length > 0 ? (
          pendingJobs.map((task) => (
            <div key={task.id} className='task-card'>
              <h4>{task.title}</h4>
              <p>
                <strong>Status:</strong> {task.status}
              </p>
              <p>{task.address}</p>
              <Link to={`/task_details/${task.id}`}>View Details</Link>
              {task.status === "pending" && (
                <div>
                  <button onClick={() => acceptTask(task.id)}>Accept</button>
                  <button onClick={() => rejectTask(task.id)}>Reject</button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No tasks assigned yet.</p>
        )}

        <h3>General Chat</h3>
      </div>
    </>
  );
};

export default Dashboard;
