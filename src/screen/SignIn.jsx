import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../utilities/firebaseConfig";
import { useNavigate } from "react-router-dom";
import "./signup.css";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard"); // Redirect to dashboard on successful sign-in
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
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
        <p className="forgotpassworkclick">Forgot password?</p>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type='submit' disabled={loading} className="thesigninbtn">
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
      <p className="forgotpassworkclick">
        Don't have an account ?{" "}
        <span onClick={() => navigate("/signup")}>Sign up</span>
      </p>
    </div>
  );
}

export default SignIn;
