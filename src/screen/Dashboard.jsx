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
import { onValue, update } from "firebase/database";

function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(true);
  const [acceptedtsk, setAcceptedtsk] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [online, setOnline] = useState(false);
  const [technician, setTechnician] = useState(null);
  const [tasks, setTasks] = useState([]);
  const userId = auth.currentUser ? auth.currentUser.uid : null;

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
        setLoading(false);
        setOnline(techData.online);
      }
    });
    const tasksRef = ref(db, "tasks");
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

  const toggleOnlineStatus = () => {
    const user = auth.currentUser;
    if (user) {
      const newStatus = !online;
      setOnline(newStatus);
      update(ref(db, `technicians/${user.uid}`), { online: newStatus });
    }
  };

  const acceptTask = (taskId) => {
    update(ref(db, `tasks/${taskId}`), { status: "accepted" });
  };

  const rejectTask = (taskId) => {
    update(ref(db, `tasks/${taskId}`), { status: "rejected" });
  };
  if (loading) return <p>Loading user data...</p>;
  if (technician.approval === "pending")
    return (
      <div className='notver'>
        <div className='notaprv_cnt'>
          <div
            className='botaprvv_cert'
            style={{ backgroundImage: `url(${verbg})` }}
          >
            <p className='botarvtitle'>Your profile has be created.</p>
            <div className='botarvprocnt'>
              <p className='botarvname'>{technician.fullName}</p>
              <p className='botarvemail'>{technician.email}</p>
            </div>

            <div className='bovaprvdet'>
              <p className='bovaprvdetstatus'>{technician.approval}</p>
              <p className='bovaprvdettitle'>Documents under review</p>
            </div>
          </div>

          <div className='botbuttom'>
            <p className='dcarptext'>
              Technician ID is yet to be generated as your application is
              currently under review to see if you are a good fit, we'll send an
              email to <span>{technician.email}</span> once your application is
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
      {tasks.length > 0 && (
        <>
          <div className='modal-overlay'>
            <div className='modal'>
              {tasks.map((task) => (
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
                    <button
                      className='tpbdecline'
                      onClick={rejectTask(task.id)}
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))}
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
        {technician.location && (
          <p>
            <strong>Location:</strong> {technician.location.lat.toFixed(4)},{" "}
            {technician.location.lng.toFixed(4)}
          </p>
        )}
        <button
          onClick={toggleOnlineStatus}
          style={{ background: online ? "green" : "gray" }}
        >
          Go {online ? "Online" : "Offline"}
        </button>
        <h2 className='techdashgreet'>Hi {technician.fullName}</h2>
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
          <strong>Name:</strong> {technician.fullName}
        </p>
        <p>
          <strong>Email:</strong> {technician.email}
        </p>
        <p>
          <strong>Phone:</strong> {technician.mobile}
        </p>
        <button onClick={() => navigate("/task")}>go to task</button>
        <button onClick={handleSignOut}>Sign Out</button>
      </div>
    </>
  );
}

export default Dashboard;
