import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth, db, get, ref } from "../utilities/firebaseConfig";
import { useNavigate } from "react-router-dom";
import "./signup.css";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userId = userCredential.user.uid;
      const roleRef = ref(db, `technicians/${userId}/role`);
      const snapshot = await get(roleRef);

      if (snapshot.exists() && snapshot.val() === "technician") {
        navigate("/dashboard");
      } else {
        setError("Access denied.");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className='signin_cnt'>
      <h2 className='signin_title'>Sign into your account</h2>
      <p className='signin_para'>
        Hello! welcome back. Kindly sign into your account to continue
      </p>
      <form onSubmit={handleSubmit}>
        <div className='inputcnt'>
          <label>Email Address</label>
          <input
            type='email'
            value={email}
            placeholder='Enter your email address'
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className='inputcnt'>
          <label>Password</label>
          <input
            type='password'
            value={password}
            placeholder='Enter your password'
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <p className='forgotpassworkclick'>Forgot password?</p>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type='submit' className='thesigninbtn'>
          Sign In
        </button>
      </form>
      <p className='forgotpassworkclick'>
        Don't have an account ?{" "}
        <span onClick={() => navigate("/signup")}>Sign up</span>
      </p>
    </div>
  );
}

export default SignIn;
