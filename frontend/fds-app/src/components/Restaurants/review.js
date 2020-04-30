import React, { Component } from "react";
import config from "../../config"
import axios from 'axios';
import auth from "../../auth";
import { Table } from 'reactstrap'
import $ from 'jquery';
import Button from 'react-bootstrap/Button';

class RestaurantReview extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id : auth.getUser().userid,
      rid: 0,
      rname: "",
      review: []
    }
  }

  componentDidMount() {
    let url = config.backend_url + "/restaurant/getRestaurantInfo/" + this.state.id;
    axios.get(url)
    .then(res => {
      var data = res.data[0]
      this.setState({rname: data.rname, rid: data.rid, message: ""})

      let url = config.backend_url + "/restaurant/getReview/" + data.rid;
      return axios.get(url);
    })
    .then(res => {
      this.setState({review: res.data})
    })
    .catch(err => {
      console.log(err)
      this.setState({message: "Failed to get information"})
    })
  }

  createTable = () => {
    let rows = []

    for (let i = 0; i < this.state.review.length; i++) {
      let item = [<td>{this.state.review[i].oid}</td>,
                  <td>{this.state.review[i].description}</td>]
      rows.push(<tr>{item}</tr>)
    }
    return rows;
  }
  render() {
    
    return (
      <div>
        <h3>Review</h3>
        <h4>ID: {this.state.rid}</h4>
        <h4>Restaurant Name: {this.state.rname}</h4>
        <h4>{"Message: " + this.state.message}</h4>
        <Table id="tableID">
      <thead>
        <tr>
          <th>ID</th>
          <th>Review</th>
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

export default RestaurantReview;
