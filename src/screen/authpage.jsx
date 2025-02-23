import React from "react";
import { useNavigate } from "react-router-dom";

function Authpage() {
  const navigate = useNavigate();
  return (
    <div>
      <button onClick={() => navigate("/signin")}>Login</button>
      <button onClick={() => navigate("/signup")}>Sign up</button>
    </div>
  );
}

export default Authpage;
