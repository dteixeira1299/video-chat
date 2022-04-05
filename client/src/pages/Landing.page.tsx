import React, { ChangeEvent } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Landing.module.css";

export const LandingPage = () => {
  const [username, setUsername] = useState<string>();
  const [callUUID, setCallUUID] = useState<string>();
  const [callUsername, setCallUsername] = useState<string>();

  const navigate = useNavigate();

  const updateUsername = (event: ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const startCall = () => {
    if (username) {
      navigate("/call");
    }
  };

  return (
    <div className={styles["landing-page-container"]}>
      <div className={styles["option-container"]}>
        <input
          type="text"
          placeholder="Username"
          className="m-5"
          onChange={updateUsername}
          value={username}
        />
        <button onClick={startCall} className="m-5">
          Start Call
        </button>
      </div>
      <div className={styles["option-container"]}>
        <input
          type="text"
          placeholder="Username"
          className="m-5"
          value={callUsername}
        />
        <input
          type="text"
          placeholder="Call Id"
          className="m-5"
          value={callUUID}
        />
        <button className="m-5">Enter Call</button>
      </div>
    </div>
  );
};
