import React, { useEffect, useState } from "react";
import backarrow from "../assets/backwardarrow.svg";
import { Link, useNavigate, useParams } from "react-router-dom";
import { get, onValue, ref } from "firebase/database";
import { auth, db } from "../utilities/firebaseConfig";
import Chat from "./message_details";
import TaskProgressUpdate from "./TaskProgressUpdate";

function TaskDetails() {
  const { taskId } = useParams();
  const [task, setTask] = useState(null);
  const navigate = useNavigate();
  const [job, setJob] = useState(null);

  useEffect(() => {
    const jobRef = ref(db, `jobs/${taskId}`);
    get(jobRef).then((snapshot) => {
      if (snapshot.exists()) {
        setTask(snapshot.val());
      }
    });
  }, [taskId]);


  if (!task) return <p>Loading job details...</p>;

  return (
    <div className='taskdecnt'>
      <button className='backbtn' onClick={() => navigate("/dashboard")}>
        <img src={backarrow} alt='' srcset='' />
      </button>
      <h2 className='techdashgreet'>{task.title}</h2>
      <p className='taskclient'>
        Client: <span>{task.userName}</span>
      </p>
      <div className='taskstatus'>
        <p className='taskstatustitle'>Status: </p>
        <div className='taskstatuscnt'>{task.status}</div>
      </div>
      <div className='thsp'></div>
      <p className='taskinfo'>Task info</p>
      <div className='taskinfocnt'>
        <p className='taskdatebook'>Date booked</p>
        <p className='taskdatecnt'>Sun, Nov 25, 2025</p>
        <div className='divider'></div>
        <p className='taskdatebook'>Location</p>
        <p className='taskdatecnt'>VI Lagos</p>
        <div className='divider'></div>
        <p className='taskdatebook'>Price breakdown</p>
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
      <div className='thsp'></div>
      {task.status === "in progress" && <TaskProgressUpdate taskId={taskId} />}
      <div className='thsp'></div>
      <p className='taskinfo'>Task details/notes</p>
      <div className='taskinfocnt'>
        <p className='taskinfocntpar'>
          Hi, I need help fixing a leaking faucet in my kitchen. It's been
          dripping non-stop, and I'd like to get it repaired as soon as
          possible. Please let me know if you're available and what the next
          steps are. Thanks!
        </p>
      </div>
      <div className='thsp'></div>

      <p>Task image</p>
      <div className='taskimageset'>
        <img src='' alt='' srcset='' />
      </div>
      <div className='thsp'></div>
      <Link to={`/raise-dispute/${taskId}`}>
        <button>Raise Dispute</button>
      </Link>
      <Link to={`/upload-proof/${taskId}`}>
        <button>Upload Completion Proof</button>
      </Link>
      <div className='thsp'></div>
      <Chat chatId={taskId} />
    </div>
  );
}

export default TaskDetails;
