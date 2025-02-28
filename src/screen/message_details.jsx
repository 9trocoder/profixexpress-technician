import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db, get, ref } from "../utilities/firebaseConfig";
import backarrow from "../assets/backwardarrow.svg";
import profileavatar from "../assets/pravatar.png";
import imgsend from "../assets/imgicon.svg";
import sendimg from "../assets/sendimg.svg";

function MessageDetails() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(true);
  const [acceptedtsk, setAcceptedtsk] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    // Check if a user is logged in
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userRef = ref(db, `technician/${currentUser.uid}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          setUserData(snapshot.val());
        } else {
          console.log("User data not found");
        }
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);
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

        <div className='thecontentbd'></div>
      </div>
      <div className='techdashbtm'>
        <div className='techdashbtmcnt'>
          <button className="imgbtn">
            <img src={imgsend} alt='' srcset='' />
          </button>
          <div className='thetypemsg'>
            <input type='text' placeholder='Type a message..' />
            <button className="imgbtn">
              <img src={sendimg} alt='' srcset='' />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default MessageDetails;
