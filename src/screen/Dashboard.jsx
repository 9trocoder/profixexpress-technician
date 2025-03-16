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
  const [activeJobs, setActiveJobs] = useState([]);
  const [show, setShow] = useState(false);

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
        const activeJobs = tasksData.filter(
          (task) =>
            task.technicianId === technicianId && task.status === "accepted"
        );

        setPendingJobs(pendingJobs);
        setActiveJobs(activeJobs);
        setPendingCount(pendingJobs.length);
        setTasks(tasksData.filter((task) => task.technicianId === user.uid));
      }
    });
  }, [navigate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false); // Hide modal after 3 seconds
    }, 3000);

    return () => clearTimeout(timer); // Cleanup on unmount
  }, [show]);
  // Do not render modal if hidden

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
    setShow(true);
  };

  const rejectTask = (taskId) => {
    update(ref(db, `jobs/${taskId}`), { status: "rejected" });
  };

  function formatDate(dateString) {
    const date = new Date(dateString);
    // Arrays for the short names of days and months.
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // Get the components of the date.
    const dayName = days[date.getDay()];
    const monthName = months[date.getMonth()];
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();

    return `${dayName}, ${monthName} ${day}, ${year}`;
  }

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

      {show && (
        <div className='successmodal'>
          <h1 className='successtitle'>Success!</h1>
          <p className='successpara'>You have accepted this booking</p>
          <p className='successpaa'>
            You've successfully accepted the task. Click below to view the full
            details and proceed. We look forward to your excellent work!
          </p>
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
              <button className='bookingprofimg' onClick={() => navigate('/profile')}>
                <img src={profileimg} alt='' className='profimg' />
              </button>
            </div>
          </div>
        )}
        {technician ? (
          <>
            <div className='thegap'></div>
            <h1 className='bookingtitle'>Hi {technician.fullName}</h1>
            <p>
              You have {pendingCount} pending task and {tasks.length} tasks to
              complete
            </p>

            {/* <button onClick={toggleOnlineStatus}>
              {online ? "Go Offline" : "Go Online"}
            </button> */}
          </>
        ) : (
          <p>Loading technician info...</p>
        )}
        <div className='thebiggap'></div>
        <p className='thetops'>Pending Tasks</p>
        <div className='thegap'></div>{" "}
        {pendingJobs.length > 0 ? (
          pendingJobs.map((task) => (
            <div className='taskalertmain' key={task.id}>
              <p className='tasktitle'>{task.title}</p>
              <p className='taskparam'>{task.description}</p>
              <div className='divider'></div>
              <div className='taskprops'>
                <div className='taskpropsitem'>
                  <img src={tcalendar} alt='Calendar' />
                  <label>{formatDate(task.scheduledDate)}</label>
                </div>
                <div className='taskpropsitem'>
                  <img src={ttime} alt='Time' />
                  <label>
                    {task.timeOfDay} {task.duration}
                  </label>
                </div>
                <div className='taskpropsitem'>
                  <img src={tlocation} alt='Location' />
                  <label>{task.address}</label>
                </div>
              </div>

              <div className='taskpropsbtn'>
                <button
                  className='tpbaccept'
                  onClick={() => acceptTask(task.id)}
                >
                  Accept
                </button>
                <button
                  className='tpbdecline'
                  onClick={() => rejectTask(task.id)}
                >
                  Decline
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No tasks assigned yet.</p>
        )}
        <div className='thebiggap'></div>
        <p className='thetops'>Active Tasks</p>
        <div className='thegap'></div>
        {activeJobs.length > 0 ? (
          activeJobs.map((task) => (
            <div
              className='taskalertmain'
              key={task.id}
              onClick={() => navigate(`/task_details/${task.id}`)}
            >
              <p className='tasktitle'>{task.title}</p>
              <p className='taskparam'>{task.description}</p>
              <div className='divider'></div>
              <div className='taskpropss'>
                <div className=''>
                  <p>Booked</p>
                  <div className='taskpropsitem'>
                    <img src={tcalendar} alt='Calendar' />
                    <label>{formatDate(task.scheduledDate)}</label>
                  </div>
                </div>
                <div className=''>
                  <p>Due</p>
                  <div className='taskpropsitem'>
                    <img src={tcalendar} alt='Calendar' />
                    <label>{formatDate(task.scheduledDate)}</label>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No active task yet.</p>
        )}
      </div>
    </>
  );
};

export default Dashboard;
