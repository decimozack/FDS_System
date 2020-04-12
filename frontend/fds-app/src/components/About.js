import React, { Component } from "react";
import auth from "../auth";

class About extends Component {
  render() {
    return (
      <div>
        <h4>About</h4>
        <p>This is About page.</p>
        <button
          onClick={() => {
            auth.logout(() => {
              this.props.history.push("/about");
            });
          }}
        >
          Logout
        </button>
      </div>
    );
  }
}

export default About;
