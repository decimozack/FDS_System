import React, { Component } from "react";
import auth from "../auth";

class About extends Component {
  constructor(props) {
    super(props);

    let user = auth.getUser();
    console.log(user);
    console.log(user["userid"]);
  }

  render() {
    return (
      <div>
        <h4 align="center" style={{ "margin-top": "30px" }}>
          About
        </h4>
        <p align="center" style={{ "margin-top": "30px" }}>
          This is FDS Food Delivery System. Our Company is here to help you out
          during the COVID-19 period by delivering food to you.
        </p>
      </div>
    );
  }
}

export default About;
