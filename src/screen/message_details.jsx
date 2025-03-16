// src/pages/Chat.js
import React, { useState, useEffect } from "react";
import { ref, push, onValue, get } from "firebase/database";
import { useParams, useNavigate } from "react-router-dom";
import { auth, db } from "../utilities/firebaseConfig";
import backicon from "../assets/backicon.svg";
import imgsend from "../assets/imgicon.svg";
import sendimg from "../assets/sendicon.svg";

const Chat = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");

  // State for storing current user's name (fetched from realtime database)
  const [userName, setUserName] = useState("");

  // Fetch chat messages for this job.
  useEffect(() => {
    const chatRef = ref(db, `chats/${jobId}`);
    onValue(chatRef, (snapshot) => {
      const data = snapshot.val();
      const msgs = data ? Object.values(data) : [];
      setMessages(msgs);
    });
  }, [jobId]);

  // Fetch the current user's name from the realtime database.
  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const uid = currentUser.uid;
      const userRef = ref(db, `technicians/${uid}`);
      get(userRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const userData = snapshot.val();
            setUserName(userData.fullName || "User");
          } else {
            setUserName("User");
          }
        })
        .catch((error) => {
          console.error("Error fetching user profile:", error);
          setUserName("User");
        });
    } else {
      navigate(`/task_details/${jobId}`);
    }
  }, [navigate, jobId]);

  const sendMessage = () => {
    if (newMsg.trim() === "") return;
    const currentUser = auth.currentUser;
    // Use the name fetched from the database (userName) for senderName.
    const senderName = userName || "User";
    const messageData = {
      sender: currentUser.uid,
      senderName,
      message: newMsg,
      timestamp: Date.now(),
    };
    push(ref(db, `chats/${jobId}`), messageData);
    setNewMsg("");
  };
  const formatWhatsAppTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    // Check if the date is today
    const isToday = date.toDateString() === now.toDateString();
    // Check if the date is yesterday
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isToday) {
      // Show only time if today.
      return date.toLocaleTimeString(undefined, {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });
    } else if (isYesterday) {
      // Show "Yesterday, HH:MM AM/PM"
      return `Yesterday, ${date.toLocaleTimeString(undefined, {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      })}`;
    } else {
      // Otherwise, show full date and time.
      return (
        date.toLocaleDateString(undefined, {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric",
        }) +
        ", " +
        date.toLocaleTimeString(undefined, {
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        })
      );
    }
  };

  return (
    <>
      <div className='bookingpagechatcnt'>
        <button
          className='backicon chatbackbtn'
          onClick={() => navigate(`/task_details/${jobId}`)}
        >
          <img src={backicon} className='backiconimg' alt='' srcset='' />
        </button>
        <div className='thegap'></div>
        <div className='chatcnt'>
          {messages.map((msg, index) => {
            const isCurrentUser = msg.sender === auth.currentUser.uid;
            return (
              <div
                key={index}
                className={
                  isCurrentUser ? "thecurrentuser" : "notthecurrentuser"
                }
              >
                <div
                  className={isCurrentUser ? "thetapisncnt" : "notthetapisncnt"}
                >
                  <div className={isCurrentUser ? "thetapins" : "notthetapins"}>
                    <p className='thesendername'>{msg.senderName}</p>
                    <p className='thesendertime'>
                      {formatWhatsAppTimestamp(msg.timestamp)}
                    </p>
                  </div>

                  <div
                    className={
                      isCurrentUser ? "thecurrentuserbg" : "notthecurrentuserbg"
                    }
                  >
                    <p>{msg.message}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className='techdashbtm'>
        <div className='techdashbtmcnt'>
          {/* <button className='imgbtn'>
            <img src={imgsend} alt='' srcset='' />
          </button> */}
          <div className='thetypemsg'>
            <input
              type='text'
              value={newMsg}
              placeholder='Type a message..'
              onChange={(e) => setNewMsg(e.target.value)}
            />
            <button className='imgbtn' onClick={sendMessage}>
              <img src={sendimg} alt='' srcset='' />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
