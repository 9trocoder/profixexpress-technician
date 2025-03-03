import React, { useEffect, useState } from "react";
import filtericon from "../assets/filtericon.svg";
import ttime from "../assets/ttime.svg";
import tcalendar from "../assets/tcalendar.svg";
import tlocation from "../assets/tlocation.svg";
import { Link, useNavigate } from "react-router-dom";
import { auth, db, get, ref } from "../utilities/firebaseConfig";

import { Menu, X } from "lucide-react";
import { onValue, update } from "firebase/database";

export const taskbtnlist = [
  {
    id: 0,
    name: "All",
  },
  {
    id: 1,
    name: "New task",
  },
  {
    id: 2,
    name: "Pending",
  },
  {
    id: 3,
    name: "In Progress",
  },
  {
    id: 4,
    name: "Completed",
  },
];

function Task() {
  const [activenav, setActivena] = useState("All");
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [technician, setTechnician] = useState(null);
  const [online, setOnline] = useState(false);
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      navigate("/");
      return;
    }
    const technicianRef = ref(db, `technicians/${user.uid}`);
    get(technicianRef).then((snapshot) => {
      if (snapshot.exists()) {
        const techData = snapshot.val();
        setTechnician(techData);
        setOnline(techData.online);
      }
    });
    const tasksRef = ref(db, "jobs");
    onValue(tasksRef, (snapshot) => {
      if (snapshot.exists()) {
        const tasksData = Object.entries(snapshot.val()).map(([id, task]) => ({
          id,
          ...task,
        }));
        const myTasks = tasksData.filter(
          (task) => task.technicianId === user.uid
        );
        setTasks(myTasks);
      }
    });
  }, [navigate]);

  const acceptTask = (taskId) => {
    update(ref(db, `jobs/${taskId}`), { status: "accepted" });
  };

  const rejectTask = (taskId) => {
    update(ref(db, `jobs/${taskId}`), { status: "rejected" });
  };
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
            <h1 className='techdashgreet'>{technician.fullName}</h1>
            <div className='thsp'></div>
            <div className='divider'></div>
            <div className='thsp'></div>
            <div className='thesidelinks'>
              <Link to='/dashboard'>Home</Link>
              <Link to='/task'>Task</Link>
              <Link to='/earning'>Earning</Link>
              <Link to='/profile'>Profile</Link>
              <Link to='/edit-profile'>Edit Profile</Link>
              <Link to='/notifications'>Notifications</Link>
              <Link to='/task-history'>Task History</Link>
              <Link to='/reviews'>My Reviews</Link>
              <Link to='/earnings'>Earnings</Link>
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
        <div className='techdashtop'>
          <h2 className='techdashgreet'>Task</h2>
          <div className='tasksearch'>
            <input type='text' placeholder='Search here...' />
            <button className='filterbtn'>
              <img src={filtericon} alt='' srcSet='' />
            </button>
          </div>
          <div className='tasknav'>
            {taskbtnlist.map((tasktype) => (
              <button
                key={tasktype.id}
                onClick={() => setActivena(tasktype.name)}
                className={`tasknavitem ${
                  activenav === tasktype.name && "tasktypeactive"
                }`}
              >
                {tasktype.name}
              </button>
            ))}
          </div>

          <p className='taskpropss'>{activenav} Task</p>
        </div>

        <div className='thecontentbd'>
          <div className='thespace'></div>
          {activenav === "New task" && tasks.length > 0 ? (
            tasks.map((task) => (
              <div className='taskalertmain' key={task.id}>
                <p className='tasktitle'>{task.title}</p>
                <p className='taskparam'>{task.info}</p>
                <div className='divider'></div>
                <div className='taskprops'>
                  <div className='taskpropsitem'>
                    <img src={tcalendar} alt='' srcset='' />
                    <label htmlFor=''>{task.date}</label>
                  </div>
                  <div className='taskpropsitem'>
                    <img src={ttime} alt='' srcset='' />
                    <label htmlFor=''>
                      {task.time} {task.duration}
                    </label>
                  </div>
                  <div className='taskpropsitem'>
                    <img src={tlocation} alt='' srcset='' />
                    <label htmlFor=''>{task.address}</label>
                  </div>
                </div>
                <p>
                  <strong>Status:</strong> {task.status}
                </p>

                <div className='taskpropsbtn'>
                  <button className='tpbaccept' onClick={acceptTask(task.id)}>
                    Accept
                  </button>
                  <button className='tpbdecline' onClick={rejectTask(task.id)}>
                    Decline
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No tasks assigned yet.</p>
          )}
          {activenav === "All" && tasks.length > 0 ? (
            tasks.map((task) => (
              <div className='taskalertmain' key={task.id}>
                <p className='tasktitle'>{task.title}</p>
                <p className='taskparam'>{task.info}</p>
                <div className='divider'></div>
                <div className='taskprops'>
                  <div className='taskpropsitem'>
                    <img src={tcalendar} alt='' srcset='' />
                    <label htmlFor=''>{task.date}</label>
                  </div>
                  <div className='taskpropsitem'>
                    <img src={ttime} alt='' srcset='' />
                    <label htmlFor=''>
                      {task.time} {task.duration}
                    </label>
                  </div>
                  <div className='taskpropsitem'>
                    <img src={tlocation} alt='' srcset='' />
                    <label htmlFor=''>{task.address}</label>
                  </div>
                </div>
                <div className='taskpropsbtn'>
                  <button
                    className='tpbaccept'
                    onClick={() => navigate(`/task_details/${task.id}`)}
                  >
                    View Task Details
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No tasks assigned yet.</p>
          )}

          <div className='thespace'></div>
        </div>
      </div>
    </>
  );
}

export default Task;
