import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db, get, ref } from "../utilities/firebaseConfig";
import backarrow from "../assets/backwardarrow.svg";
import profileavatar from "../assets/pravatar.png";
import imgsend from "../assets/imgicon.svg";
import sendimg from "../assets/sendimg.svg";
import { onValue, push } from "firebase/database";

const Chat = ({ chatId }) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(true);
  const [acceptedtsk, setAcceptedtsk] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");

  useEffect(() => {
    const chatRef = ref(db, `chats/${chatId}`);
    onValue(chatRef, (snapshot) => {
      const data = snapshot.val();
      const msgs = data ? Object.values(data) : [];
      setMessages(msgs);
    });
  }, [chatId]);

  const [technician, setTechnician] = useState(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      navigate("/");
      return;
    }

    // Fetch technician details
    const technicianRef = ref(db, `technicians/${user.uid}`);
    onValue(technicianRef, (snapshot) => {
      if (snapshot.exists()) {
        const techData = snapshot.val();
        setTechnician(techData);
      }
    });
  }, []);

  const sendMessage = () => {
    if (newMsg.trim() === "") return;
    const messageData = {
      sender: auth.currentUser.uid,
      senderName: technician.fullName || "User",
      message: newMsg,
      timestamp: Date.now(),
    };
    push(ref(db, `chats/${chatId}`), messageData);
    setNewMsg("");
  };

  return (
    <>
      <div className='techdash'>
        <button className='backbtn' onClick={() => navigate("/message")}>
          <img src={backarrow} alt='' srcset='' />
        </button>
        <div
          className='techdashtop'
          style={{
            backgroundColor: "#fff",
            padding: "10px",
            borderRadius: "16px",
            borderBottomRightRadius: "0px",
            borderBottomLeftRadius: "0px",
          }}
        >
          <div className='messagedetailscnt'>
            <img src={profileavatar} alt='' />
            <div className='mdcright'>
              <p className='mdcname'>Ben Affleck</p>
              <div className='mdcrightstatus'>
                <div className='sticon'></div>
                <p>Online</p>
              </div>
            </div>
          </div>

          <div className='thspp'></div>
        </div>

        <div className='thecontentbd'>
          <div
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              height: "200px",
              overflowY: "scroll",
            }}
          >
            {messages.map((msg, index) => (
              <p key={index}>
                <strong>{msg.senderName}:</strong> {msg.message}
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className='techdashbtm'>
        <div className='techdashbtmcnt'>
          <button className='imgbtn'>
            <img src={imgsend} alt='' srcset='' />
          </button>
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
