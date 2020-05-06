import React, { Component } from "react";
import config from "../../config"
import axios from 'axios';
import auth from "../../auth";
import { Table } from 'reactstrap'
import $ from 'jquery';
import Button from 'react-bootstrap/Button';

class RiderRatings extends Component {
	constructor(props) {
    super(props);

    this.state = {
      id : auth.getUser().userid,
      average: 0,
      assigned : [],
      message: ""
    }

  }

  componentDidMount() {
    let url = config.backend_url + "/rider/getRatings/" + this.state.id;
    axios.get(url)
    .then(res => {
      var average = 0;
      for (var i =0; i < res.data.length; i++) {
        average += res.data[i].rating;
      }
      console.log(average)
      if (res.data.length > 0) {
        average /= res.data.length;
      }
      this.setState({average: average, assigned: res.data, message: ""})
    })
    .catch(err => {
      console.log(err)
    })
  }


  createTable = () => {
    let rows = []

    for (let i = 0; i < this.state.assigned.length; i++) {
      let item = <td>{this.state.assigned[i].rating}</td>
      rows.push(<tr>{item}</tr>)
    }
    return rows;
  }

  render() {
    console.log(this.state)
    return (
      <div>
        <h3>Ratings</h3>
        <div>
        <h4>{"Average Rating: " + this.state.average}</h4>
        </div>
        <Table id="tableID">
      <thead>
        <tr>
          <th>Ratings</th>
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

export default RiderRatings;
