import React from "react";
import backarrow from "../assets/backwardarrow.svg";

function TaskDetails() {
  return (
    <div>
      <button>
        <img src={backarrow} alt='' srcset='' />
      </button>
      <h2 className='techdashgreet'>Pipe Repair</h2>
      <p>
        Client: <span>Josephine Edet</span>
      </p>
      <p>Status: </p>
      <div className=''>Pending</div>
      <div className='thsp'></div>
      <p>Task info</p>
    </div>
  );
}

export default TaskDetails;
