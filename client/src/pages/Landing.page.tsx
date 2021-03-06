import React, { ChangeEvent, useEffect } from "react";
import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Landing.module.css";
import { updateSessionStorage } from "../utils/session-storage";

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

  const startCall = async () => {
    // TODO: Change to use ENV vars to get url
    const response = await fetch(process.env.REACT_APP_API_URL + "/calls/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({})
    });
    const callInfo: { accessCode: string } = await response.json();
    navigate("/waiting/" + callInfo.accessCode);
  };

  const enterCall = () => {
    fetch(process.env.REACT_APP_API_URL + "/calls/" + callUUID, {
      method: "GET"
    })
      .then(() => navigate("/waiting/" + callUUID))
      .catch(() => alert("Call ID não encontrado"));
  };

  // Não apagar, hooks do react executados quando é username é modificado
  useEffect(() => {
    updateSessionStorage("username", username);
  }, [username]);

  // Não apagar, hooks do react executados quando é username é modificado
  useEffect(() => {
    updateSessionStorage("username", callUsername);
  }, [callUsername]);

  return (
    <div className={styles["landing-page-container"]}>
      <div className={styles["option-container"]}>
        <Form.Control
          type="text"
          placeholder="Username"
          onChange={updateUsername}
          value={username}
        />
        <Button
          variant="dark"
          onClick={startCall}
          className="mt-4"
          disabled={!username}
        >
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
        <Button
          onClick={enterCall}
          variant="dark"
          className="mt-4"
          disabled={!callUsername || !callUUID}
        >
          Enter Call
        </Button>
      </div>
    </div>
  );
};
