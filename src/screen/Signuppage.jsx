import React, { useState } from "react";
import "./signup.css";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db, get, ref, set } from "../utilities/firebaseConfig";

function Signuppage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      // Create user with email and password
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = result.user;
      if (!user) return;

      const userRef = ref(db, `technician/${user.uid}`);

      // check if user exists in Firebase
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        const userData = snapshot.val();

        // checking for user sign up progress
        if (!userData.step1Completed) {
          navigate("/");
        } else if (!userData.step2Completed) {
          navigate("/info_one");
        } else if (!userData.step4Completed) {
          navigate("/info_two");
        } else {
          navigate("/portal"); // All steps completed
        }
      } else {
        // Store user data in Realtime Database
        await set(ref(db, `technician/${user.uid}`), {
          email: user.email,
          role: "technician", // Automatically assign "technician" role
          approval: "pending",
          step1Completed: true,
        });

        // Redirect to login or dashboard
        navigate("/info_one");
      }
    } catch (err) {
      setError(err.message);
      alert("Error signing in your credentials");
    }
  };
  return (
    <div className='signin_cnt'>
      <h2 className='signin_title'>Sign up to create an account with us.</h2>
      <p className='signin_para'>
        Welcome to Profixexpress. Kindly create your account.
      </p>
      <div className='inputcnt'>
        <label htmlFor=''>Email</label>
        <input
          type='text'
          name='email'
          placeholder='please enter your email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className='inputcnt'>
        <label htmlFor=''>Password</label>
        <input
          type='password'
          name='password'
          placeholder='enter password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <div className='inputcnt'>
        <label htmlFor=''>Confirm password</label>
        <input
          type='password'
          name='confirmPassword'
          placeholder='re-enter password'
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>

      <button className='thesigninbtn' onClick={handleSignUp}>
        Continue
      </button>
      <p className='forgotpassworkclick'>
        I have an account ? <span onClick={() => navigate("/")}>Sign in</span>
      </p>
    </div>
  );
}

export default Signuppage;
