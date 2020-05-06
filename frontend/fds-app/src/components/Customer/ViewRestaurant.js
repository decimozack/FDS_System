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
import Box from "@material-ui/core/Box";

const useStyles = (theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  paper2: {
    padding: theme.spacing(2),
    marginLeft: theme.spacing(1),
    maxWidth: 500,
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
  spacing: {
    marginTop: theme.spacing(3),
  },
  spacing2: {
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(2),
  },
});

class ViewRestaurant extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      restaurantId: this.props.match.params.id,
      restaurant: null,
      reviews: [],
      foodItems: [],
      open: false,
      selectedFoodItem: null,
    };

    this.retrieveRestaurant = this.retrieveRestaurant.bind(this);
    this.retrieveFoodItems = this.retrieveFoodItems.bind(this);
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.rowOnClick = this.rowOnClick.bind(this);
    this.processCheckout = this.processCheckout.bind(this);
    this.retrieveReview = this.retrieveReview.bind(this);
  }

  componentDidMount() {
    this.retrieveRestaurant(this.state.restaurantId);
    this.retrieveFoodItems(this.state.restaurantId);
    this.retrieveReview(this.state.restaurantId);
  }

  retrieveRestaurant(id) {
    CustomerDataService.getRestaurant(id)
      .then((response) => {
        this.setState({ restaurant: response.data.rows[0] });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  retrieveReview(id) {
    CustomerDataService.getRestaurantReview(id)
      .then((response) => {
        console.log(response.data);
        this.setState({ reviews: response.data });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  retrieveFoodItems(id) {
    CustomerDataService.getFoodItems(id)
      .then((response) => {
        this.setState({ foodItems: response.data.rows });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false, selectedFoodItem: null });
  };

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  }

  handleSubmit(event, qty, notes) {
    event.preventDefault();

    const orderItem = {
      qty: qty,
      notes: notes,
      ...this.state.selectedFoodItem,
    };

    ShoppingCart.addOrderItem(orderItem);

    // const orderItems = ShoppingCart.retrieveOrderItems();
    // console.log(orderItems);
    this.handleClose();
  }

  rowOnClick = (event, rowData) => {
    this.setState({ selectedFoodItem: rowData });
    this.handleClickOpen();
  };

  processCheckout = (event) => {
    this.props.history.push("/customer/checkout", this.state.restaurant);
  };

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
          <Button
            variant="contained"
            color="secondary"
            className={classes.button}
            endIcon={<ShopCartIcon />}
            onClick={this.processCheckout}
          >
            Checkout
          </Button>
        </Grid>
        <Grid container xs={12}>
          <AddCartDialog
            selectedFoodItem={this.state.selectedFoodItem}
            open={this.state.open}
            onSubmit={this.handleSubmit}
            onClose={this.handleClose}
          />
          <FoodItemTable
            restaurant={this.state.restaurant}
            foodItems={this.state.foodItems}
            onClick={this.rowOnClick}
          />
        </Grid>

        <Grid container className={classes.spacing} direction="column">
          <Grid item>
            <Paper className={classes.paper2}>
              <Typography variant="h5">Restaurant Review</Typography>
              {this.state.reviews &&
                this.state.reviews.map((review, index) => (
                  <React.Fragment>
                    <Box borderTop={1} className={classes.spacing2}></Box>

                    <Typography>
                      Review {index + 1 + " - "}
                      {review.description}
                    </Typography>
                  </React.Fragment>
                ))}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    );
  }
}

export default withStyles(useStyles)(ViewRestaurant);
