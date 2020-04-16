import React, { Component } from "react";
import config from "../../config"
import axios from 'axios';
import auth from "../../auth";
import { Table } from 'reactstrap'
import $ from 'jquery';
import Button from 'react-bootstrap/Button';

class WorkHistory extends Component {
	constructor(props) {
    super(props);

    this.state = {
      id : auth.getUser().userid,
      workhistory : [],
      message: ""
    }

    this.clockIn = this.clockIn.bind(this);
    this.clockOut = this.clockOut.bind(this);
  }

  componentDidMount() {
    let url = config.backend_url + "/rider/getClockIn/" + this.state.id;
    axios.get(url)
    .then(res => {
      this.setState({workhistory: res.data, message: ""})
    })
    .catch(err => {
      console.log(err)
    })
  }

  clockIn() {
    let url = config.backend_url + "/rider/clockIn/" + this.state.id;
    axios.get(url)
    .then(res => {
      let url = config.backend_url + "/rider/getClockIn/" + this.state.id;
      return axios.get(url);
    })
    .then(res => {
      this.setState({workhistory: res.data, message: ""})
    })
    .catch(err => {
      this.setState({message: "You are already clocked in"});
    })
  }

  clockOut() {
    let url = config.backend_url + "/rider/clockOut/" + this.state.id;
    axios.get(url)
    .then(res => {
      let url = config.backend_url + "/rider/getClockIn/" + this.state.id;
      return axios.get(url);
    })
    .then(res => {
      this.setState({workhistory: res.data, message: ""})
    })
    .catch(err => {
      this.setState({message: "Could not clock out"});
    })
  }

  createTable = () => {
    let rows = []

    for (let i = 0; i < this.state.workhistory.length; i++) {
      let item = [<td>{this.state.workhistory[i].timein}</td>, <td>{this.state.workhistory[i].timeout}</td>]
      rows.push(<tr>{item}</tr>)
    }
    return rows;
  }

  render() {
    
    return (
      <div>
        <h3>Work History</h3>
        <div>
        <Button onClick={this.clockIn}>Clock In</Button>
        <Button onClick={this.clockOut}>Clock Out</Button>
        </div>
        <div>
        <h4>{"Message: " + this.state.message}</h4>
        </div>
        <Table id="tableID">
      <thead>
        <tr>
          <th>Clock In</th>
          <th>Clock Out</th>
        </tr>
      </thead>
      <tbody>
        {this.createTable()}
        
      </tbody>
    </Table>
      </div>
    );
  }
}

export default WorkHistory;
