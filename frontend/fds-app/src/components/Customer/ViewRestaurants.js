import React from "react";
// import Alert from "@material-ui/lab/Alert";
// import Avatar from "@material-ui/core/Avatar";
// import Button from "@material-ui/core/Button";
// import CssBaseline from "@material-ui/core/CssBaseline";
// import TextField from "@material-ui/core/TextField";
// import FormControlLabel from "@material-ui/core/FormControlLabel";
// import Checkbox from "@material-ui/core/Checkbox";
// import Link from "@material-ui/core/Link";
// import Grid from "@material-ui/core/Grid";
// import Box from "@material-ui/core/Box";
// import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
// import Typography from "@material-ui/core/Typography";
// import { makeStyles } from "@material-ui/core/styles";
import Alert from "@material-ui/lab/Alert";
import MaterialTable from "material-table";
import Container from "@material-ui/core/Container";
import { withStyles } from "@material-ui/core/styles";
import CustomerDataService from "../../services/customer.service";
import auth from "../../auth";
import ShoppingCart from "../../utils/shoppingCart";
import shoppingCart from "../../utils/shoppingCart";

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
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  spacing: {
    marginTop: theme.spacing(3),
  },
});

class ViewRestaurants extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      restaurants: [],
      successMsg: this.props.location.state
        ? this.props.location.state.successMsg
        : "",
    };

    console.log(this.props.location.state);
    this.retrieveRestaurants = this.retrieveRestaurants.bind(this);
  }

  componentDidMount() {
    this.retrieveRestaurants();
  }

  retrieveRestaurants() {
    CustomerDataService.getRestaurants()
      .then((response) => {
        console.log(response.data);
        this.setState({ restaurants: response.data.rows });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  render() {
    const { classes } = this.props;
    return (
      <Container>
        {this.state.successMsg !== null && this.state.successMsg.length > 0 && (
          <Alert severity="success" className={classes.spacing}>
            {this.state.successMsg}
          </Alert>
        )}
        <div className={classes.table}>
          <MaterialTable
            title="Restaurant Listing"
            columns={[
              { title: "Restaurant Name", field: "rname" },
              {
                title: "Min Order Price",
                field: "minPrice",
                type: "currency",
                cellStyle: { textAlign: "left", fontSize: "8" },
              },
            ]}
            data={this.state.restaurants.map((restaurant) => {
              return {
                rname: restaurant.rname,
                minPrice: restaurant.min_order_cost,
                rid: restaurant.rid,
              };
            })}
            actions={[
              {
                icon: "arrow_forward_ios",
                tooltip: "View Restaurant",
                onClick: (event, rowData) => {
                  shoppingCart.deleteOrderItems();
                  this.props.history.push(
                    "/customer/restaurant/" + rowData.rid
                  );
                },
              },
            ]}
            options={{ actionsColumnIndex: -1 }}
            localization={{
              header: {
                actions: "",
              },
            }}
          />
        </div>
      </Container>
    );
  }
}

export default withStyles(useStyles)(ViewRestaurants);
