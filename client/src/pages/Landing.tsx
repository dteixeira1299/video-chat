import { Component } from "react";
import styles from "../styles/Landing.module.css";

// TODO: Change to class when it's needed to add setters
interface LandingPageModel {
  username?: string;
  call: {
    uuid?: string;
    username?: string;
  };
}

export class LandingPage extends Component<{}, LandingPageModel> {
  constructor(props: {}) {
    super(props);
    this.state = { call: {} };
  }

  render() {
    return (
      <div className={styles["landing-page-container"]}>
        <div className={styles["option-container"]}>
          <input
            type="text"
            placeholder="Username"
            className="m-5"
            value={this.state.username}
          />
          <button className="m-5">Start Call</button>
        </div>
        <div className={styles["option-container"]}>
          <input
            type="text"
            placeholder="Username"
            className="m-5"
            value={this.state.call.username}
          />
          <input
            type="text"
            placeholder="Call Id"
            className="m-5"
            value={this.state.call.uuid}
          />
          <button className="m-5">Enter Call</button>
        </div>
      </div>
    );
  }
}
