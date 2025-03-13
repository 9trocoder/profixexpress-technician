import React, { useEffect, useState } from "react";
import filtericon from "../assets/filtericon.svg";
import ttime from "../assets/ttime.svg";
import tcalendar from "../assets/tcalendar.svg";
import tlocation from "../assets/tlocation.svg";
import { Link, useNavigate } from "react-router-dom";
import { auth, db, get, ref } from "../utilities/firebaseConfig";
import { Menu, X } from "lucide-react";
import { onValue, update } from "firebase/database";
import profileimg from "../assets/profileimg.png";
import notificationicon from "../assets/notificationicon.svg";

export const taskbtnlist = [
  { id: 0, name: "new" },
  { id: 1, name: "scheduled" },
  { id: 2, name: "in progress" },
  { id: 3, name: "completed" },
  { id: 4, name: "cancelled" },
];

function Task() {
  const [activenav, setActivena] = useState("new");
  const [isOpen, setIsOpen] = useState(false);
  const [technician, setTechnician] = useState(null);
  const [online, setOnline] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [newTasks, setNewTasks] = useState([]);
  const [scheduledTasks, setScheduledTasks] = useState([]);
  const [inProgressTasks, setInProgressTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [cancelledTasks, setCancelledTasks] = useState([]);
  const navigate = useNavigate();
  const user = auth.currentUser;
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      return;
    }
    const technicianId = user.uid;

    // Fetch technician data
    const technicianRef = ref(db, `technicians/${user.uid}`);
    get(technicianRef).then((snapshot) => {
      if (snapshot.exists()) {
        const techData = snapshot.val();
        setTechnician(techData);
        setOnline(techData.online);
      }
    });

    // Listen for job tasks assigned to this technician
    const tasksRef = ref(db, "jobs");
    onValue(tasksRef, (snapshot) => {
      if (snapshot.exists()) {
        const tasksData = Object.entries(snapshot.val()).map(([id, task]) => ({
          id,
          ...task,
        }));

        const myTasks = tasksData.filter(
          (task) => task.technicianId === technicianId
        );
        const newTasks = myTasks.filter((task) => task.status === "pending");
        const scheduledTasks = myTasks.filter(
          (task) => task.status === "scheduled"
        );
        const inProgressTasks = myTasks.filter(
          (task) => task.status === "in progress"
        );
        const completedTasks = myTasks.filter(
          (task) => task.status === "completed"
        );
        const cancelledTasks = myTasks.filter(
          (task) => task.status === "cancelled"
        );

        // Set state for different task statuses
        setTasks(myTasks);
        setNewTasks(newTasks);
        setScheduledTasks(scheduledTasks);
        setInProgressTasks(inProgressTasks);
        setCompletedTasks(completedTasks);
        setCancelledTasks(cancelledTasks);
      }
    });
  }, [navigate, user]);

  const acceptTask = (taskId) => {
    update(ref(db, `jobs/${taskId}`), { status: "accepted" });
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
        <div>
          <div
            className='sidebar-container'
            onClick={() => setIsOpen(!isOpen)}
          ></div>
          <div className={`sidebar ${isOpen ? "open" : ""}`}>
            <button className='toggle-btn' onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className='thsp'></div>
            <h1 className='techdashgreet'>
              {technician && technician.fullName}
            </h1>
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
        <div className='thegap'></div>
        <div className='techdashtop'>
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
          
        </div>
        <div className='thegap'></div>
        <p className='thetops'>{activenav} Task</p>
        <div className='thecontentbd'>
          <div className='thespace'></div>
          {activenav === "new" && newTasks.length > 0 ? (
            newTasks.map((task) => (
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
                      {task.time} {task.timeOfDay}
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
            <div className=''></div>
          )}
          {activenav === "scheduled" && scheduledTasks.length > 0 ? (
            scheduledTasks.map((task) => (
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
                    <p>Time</p>
                    <div className='taskpropsitem'>
                      <img src={ttime} alt='Time' />
                      <label>
                        {task.time} {task.timeOfDay}
                      </label>
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
            <div className=''></div>
          )}
          {activenav === "in progress" && inProgressTasks.length > 0 ? (
            inProgressTasks.map((task) => (
              <div
                className='taskalertmain'
                key={task.id}
                onClick={() => navigate(`/task_details/${task.id}`)}
              >
                <p className='tasktitle'>{task.title}</p>
                <p className='taskparam'>{task.description}</p>
                <div className='divider'></div>
                <div class='loading-container'>
                  <span class='loading'></span>
                </div>
              </div>
            ))
          ) : (
            <div className=''></div>
          )}
          {activenav === "completed" && completedTasks.length > 0 ? (
            completedTasks.map((task) => (
              <div className='taskalertmain' key={task.id}>
                <p className='tasktitle'>{task.title}</p>
                <p className='taskparam'>Task ID: {task.id}</p>
                <div className='divider'></div>
                <div className='taskprops'>
                  <div className='taskpropsitem'>
                    <img src={tcalendar} alt='Calendar' />
                    <label>{formatDate(task.scheduledDate)}</label>
                  </div>
                  <div className='taskpropsitem'>
                    <img src={ttime} alt='Time' />
                    <label>
                      {task.time} {task.timeOfDay}
                    </label>
                  </div>
                  <div className='taskpropsitem'>
                    <img src={tlocation} alt='Location' />
                    <label>{task.address}</label>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className=''></div>
          )}
          {activenav === "cancelled" && cancelledTasks.length > 0 ? (
            cancelledTasks.map((task) => (
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
                      {task.time} {task.timeOfDay}
                    </label>
                  </div>
                  <div className='taskpropsitem'>
                    <img src={tlocation} alt='Location' />
                    <label>{task.address}</label>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className=''></div>
          )}
          <div className='thespace'></div>
        </div>
      </div>
    </>
  );
}

export default Task;
