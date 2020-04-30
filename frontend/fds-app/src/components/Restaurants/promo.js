import React, { Component } from "react";
import config from "../../config"
import axios from 'axios';
import auth from "../../auth";
import { Table } from 'reactstrap'
import $ from 'jquery';
import Button from 'react-bootstrap/Button';

class Promo extends Component {
	constructor(props) {
    super(props);

    this.state = {
      id : auth.getUser().userid,
      rid: 0,
      rname: "",
      discountPromo: [],
      message: ""
    }

  }

  componentDidMount() {
    let url = config.backend_url + "/restaurant/getRestaurantInfo/" + this.state.id;
    axios.get(url)
    .then(res => {
      var data = res.data[0]
      this.setState({rname: data.rname, rid: data.rid, message: ""})

      let url = config.backend_url + "/restaurant/getDiscountPromo/" + data.rid;
      return axios.get(url);
    })
    .then(res => {
      console.log(res);
      this.setState({discountPromo: res.data})
    })
    .catch(err => {
      console.log(err)
      this.setState({message: "Failed to get information"})
    })
  }

  createTable = () => {
    let rows = []

    for (let i = 0; i < this.state.discountPromo.length; i++) {
      let item = [<td>{this.state.discountPromo[i].pcid}</td>,
                  <td>{this.state.discountPromo[i].start_time}</td>,
                  <td>{this.state.discountPromo[i].end_time}</td>,
                  <td>{this.state.discountPromo[i].min_spend}</td>, 
                  <td>{this.state.discountPromo[i].max_spend}</td>, 
                  <td>{this.state.discountPromo[i].discount}</td>]
      rows.push(<tr>{item}</tr>)
    }
    return rows;
  }
  render() {
    
    return (
      <div>
        <h3>Promotion Campaign</h3>
        <h4>ID: {this.state.rid}</h4>
        <h4>Name: {this.state.rname}</h4>
        <div>
        <h4>{"Message: " + this.state.message}</h4>
        </div>
        <h3>Discount Promo</h3>
        <Table id="tableID">
      <thead>
        <tr>
          <th>ID</th>
          <th>Start Time</th>
          <th>End Time</th>
          <th>Min Spend</th>
          <th>Max Spend</th>
          <th>Discount Percentage</th>
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

export default Promo;
