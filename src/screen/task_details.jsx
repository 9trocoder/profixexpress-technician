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
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const jobRef = ref(db, `jobs/${taskId}`);
    get(jobRef).then((snapshot) => {
      if (snapshot.exists()) {
        setTask(snapshot.val());
      }
    });
  }, [taskId]);

  function formatDate(dateString) {
    const date = new Date(dateString);
    // Arrays for the short names of days and months.
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // Get the components of the date.
    const dayName = days[date.getDay()];
    const monthName = months[date.getMonth()];
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();

    return `${dayName}, ${monthName} ${day}, ${year}`;
  }

  if (!task) return <p>Loading job details...</p>;

  return (
    <div className='bookingpagecnt'>
      <button className='backbtn' onClick={() => navigate("/task")}>
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
        <p className='taskdatecnt'>{formatDate(task.scheduledDate)}</p>
        <div className='divider'></div>
        <p className='taskdatebook'>Location</p>
        <p className='taskdatecnt'>{task.address}</p>
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
        <p className='taskinfocntpar'>{task.description}</p>
      </div>
      <div className='thsp'></div>

      <p>Task image</p>
      <div className='taskimageset'>
        {task.images.map((item, index) => (
          <img
            src={item}
            onClick={() => setSelectedImage(item)}
            alt=''
            srcset=''
            className='taskimgbx'
          />
        ))}
      </div>
      <div className='thsp'></div>
      <Link to={`/raise-dispute/${taskId}`}>
        <button>Raise Dispute</button>
      </Link>
      <Link to={`/upload-proof/${taskId}`}>
        <button>Upload Completion Proof</button>
      </Link>
      <div className='thsp'></div>

      {selectedImage && (
        <div className='imagemodal' onClick={() => setSelectedImage(null)}>
          <div className='imagemodal-content'>
            <span className='close-btn' onClick={() => setSelectedImage(null)}>
              ×
            </span>
            <img src={selectedImage} alt='Full Size' className='fullimage' />
          </div>
        </div>
      )}

      <button
        className='jdtechopenchat'
        onClick={() => navigate(`/chat/${taskId}`)}
      >
        Open chat
      </button>
    </div>
  );
}

export default TaskDetails;
