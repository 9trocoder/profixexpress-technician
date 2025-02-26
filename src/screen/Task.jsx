import React, { useState } from "react";
import filtericon from "../assets/filtericon.svg";

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
    </div>
  );
}

export default Task;
