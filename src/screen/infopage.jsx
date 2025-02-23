import React, { useEffect, useState } from "react";
import { auth, db, get, ref, set } from "../utilities/firebaseConfig";
import { useNavigate } from "react-router-dom";

function Infopage() {
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [gender, setGender] = useState("");
  const [date, setDate] = useState("");
  const [country, setCountry] = useState("Nigeria");
  const [city, setCity] = useState();
  const [state, setState] = useState("");
  const [address, setAddress] = useState("");
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (!user) {
        console.error("No authenticated user found.");
        return;
      }

      try {
        const userRef = ref(db, `technician/${user.uid}`);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
          setUserData(snapshot.val());
        } else {
          console.error("User data not found.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  if (!userData) {
    return navigate("/signup");
  }

  const saveDetails = async () => {
    if (
      !fullName ||
      !mobile ||
      !gender ||
      !date ||
      !country ||
      !state ||
      !address
    ) {
      alert("Please fill all fields.");
      return;
    }

    const userId = auth.currentUser.uid;

    // store basic information details in Firebase Realtime Database
    await set(ref(db, `technician/${userId}`), {
      fullName,
      mobile,
      gender,
      date,
      country,
      state,
      address,
      email: userData.email,
      role: userData.role, // Automatically assign "technician" role
      approval: userData.approval,
      step1Completed: true,
      step2Completed: true,
    });

    navigate("/info_two");
  };

  return (
    <div style={{ display: "grid", width: 400 }}>
      <label htmlFor=''>Full name</label>
      <input
        type='text'
        name='fullName'
        id=''
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        placeholder='enter your full name'
      />
      <label htmlFor=''>Mobile number</label>
      <input
        type='text'
        name='mobile'
        id=''
        placeholder='+234__ ___ ___'
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
      />
      <label htmlFor=''>Gender</label>
      <select
        id='gender'
        name='gender'
        value={gender}
        onChange={(e) => setGender(e.target.value)}
      >
        <option value=''>Select Gender</option>
        <option value='male'>Male</option>
        <option value='female'>Female</option>
        <option value='other'>Other</option>
      </select>
      <label htmlFor=''>Date of birth</label>
      <input
        type='date'
        value={date}
        onChange={(e) => setDate(e.target.value)}
        name='date'
        id=''
      />
      <label htmlFor=''>Country</label>
      <input
        type='text'
        value={country}
        onChange={(e) => setCountry(e.target.value)}
        placeholder='Nigeria'
      />
      <label htmlFor=''>State</label>
      <input
        type='text'
        value={state}
        onChange={(e) => setState(e.target.value)}
        placeholder='Enter your state'
      />
      <label htmlFor=''>City</label>
      <input
        type='text'
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder='Enter your city'
      />
      <label htmlFor=''>Full Address</label>
      <input
        type='text'
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder='Enter your address'
      />

      <button onClick={saveDetails}>Continue</button>
    </div>
  );
}

export default Infopage;
