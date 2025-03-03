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

const Dashboard = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [online, setOnline] = useState(false);
  const [technician, setTechnician] = useState(null);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      navigate("/");
      return;
    }

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

      <div className='techdash'>
        <button className='toggle-btn' onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <h2>Technician Dashboard</h2>
        {technician ? (
          <>
            <p>
              <strong>Name:</strong> {technician.fullName}
            </p>
            <p>
              <strong>Service:</strong> {technician.service}
            </p>
            {technician?.location && (
              <p>
                <strong>Location:</strong> {technician.location.lat?.toFixed(4)}
                , {technician.location.lng?.toFixed(4)}
              </p>
            )}
            <button onClick={toggleOnlineStatus}>
              {online ? "Go Offline" : "Go Online"}
            </button>
          </>
        ) : (
          <p>Loading technician info...</p>
        )}

        <h3>Assigned Tasks</h3>
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div key={task.id} className='task-card'>
              <h4>{task.title}</h4>
              <p>
                <strong>Status:</strong> {task.status}
              </p>
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
