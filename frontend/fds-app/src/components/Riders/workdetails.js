import React, { Component } from "react";
import config from "../../config"
import axios from 'axios';
import auth from "../../auth";
import { Table } from 'reactstrap'
import $ from 'jquery';
import Button from 'react-bootstrap/Button';

class WorkDetails extends Component {
	constructor(props) {
    super(props);

    this.state = {
      id : auth.getUser().userid,
      assigned : [],
      message: ""
    }

    this.updateTime = this.updateTime.bind(this);
  }

  componentDidMount() {
    let url = config.backend_url + "/rider/getAssignedOrders/" + this.state.id;
    axios.get(url)
    .then(res => {
      this.setState({assigned: res.data, message: ""})
    })
    .catch(err => {
      console.log(err)
    })
  }

  updateTime(id, col) {
    let url = config.backend_url + "/rider/updateOrderTime";

    axios.post(url, {empid: this.state.id, oid: id, col: col})
    .then(res => {
      let url = config.backend_url + "/rider/getAssignedOrders/" + this.state.id;
      return axios.get(url)
    })
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
      let item = [<td>{this.state.assigned[i].oid}</td>,
                <td onClick={() => this.updateTime(this.state.assigned[i].oid, 'toRestaurantTime')}>{this.state.assigned[i].torestauranttime}</td>, 
                <td onClick={() => this.updateTime(this.state.assigned[i].oid, 'arriveAtRestaurantTime')}>{this.state.assigned[i].arriveatrestauranttime}</td>,
                <td onClick={() => this.updateTime(this.state.assigned[i].oid, 'restaurantToCustomerTime')}>{this.state.assigned[i].restauranttocustomertime}</td>, 
                <td onClick={() => this.updateTime(this.state.assigned[i].oid, 'arriveAtCustomerTime')}>{this.state.assigned[i].arriveatcustomertime}</td>,
                <td>{this.state.assigned[i].commission}</td>]
      rows.push(<tr>{item}</tr>)
    }
    return rows;
  }

  render() {
    
    return (
      <div>
        <h3>Work Details</h3>
        <div>
        <h4>{"Message: " + this.state.message}</h4>
        </div>
        <Table id="tableID">
      <thead>
        <tr>
          <th>Order ID</th>
          <th>Depart to Restaurant Time</th>
          <th>Arrive at Restaurant Time</th>
          <th>Depart to Customer Time</th>
          <th>Arrive to Restaurant Time</th>
          <th>Commission</th>
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

export default WorkDetails;
