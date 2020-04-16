import React, { Component } from "react";
import auth from "../auth";

class About extends Component {
	constructor(props) {
    super(props);

    let user = auth.getUser();
    console.log(user)
    console.log(user["userid"])
  }

  render() {
    return (
      <div>
        <h4>About</h4>
        <p>This is About page.</p>
      </div>
    );
  }
}

export default About;
