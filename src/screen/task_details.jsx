import React from "react";
import backarrow from "../assets/backwardarrow.svg";
import { useNavigate } from "react-router-dom";

function TaskDetails() {
  const navigate = useNavigate();
  return (
    <div className='taskdecnt'>
      <button className='backbtn' onClick={() => navigate("/dashboard")}>
        <img src={backarrow} alt='' srcset='' />
      </button>
      <h2 className='techdashgreet'>Pipe Repair</h2>
      <p className='taskclient'>
        Client: <span>Josephine Edet</span>
      </p>
      <div className='taskstatus'>
        <p className='taskstatustitle'>Status: </p>
        <div className='taskstatuscnt'>Pending</div>
      </div>
      <div className='thsp'></div>
      <p className='taskinfo'>Task info</p>
      <div className='taskinfocnt'>
        <p className="taskdatebook">Date booked</p>
        <p className="taskdatecnt">Sun, Nov 25, 2025</p>
        <div className='divider'></div>
        <p className="taskdatebook">Location</p>
        <p className="taskdatecnt">VI Lagos</p>
        <div className='divider'></div>
        <p className="taskdatebook">Price breakdown</p>
        <div className='pricebreakitem'>
          <p>Hourly rate:</p>
          <p>N15,000/hr</p>
        </div>
        <div className='pricebreakitem'>
          <p>Trust/support fee:</p>
          <p>N9,500</p>
        </div>
        <div className='pricebreakitem'>
          <p>Total fee:</p>
          <p>N25,500</p>
        </div>
      </div>
      <div className="thsp"></div>
      <p className="taskinfo">Task details/notes</p>
      <div className='taskinfocnt'>
        <p className="taskinfocntpar">
          Hi, I need help fixing a leaking faucet in my kitchen. It's been
          dripping non-stop, and I'd like to get it repaired as soon as
          possible. Please let me know if you're available and what the next
          steps are. Thanks!
        </p>
      </div>
      <div className="thsp"></div>
      <p>Task image</p>
      <div className='taskimageset'>
        <img src='' alt='' srcset='' />
      </div>
    </div>
  );
}

export default TaskDetails;
