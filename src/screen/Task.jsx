import React, { useState } from "react";
import filtericon from "../assets/filtericon.svg";
import ttime from "../assets/ttime.svg";
import tcalendar from "../assets/tcalendar.svg";
import tlocation from "../assets/tlocation.svg";

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
  return (
    <div className='techdash'>
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
            <button className='tpbaccept'>View Task Details</button>
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
            <button className='tpbaccept'>View Task Details</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Task;
