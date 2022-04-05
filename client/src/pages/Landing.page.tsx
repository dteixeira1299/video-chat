import React, { ChangeEvent } from "react";
import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Landing.module.css";

export const LandingPage = () => {
  const [username, setUsername] = useState<string>("");
  const [callUUID, setCallUUID] = useState<string>("");
  const [callUsername, setCallUsername] = useState<string>("");

  const navigate = useNavigate();

  const updateUsername = (event: ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const updateCallUsername = (event: ChangeEvent<HTMLInputElement>): void => {
    setCallUsername(event.target.value);
  };

  const updateCallUUID = (event: ChangeEvent<HTMLInputElement>): void => {
    setCallUUID(event.target.value);
  };

  const startCall = () => {
    if (!username.trim()) {
      alert("ups!");
      return;
    }
    navigate("/call");
  };

  const enterCall = () => {
    if (!callUUID.trim() && !callUsername.trim()) {
      alert("ups!");
      return;
    }
    navigate("/call");
  };

  return (
    <div className={styles["landing-page-container"]}>
      <div className={styles["option-container"]}>
        <Form.Control
          type="text"
          placeholder="Username"
          onChange={updateUsername}
          value={username}
        />
        <Button variant="dark" onClick={startCall} className="mt-4">
          Start Call
        </Button>
      </div>
      <div className={styles["option-container"]}>
        <Form.Control
          type="text"
          placeholder="Username"
          onChange={updateCallUsername}
          value={callUsername}
        />
        <Form.Control
          type="text"
          className="mt-4"
          placeholder="Call Id"
          onChange={updateCallUUID}
          value={callUUID}
        />
        <Button onClick={enterCall} variant="dark" className="mt-4">
          Enter Call
        </Button>
      </div>
    </div>
  );
};
