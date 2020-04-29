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
        <h4>Name: {this.state.rname}</h4>
        <div>
        <h4>{"Message: " + this.state.message}</h4>
        </div>
        <form>
          <div>
          <label>
            Name:
            <input type="text" value={this.state.fname} onChange={(e) => this.handleChange(e, 'fname')} />
          </label>
          </div>
          <div>
          <label>
            Description:
            <input type="text" value={this.state.fdesc} onChange={(e) => this.handleChange(e, 'fdesc')} />
          </label>
          </div>
          <div>
          <label>
            Category:
            <input type="text" value={this.state.catname} onChange={(e) => this.handleChange(e, 'catname')} />
          </label>
          </div>
          <div>
          <label>
            Food Limit:
            <input type="text" pattern="[0-9]*" value={this.state.food_limit} onChange={(e) => this.handleChange(e, 'food_limit')} />
          </label>
          </div>
          <div>
          <label>
            Price:
            <input type="text" pattern="[0-9]*.[0.9]*" value={this.state.price} onChange={(e) => this.handleChange(e, 'price')} />
          </label>
          </div>
        </form>
        <Button onClick={this.handleSubmit}>Submit</Button>
      </div>
    );
  }
}

export default NewFoodItem;
