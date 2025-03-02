// src/pages/CallTechnician.js
import React, { useState } from "react";
import Peer from "simple-peer";

const CallTechnician = () => {
  const [peer, setPeer] = useState(null);

  const startCall = () => {
    const p = new Peer({ initiator: true, trickle: false });
    p.on("signal", (data) => console.log("Call Signal:", data));
    setPeer(p);
  };

  return (
    <div>
      <h2>Call Technician</h2>
      <button onClick={startCall}>Start Call</button>
    </div>
  );
};

export default CallTechnician;
