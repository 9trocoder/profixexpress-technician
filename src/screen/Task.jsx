import React from "react";
import filtericon from "../assets/filtericon.svg";

function Task() {
  return (
    <div className='techdash'>
      <h2 className='techdashgreet'>Task</h2>
      <div className='tasksearch'>
        <input type='text' placeholder='Search here...' />
        <button className='filterbtn'>
          <img src={filtericon} alt='' srcset='' />
        </button>
      </div>
    </div>
  );
}

export default Task;
