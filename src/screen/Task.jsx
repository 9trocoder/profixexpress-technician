import React, { useEffect, useState } from "react";
import filtericon from "../assets/filtericon.svg";
import ttime from "../assets/ttime.svg";
import tcalendar from "../assets/tcalendar.svg";
import tlocation from "../assets/tlocation.svg";
import { Link, useNavigate } from "react-router-dom";
import { auth, db, get, ref } from "../utilities/firebaseConfig";


import { Menu, X } from "lucide-react";

export const taskbtnlist = [
  {
    id: 0,
    name: "All",
  },
  {
    id: 1,
    name: "Pending",
  },
  {
    id: 0,
    name: "In Progress",
  },
  {
    id: 0,
    name: "Completed",
  },
];

function Task() {
  const [activenav, setActivena] = useState("All");
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
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
              <button className='tpbaccept'   onClick={() => navigate("/task_details")}>View Task Details</button>
            </div>
          </div>
          <div className='thespace'></div>
          <div className='taskalertmain'>
            <p className='tasktitle'>Ac maintenance and repair.</p>
            <p className='taskparam'>
              Hi, I need help fixing a leaking faucet in my kitchen
            </p>
            <div className='divider'></div>
            <div className='taskprops'>
              <div className='taskpropsitem'>
                <img src={tcalendar} alt='' srcset='' />
                <label htmlFor=''>Sun, Nov 2, 2024.</label>
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
              <button className='tpbaccept'   onClick={() => navigate("/task_details")}>View Task Details</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Task;
