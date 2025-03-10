import { get, ref, set } from "firebase/database";
import React, { useEffect, useState } from "react";
import { auth, db, storage } from "../utilities/firebaseConfig";
import { useNavigate } from "react-router-dom";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import "./dashboard.css";

function InfopageTwo() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [expyears, setExpyears] = useState("");
  const [certificateName, setCertificateName] = useState("");
  const [issuingOrganisation, setIssuingOrganisation] = useState("");
  const [monthyear, setMonthyear] = useState("");
  const [fromtime, setFromTime] = useState("");
  const [totime, setToTime] = useState("");
  const [govissuedid, setGovIssuedId] = useState("");
  const [proofAddressFile, setProofAddressFile] = useState(null);
  const [govIssuedIdFile, setGovIssuedIdFile] = useState(null);
  const [certificateFile, setCertificateFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  const [service, setService] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) {
        console.error("No authenticated user found.");
        setLoading(false);
        navigate("/signup");
        return;
      }

      try {
        const userRef = ref(db, `technicians/${user.uid}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          setUserData(snapshot.val());
        } else {
          console.error("User data not found.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

  const handleFileChange = (event, setFile) => {
    setFile(event.target.files[0]);
  };

  const saveDetails = async () => {
    setLoading(true);
    const userId = auth.currentUser.uid;

    try {
      let proofAddressUrl = "";
      let govIssuedIdUrl = "";
      let certificateUrl = "";

      if (proofAddressFile) {
        const proofAddressRef = storageRef(
          storage,
          `technicians/${userId}/proof_address`
        );
        await uploadBytes(proofAddressRef, proofAddressFile);
        proofAddressUrl = await getDownloadURL(proofAddressRef);
      }

      if (govIssuedIdFile) {
        const govIssuedIdRef = storageRef(
          storage,
          `technicians/${userId}/gov_issued_id`
        );
        await uploadBytes(govIssuedIdRef, govIssuedIdFile);
        govIssuedIdUrl = await getDownloadURL(govIssuedIdRef);
      }

      if (certificateFile) {
        const certificateRef = storageRef(
          storage,
          `technicians/${userId}/certificate`
        );
        await uploadBytes(certificateRef, certificateFile);
        certificateUrl = await getDownloadURL(certificateRef);
      }

      await set(ref(db, `technicians/${userId}`), {
        ...userData,
        specialization: selectedCategory,
        services: selectedServices,
        expyears,
        certificateName,
        issuingOrganisation,
        monthyear,
        service,
        certificateUrl,
        fromtime,
        totime,
        govissuedid,
        govIssuedIdUrl,
        proofAddressUrl,
        step1Completed: true,
        step2Completed: true,
        step3Completed: true,
      });

      navigate("/dashboard");
    } catch (error) {
      console.error("Error saving details:", error);
      alert("Failed to save details. Please try again.");
    }
    setLoading(false);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className='signin_cnt'>
      <h2 className='signin_title'>Professional Information</h2>
      <p className='signin_para'>
        Fill in your expertise, experience, and service preferences.
      </p>

      <div className='inputcnt'>
        <label>Service</label>
        <select
          value={service}
          onChange={(e) => setService(e.target.value)} required
        >
           <option value="">Select Service</option>
          <option value="plumbing">Plumbing</option>
          <option value="electrical">Electrical</option>
          <option value="carpentry">Carpentry</option>
        </select>
      </div>

      <div className='inputcnt'>
        <label>Years of experience</label>
        <input
          type='number'
          value={expyears}
          onChange={(e) => setExpyears(e.target.value)}
        />
      </div>
      <p className='formtitle'>Certification</p>
      <div className='inputcnt'>
        <input
          type='text'
          value={certificateName}
          placeholder='Enter certificate name'
          onChange={(e) => setCertificateName(e.target.value)}
        />
      </div>
      <div className='inputcnt'>
        <input
          type='text'
          value={issuingOrganisation}
          placeholder='Enter Issuing organisation'
          onChange={(e) => setIssuingOrganisation(e.target.value)}
        />
      </div>
      <div className='inputcnt'>
        <label htmlFor=''>Issuing date</label>
        <input
          type='month'
          value={monthyear}
          placeholder='month and year'
          onChange={(e) => setMonthyear(e.target.value)}
        />
      </div>
      <div className='inputcnt'>
        <label htmlFor=''>Upload certificate</label>
        <input
          type='file'
          accept='.jpg, .png, .pdf'
          onChange={(e) => handleFileChange(e, setCertificateFile)}
        />
      </div>
      <p className='formtitle'>Working Hours</p>

      <div className='signup_dividetime'>
        <div className='inputcnt'>
          <label htmlFor=''>From</label>
          <input
            type='time'
            value={fromtime}
            onChange={(e) => setFromTime(e.target.value)}
          />
        </div>
        <div className='inputcnt'>
          <label htmlFor=''>To</label>
          <input
            type='time'
            value={totime}
            onChange={(e) => setToTime(e.target.value)}
          />
        </div>
      </div>

      <div className='inputcnt'>
        <label>Government Issued ID</label>
        <select
          value={govissuedid}
          onChange={(e) => setGovIssuedId(e.target.value)}
        >
          <option value=''>Select ID</option>
          <option value='NIN'>NIN</option>
          <option value='Passport'>Passport</option>
        </select>
      </div>
      <div className='inputcnt'>
        {" "}
        <input
          type='file'
          accept='.jpg, .png, .pdf'
          onChange={(e) => handleFileChange(e, setGovIssuedIdFile)}
        />
      </div>
      <p className='formtitle'>Proof of Address</p>
      <div className='inputcnt'>
        <input
          type='file'
          accept='.jpg, .png, .pdf'
          onChange={(e) => handleFileChange(e, setProofAddressFile)}
        />
      </div>

      <button className='thesigninbtn' onClick={saveDetails} disabled={loading}>
        {loading ? "Saving..." : "Continue"}
      </button>
    </div>
  );
}

export default InfopageTwo;
