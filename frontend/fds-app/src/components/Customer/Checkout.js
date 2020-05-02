import React from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { default as ShopCartIcon } from "@material-ui/icons/ShoppingCart";
import Container from "@material-ui/core/Container";
import { withStyles } from "@material-ui/core/styles";
import CustomerDataService from "../../services/customer.service";
import formatMoney from "../../utils/FormatCurrency";
import ShoppingCart from "../../utils/shoppingCart";
import FoodItemTable from "./FoodItemTable";
import Link from "@material-ui/core/Link";
import AddCartDialog from "./AddCartDialog";
import { Typography } from "@material-ui/core";

import auth from "../../auth";

const useStyles = (theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  table: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(5),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  actions: {
    color: "blue",
  },
  button: {
    margin: theme.spacing(1),
    alignItems: "center",
  },
});

class Checkout extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      restaurant: this.props.location.state,
      orderItems: ShoppingCart.retrieveOrderItems(),
      use_credit_card: false,
      use_points: false,
      price: 0,
      delivery_fee: 0,
      address: "",
      location_area: "",
      gain_reward_pts: 0,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.createOrder = this.createOrder.bind(this);
  }

  componentDidMount() {}

  createOrder() {
    const userData = auth.getUser();

    const data = {
      user: userData,
      restaurant: this.state.restaurant,
      orderItems: this.state.orderItems,
      use_credit_card: this.state.use_credit_card,
      use_points: this.state.use_points,
      price: this.state.price,
      delivery_fee: this.state.delivery_fee,
      address: this.state.address,
      location_area: this.location_area,
      gain_reward_pts: this.gain_reward_pts,
    };

    CustomerDataService.submitOrder(data);
    // CustomerDataService.submitOrder(
    //   user,
    //   this.state.restaurant,
    //   this.state.orderItems,
    //   this.state.use_credit_card,
    //   this.state.use_points,
    //   this.state.price,
    //   this.state.delivery_fee,
    //   this.state.address,
    //   this.location_area,
    //   this.gain_reward_pts
    // );
  }

  handleSubmit(event) {
    event.preventDefault();
    this.createOrder();
  }

  render() {
    const { classes } = this.props;
    return (
      <Container>
        <Grid
          container
          xs={12}
          alignItems="flex-start"
          justify="flex-end"
          direction="row"
        >
          <Typography>{this.props.location.state.rname}</Typography>
        </Grid>
      </Container>
    );
  }
}

export default withStyles(useStyles)(Checkout);
