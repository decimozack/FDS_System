import React, { Component } from "react";
import config from "../../config"
import axios from 'axios';
import auth from "../../auth";
import { Table } from 'reactstrap'
import $ from 'jquery';
import Button from 'react-bootstrap/Button';

class NewFoodItem extends Component {
	constructor(props) {
    super(props);

    this.state = {
      id : auth.getUser().userid,
      rid: 0,
      rname: "",
      fname: "",
      fdesc: "",
      catname: "",
      food_limit: 0,
      price: 0
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
    let url = config.backend_url + "/restaurant/newFoodItem";
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
        <h3>New Food Item</h3>
        <h4>ID: {this.state.rid}</h4>
        <h4>Restaurant Name: {this.state.rname}</h4>
        <div>
        <h4>{"Message: " + this.state.message}</h4>
        <br/>
        <h3>Please input new food item's information</h3>
        </div>
        <form>
          <div>
          <label style={{width:"100px", fontSize: "large"}}>Name:</label>
          <input type="text" value={this.state.fname} onChange={(e) => this.handleChange(e, 'fname')} />
          </div>
          <div>
          <label style={{width:"100px", fontSize: "large"}}>
            Description:</label>
            <input type="text" value={this.state.fdesc} onChange={(e) => this.handleChange(e, 'fdesc')} />
          
          </div>
          <div>
          <label style={{width:"100px", fontSize: "large"}}>
            Category:</label>
            <input type="text" value={this.state.catname} onChange={(e) => this.handleChange(e, 'catname')} />
          
          </div>
          <div>
          <label style={{width:"100px", fontSize: "large"}}>
            Food Limit:</label>
            <input type="text" pattern="[0-9]*" value={this.state.food_limit} onChange={(e) => this.handleChange(e, 'food_limit')} />
          
          </div>
          <div>
          <label style={{width:"100px", fontSize: "large"}}>
            Price:</label>
            <input type="text" pattern="[0-9]*.[0.9]*" value={this.state.price} onChange={(e) => this.handleChange(e, 'price')} />
          
          </div>
        </form>
        <Button onClick={this.handleSubmit}>Submit</Button>
      </div>
    );
  }
}

export default NewFoodItem;
