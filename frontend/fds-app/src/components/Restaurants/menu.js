import React, { Component } from "react";
import config from "../../config"
import axios from 'axios';
import auth from "../../auth";
import { Table } from 'reactstrap'
import $ from 'jquery';
import Button from 'react-bootstrap/Button';

class RestaurantMenu extends Component {
	constructor(props) {
    super(props);

    this.state = {
      id : auth.getUser().userid,
      rid: 0,
      rname: "",
      min_order_cost: 0,
      menu: [],
      message: "",
      edit: {
        fid: 0,
        fname: "",
        fdesc: "",
        catname: "",
        cdesc: "",
        food_limit: 0,
        current_qty: 0,
        price: 0
      }
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleChangeOrderCost = this.handleChangeOrderCost.bind(this);
    this.handleSubmitOrderCost = this.handleSubmitOrderCost.bind(this);
  }

  componentDidMount() {
    let url = config.backend_url + "/restaurant/getRestaurantInfo/" + this.state.id;
    axios.get(url)
    .then(res => {
      var data = res.data[0]
      this.setState({rname: data.rname, rid: data.rid, min_order_cost: data.min_order_cost, message: ""})

      let url = config.backend_url + "/restaurant/getMenu/" + data.rid;
      return axios.get(url);
    })
    .then(res => {
      this.setState({menu: res.data})
    })
    .catch(err => {
      console.log(err)
      this.setState({message: "Failed to get information"})
    })
  }

  handleChange(event, type) {
    var edit = {...this.state.edit}
    edit[type] = event.target.value
    this.setState({edit});
  }

  handleChangeOrderCost(event) {
    this.setState({min_order_cost: event.target.value});
  }

  handleSubmit(event) {
    let url = config.backend_url + "/restaurant/updateFoodItem";
    axios.post(url, this.state.edit)
    .then(res => {
      let url = config.backend_url + "/restaurant/getRestaurantInfo/" + this.state.id;

      return axios.get(url)
    })
    .then(res => {
      var data = res.data[0]
      this.setState({rname: data.rname, rid: data.rid, min_order_cost: data.min_order_cost, message: ""})

      let url = config.backend_url + "/restaurant/getMenu/" + data.rid;
      return axios.get(url);
    })
    .then(res => {
      this.setState({menu: res.data})
    })
    .catch(err => {
      console.log(err)
      this.setState({message: "Failed to Update food information"})
    })
  }

  handleSubmitOrderCost(event) {
    let url = config.backend_url + "/restaurant/updateMinOrderCost";
    axios.post(url, {min_order_cost: this.state.min_order_cost, rid: this.state.rid})
    .then(res => {
      let url = config.backend_url + "/restaurant/getRestaurantInfo/" + this.state.id;

      return axios.get(url)
    })
    .then(res => {
      var data = res.data[0]
      this.setState({rname: data.rname, rid: data.rid, min_order_cost: data.min_order_cost, message: ""})

      let url = config.backend_url + "/restaurant/getMenu/" + data.rid;
      return axios.get(url);
    })
    .then(res => {
      this.setState({menu: res.data})
    })
    .catch(err => {
      console.log(err)
      this.setState({message: "Failed to Update food information"})
    })
  }

  handleEdit(id) {
    this.setState({edit: this.state.menu[id]})
  }

  createTable = () => {
    let rows = []

    for (let i = 0; i < this.state.menu.length; i++) {
      let item = [<td>{this.state.menu[i].fid}</td>,
                  <td>{this.state.menu[i].fname}</td>, 
                  <td>{this.state.menu[i].fdesc}</td>, 
                  <td>{this.state.menu[i].catname}</td>, 
                  <td>{this.state.menu[i].cdesc}</td>, 
                  <td>{this.state.menu[i].food_limit}</td>, 
                  <td>{this.state.menu[i].current_qty}</td>, 
                  <td>{this.state.menu[i].price}</td>, 
                  <td><Button onClick={() => this.handleEdit(i)}>Edit</Button></td>]
      rows.push(<tr>{item}</tr>)
    }
    return rows;
  }
  render() {
    
    return (
      <div>
        <h3>Menu</h3>
        <h4>ID: {this.state.rid}</h4>
        <h4>Name: {this.state.rname}</h4>
        <h4><label>
            Min Order Cost:
            <input type="text" pattern="[0-9]*" value={this.state.min_order_cost} onChange={(e) => this.handleChangeOrderCost(e)} />
          </label>
        <Button onClick={this.handleSubmitOrderCost}>Submit</Button></h4>
        <div>
        <h4>{"Message: " + this.state.message}</h4>
        <br/>
        </div>
        <form>
        <h3>Edit Food Item</h3>
        <div>
          <label>
            ID:
            <input type="text" pattern="[0-9]*" value={this.state.edit.fid} onChange={(e) => this.handleChange(e, 'id')} />
          </label>
          </div>
          <div>
          <label>
            Name:
            <input type="text" value={this.state.edit.fname} onChange={(e) => this.handleChange(e, 'fname')} />
          </label>
          </div>
          <div>
          <label>
            Description:
            <input type="text" value={this.state.edit.fdesc} onChange={(e) => this.handleChange(e, 'fdesc')} />
          </label>
          </div>
          <div>
          <label>
            Category:
            <input type="text" value={this.state.edit.catname} onChange={(e) => this.handleChange(e, 'catname')} />
          </label>
          </div>
          <div>
          <label>
            Food Limit:
            <input type="text" pattern="[0-9]*" value={this.state.edit.food_limit} onChange={(e) => this.handleChange(e, 'food_limit')} />
          </label>
          </div>
          <div>
          <label>
            Price:
            <input type="text" pattern="[0-9]*" value={this.state.edit.price} onChange={(e) => this.handleChange(e, 'price')} />
          </label>
          </div>
        </form>
        <Button onClick={this.handleSubmit}>Submit</Button>
        <Table id="tableID">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Description</th>
          <th>Category</th>
          <th>Category Description</th>
          <th>Food Limit</th>
          <th>Number Left</th>
          <th>Price</th>
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

export default RestaurantMenu;
