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
import Paper from "@material-ui/core/Paper";
import ButtonBase from "@material-ui/core/ButtonBase";
import Box from "@material-ui/core/Box";
import auth from "../../auth";
import Alert from "@material-ui/lab/Alert";
import Avatar from "@material-ui/core/Avatar";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import ManagerDataService from "../../services/manager.service";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";

const useStyles = (theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    margin: "auto",
    maxWidth: 500,
  },
  image: {
    width: 128,
    height: 128,
  },
  img: {
    margin: "auto",
    display: "block",
    maxWidth: "100%",
    maxHeight: "100%",
  },
  spacing2: {
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(2),
  },
  spacing3: {
    marginTop: theme.spacing(3),
  },
  spacing4: {
    marginTop: theme.spacing(1),
  },
  spacing5: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(2),
  },
  paper2: {
    marginTop: theme.spacing(2),
    marginRight: theme.spacing(10),
    display: "flex",
    flexDirection: "column",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 2, 2),
    width: 300,
  },
});

class Checkout extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      restaurant: this.props.location.state,
      orderItems: ShoppingCart.retrieveOrderItems(),
      use_credit_card: "false",
      use_points: "false",
      price: 0,
      delivery_fee: 5,
      address: "",
      location_area: "",
      gain_reward_pts: 0,
      errorMsg: "",
      successMsg: "",
      areaList: [],
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.createOrder = this.createOrder.bind(this);
    this.calTotalPrice = this.calTotalPrice.bind(this);
    this.calTotalPriceFormat = this.calTotalPriceFormat.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.retrieveAreas = this.retrieveAreas.bind(this);
    this.onValueChange = this.onValueChange.bind(this);
    this.calRewardPoints = this.calRewardPoints.bind(this);
    this.onCancel = this.onCancel.bind(this);
  }

  componentDidMount() {
    this.retrieveAreas();
  }

  createOrder() {
    const userData = auth.getUser();

    const data = {
      user: userData,
      restaurant: this.state.restaurant,
      orderItems: this.state.orderItems,
      use_credit_card: this.state.use_credit_card,
      use_points: this.state.use_points,
      price: this.calTotalPrice() + this.state.delivery_fee,
      delivery_fee: this.state.delivery_fee,
      address: this.state.address,
      location_area: this.state.location_area.area_name,
      gain_reward_pts: this.calRewardPoints(),
    };

    console.log(data);
    CustomerDataService.submitOrder(data)
      .then((response) => {
        console.log(response);
      })
      .catch((e) => {
        // console.log(e.response);
        console.log(e);
        if (e.response) {
          console.log(e.response.data);
        }
      });
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
  onValueChange(event, newValue) {
    this.setState({ location_area: newValue });
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  }

  onCancel(event) {
    this.props.history.push("/customer/restaurants");
  }

  handleSubmit(event) {
    event.preventDefault();

    this.setState({ errorMsg: "", successMsg: "" });
    this.createOrder();
  }

  calTotalPrice = () => {
    const totalPrice = this.state.orderItems.reduce((acc, orderItem) => {
      return acc + orderItem.price * orderItem.qty;
    }, 0);
    return totalPrice;
  };

  calRewardPoints = () => {
    const totalPrice = this.calTotalPrice() + this.state.delivery_fee;
    const rewardPts = Math.floor(totalPrice / 5);
    return rewardPts;
  };

  calTotalPriceFormat = () => {
    return "$" + formatMoney(this.calTotalPrice());
  };

  retrieveAreas() {
    ManagerDataService.retrieveLocationAreaList()
      .then((response) => {
        console.log(response.data.rows);
        this.setState({ areaList: response.data.rows });
      })
      .catch((e) => {
        console.log(e);
        this.setState({ areaList: [] });
      });
  }

  render() {
    const { classes } = this.props;
    return (
      <Grid container className={classes.spacing3}>
        <Grid item xs={8}>
          <div className={classes.paper2}>
            <Grid container direction="row">
              <Avatar className={classes.avatar}>
                <ShopCartIcon />
              </Avatar>
              <Typography
                component="h1"
                variant="h5"
                className={classes.spacing4}
              >
                Checkout
              </Typography>
            </Grid>
            {this.state.errorMsg.length > 0 && (
              <Alert severity="error">{this.state.errorMsg}</Alert>
            )}
            {this.state.successMsg.length > 0 && (
              <Alert severity="success">{this.state.successMsg}</Alert>
            )}
            <form
              className={classes.form}
              onSubmit={this.handleSubmit}
              noValidate
            >
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="address"
                label="Address"
                name="address"
                autoComplete="address"
                onChange={this.handleChange}
                autoFocus
                multiline
                rows={3}
              />
              <Autocomplete
                value={this.state.location_area}
                onChange={this.onValueChange}
                id="location_area"
                name="location_area"
                required
                fullWidth
                openOnFocus
                options={this.state.areaList}
                getOptionLabel={(option) => option.area_name}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Location Area"
                    variant="outlined"
                    margin="normal"
                  />
                )}
              />
              <Grid container direction="row" className={classes.spacing5}>
                <Grid item xs={6}>
                  <FormControl component="fieldset">
                    <FormLabel component="legend">Use Credit Card?</FormLabel>
                    <RadioGroup
                      aria-label="use_credit_card"
                      name="use_credit_card"
                      value={this.state.use_credit_card}
                      onChange={this.handleChange}
                    >
                      <FormControlLabel
                        value="true"
                        control={<Radio />}
                        label="Use Credit Card"
                      />
                      <FormControlLabel
                        value="false"
                        control={<Radio />}
                        label="Do Not Use Credit Card"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl component="fieldset">
                    <FormLabel component="legend">Use Points?</FormLabel>
                    <RadioGroup
                      aria-label="use_points"
                      name="use_points"
                      value={this.state.use_points}
                      onChange={this.handleChange}
                    >
                      <FormControlLabel
                        value="true"
                        control={<Radio />}
                        label="Use Points"
                      />
                      <FormControlLabel
                        value="false"
                        control={<Radio />}
                        label="Do Not Points"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>

              <Grid container direction="row">
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={this.onCancel}
                  className={classes.submit}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                >
                  Submit Order
                </Button>
              </Grid>
            </form>
          </div>
        </Grid>
        <Grid item xs={4} direction="column">
          <Paper className={classes.paper}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm container>
                <Typography variant="h5">Ordered Items</Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} sm container>
                <Typography>
                  Restaurant: <b>{this.state.restaurant.rname}</b>
                </Typography>
              </Grid>
            </Grid>
            {this.state.orderItems.map((orderItem) => (
              <React.Fragment>
                <Box className={classes.spacing3}></Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm container>
                    <Grid item xs container direction="column" spacing={2}>
                      <Grid item xs>
                        <Typography gutterBottom variant="subtitle1">
                          {orderItem.fname}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          Price : ${formatMoney(orderItem.price)}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Quantity: {orderItem.qty}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Notes:
                          <br /> {orderItem.notes}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid item>
                      <Typography variant="subtitle1">
                        ${formatMoney(orderItem.price * orderItem.qty)}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </React.Fragment>
            ))}
            <Box borderTop={1} className={classes.spacing2}></Box>
            <Grid container spacing={2}>
              <Grid item xs={12} sm container>
                <Grid item xs container direction="column" spacing={2}>
                  <Grid item xs>
                    <Typography gutterBottom variant="subtitle1">
                      Total Price
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      Food Cost : {this.calTotalPriceFormat()}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Delivery Fee: ${formatMoney(this.state.delivery_fee)}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item>
                  <Typography variant="subtitle1">
                    $
                    {formatMoney(
                      this.calTotalPrice() + this.state.delivery_fee
                    )}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(useStyles)(Checkout);
