import React from "react";
import backarrow from "../assets/backwardarrow.svg";

function TaskDetails() {
  return (
    <div>
      <button>
        <img src={backarrow} alt='' srcset='' />
      </button>
      <h2 className="techdashgreet">Pipe Repair</h2>
    </div>
  );
}

export default TaskDetails;
