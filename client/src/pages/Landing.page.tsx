import { Component } from "react";
import React, { ChangeEvent } from "react";
import styles from "../styles/Landing.module.css";
import Form from "react-bootstrap/Form";
import { Container, Row, Col, Button } from "react-bootstrap";

// TODO: Change to class when it's needed to add setters
interface LandingPageModel {
  username?: string;
  call: {
    username?: string;
    uuid?: string;
  };
}

export class LandingPage extends Component<{}, LandingPageModel> {
  constructor(props: {}) {
    super(props);
    this.state = { call: { username: "", uuid: "" } };
  }

  private updateCallUsername = (event: ChangeEvent<HTMLInputElement>): void => {
    this.setState({ call: { username: event.target.value } });
  };

  private updateCallUUID = (event: ChangeEvent<HTMLInputElement>): void => {
    this.setState({ call: { uuid: event.target.value } });
  };

  private EnterCall = (): void => {
    alert(
      "Username: " +
        this.state.call.username +
        "<br>" +
        "UUID: " +
        this.state.call.uuid +
        "<br>TERMINADO"
    );
  };

  render() {
    return (
      <div>
        <Container>
          <Row>
            <Col xs={6}>
              <Form.Label htmlFor="inputUsername">Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Username"
                id="inputUsername"
                value={this.state.username}
              />
              <Button className="float-end mt-2" variant="dark">
                Start Call
              </Button>
            </Col>
            <Col xs={6}>
              <Form onSubmit={this.EnterCall} action="Call">
                <Form.Label htmlFor="inputUsername2">Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Username"
                  id="inputUsername2"
                  value={this.state.call.username || ""}
                  onChange={this.updateCallUsername}
                  required
                />
                <Form.Label className="mt-2" htmlFor="inputCallID">
                  Call ID
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Call ID"
                  id="inputCallID"
                  value={this.state.call.uuid || ""}
                  onChange={this.updateCallUUID}
                  required
                />
                <Button type="submit" className="float-end mt-2" variant="dark">
                  Enter Call
                </Button>
              </Form>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}
