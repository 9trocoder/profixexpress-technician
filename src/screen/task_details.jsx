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
      <div className="">
        <p>Date booked</p>
        <p>Sun, Nov 25, 2025</p>
        <div className="divider"></div>
        <p>Location</p>
        <p>VI Lagos</p>
        <div className="divider"></div>
        <p>Price breakdown</p>
        <div className="pricebreakitem">
            <p>Hourly rate:</p>
            <p>N15,000/hr</p>
        </div>
        <div className="pricebreakitem">
            <p>Trust/support fee:</p>
            <p>N9,500</p>
        </div>
        <div className="pricebreakitem">
            <p>Total fee:</p>
            <p>N25,500</p>
        </div>
      </div>
    </div>
  );
}

export default TaskDetails;
