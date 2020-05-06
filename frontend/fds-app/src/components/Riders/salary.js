import React, { Component } from "react";
import config from "../../config"
import axios from 'axios';
import auth from "../../auth";
import { Table } from 'reactstrap'
import $ from 'jquery';
import Button from 'react-bootstrap/Button';

class RiderSalary extends Component {
	constructor(props) {
    super(props);

    this.state = {
      id : auth.getUser().userid,
      assigned : [],
      message: ""
    }

  }

  componentDidMount() {
    let url = config.backend_url + "/rider/getSalary/" + this.state.id;
    axios.get(url)
    .then(res => {
      this.setState({assigned: res.data, message: ""})
    })
    .catch(err => {
      console.log(err)
    })
  }


  createTable = () => {
    let rows = []

    for (let i = 0; i < this.state.assigned.length; i++) {
      let item = [<td>{this.state.assigned[i].month}</td>,
                  <td>{this.state.assigned[i].salary}</td>]
      rows.push(<tr>{item}</tr>)
    }
    return rows;
  }

  render() {
    console.log(this.state)
    return (
      <div>
        <h3>Salary</h3>
        <div>
        <h4>{"Message: " + this.state.message}</h4>
        </div>
        <Table id="tableID">
      <thead>
        <tr>
          <th>Month</th>
          <th>Salary</th>
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

export default RiderSalary;
