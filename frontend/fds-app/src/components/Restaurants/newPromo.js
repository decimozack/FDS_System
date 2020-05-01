import React, { Component } from "react";
import config from "../../config"
import axios from 'axios';
import auth from "../../auth";
import { Table } from 'reactstrap'
import $ from 'jquery';
import Button from 'react-bootstrap/Button';

class NewPromo extends Component {
	constructor(props) {
    super(props);

    this.state = {
      id : auth.getUser().userid,
      rid: 0,
      start_time: "",
      end_time: "",
      min_spend: null,
      max_spend: null,
      discount: 0,
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    let url = config.backend_url + "/restaurant/getRestaurantInfo/" + this.state.id;
    axios.get(url)
    .then(res => {
      var data = res.data[0]
      this.setState({rname: data.rname, rid: data.rid, message: ""})
    })
    .catch(err => {
      console.log(err)
      this.setState({message: "Failed to get information"})
    })
  }

  handleChange(event, type) {
    this.setState({[type]: event.target.value});
  }

  handleSubmit(event) {
    let url = config.backend_url + "/restaurant/newDiscountPromo";
    axios.post(url, this.state)
    .then(res => {
      this.setState({message: "Successfully added food item"})
    })
    .catch(err => {
      console.log(err)
      this.setState({message: "Failed to Update food information"})
    })
  }


  render() {
    
    return (
      <div>
        <h3>New Promotion Campaign</h3>
        <h4>ID: {this.state.rid}</h4>
        <h4>Restaurant Name: {this.state.rname}</h4>
        <div>
        <h4>{"Message: " + this.state.message}</h4>
        <br/>
        <h3>Information for New Discount Promotion</h3>
        </div>
        <form>
          <div>
          <label style={{width:"300px", fontSize: "large"}}>
            Start Time:</label>
            <input type="text" value={this.state.start_time} onChange={(e) => this.handleChange(e, 'start_time')} />
          
          </div>
          <div>
          <label style={{width:"300px", fontSize: "large"}}>
            End Time:</label>
            <input type="text" value={this.state.end_time} onChange={(e) => this.handleChange(e, 'end_time')} />
          
          </div>
          <div>
          <label style={{width:"300px", fontSize: "large"}}>
            Min Amount Spend to be Eligible:</label>
            <input type="text" pattern="[0-9]*.[0.9]*" value={this.state.min_spend} onChange={(e) => this.handleChange(e, 'min_spend')} />
          
          </div>
          <div>
          <label style={{width:"300px", fontSize: "large"}}>
            Max Amount Spend to be Eligible:</label>
            <input type="text" pattern="[0-9]*.[0.9]*" value={this.state.max_spend} onChange={(e) => this.handleChange(e, 'max_spend')} />
          
          </div>
          <div>
          <label style={{width:"300px", fontSize: "large"}}>
            Discount Percentage:</label>
            <input type="text" pattern="[0-9]*.[0.9]*" value={this.state.discount} onChange={(e) => this.handleChange(e, 'discount')} />
          
          </div>
        </form>
        <Button onClick={this.handleSubmit}>Submit</Button>
      </div>
    );
  }
}

export default NewPromo;
