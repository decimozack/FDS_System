import React from "react";
// import Alert from "@material-ui/lab/Alert";
// import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
// import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
// import FormControlLabel from "@material-ui/core/FormControlLabel";
// import Checkbox from "@material-ui/core/Checkbox";
// import Link from "@material-ui/core/Link";
// import Grid from "@material-ui/core/Grid";
// import Box from "@material-ui/core/Box";
// import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
// import Typography from "@material-ui/core/Typography";
// import { makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import MaterialTable from "material-table";
import Container from "@material-ui/core/Container";
import { withStyles } from "@material-ui/core/styles";
import CustomerDataService from "../../services/customer.service";
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
});

class ViewRestaurant extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      restaurantId: this.props.match.params.id,
      restaurant: null,
      foodItems: [],
      open: false,
      selectedFoodItem: null,
    };

    this.retrieveRestaurant = this.retrieveRestaurant.bind(this);
    this.retrieveFoodItems = this.retrieveFoodItems.bind(this);
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  componentDidMount() {
    this.retrieveRestaurant(this.state.restaurantId);
    this.retrieveFoodItems(this.state.restaurantId);
  }

  retrieveRestaurant(id) {
    CustomerDataService.getRestaurant(id)
      .then((response) => {
        console.log(response.data);
        this.setState({ restaurant: response.data.rows[0] });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  retrieveFoodItems(id) {
    CustomerDataService.getFoodItems(id)
      .then((response) => {
        console.log(response.data);
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
    this.setState({ open: false });
  };

  render() {
    const { classes } = this.props;
    return (
      <Container>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To subscribe to this website, please enter your email address
              here. We will send updates occasionally.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Email Address"
              type="email"
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleClose} color="primary">
              Subscribe
            </Button>
          </DialogActions>
        </Dialog>
        <div className={classes.table}>
          <MaterialTable
            title={
              this.state.restaurant !== null &&
              this.state.restaurant.rname + " Restaurant Listing"
            }
            columns={[
              {
                title: "Food Item Name",
                field: "fname",
                width: 100,
              },
              {
                title: "Category",
                field: "catname",
                width: 50,
              },
              {
                title: "Description",
                field: "description",
                width: 130,
              },
              {
                title: "Price",
                field: "price",
                type: "currency",
                width: 100,
                cellStyle: { textAlign: "left" },
              },
            ]}
            data={this.state.foodItems}
            actions={[
              {
                icon: "add_shopping_cart",
                tooltip: "Add To Cart",
                onClick: (event, rowData) => {
                  this.setState({ selectedFoodItem: rowsData });
                  this.handleClickOpen();
                },
              },
            ]}
            options={{
              actionsColumnIndex: -1,
              headerStyle: {
                backgroundColor: "#01579b",
                color: "#FFF",
              },
            }}
            localization={{
              header: {
                actions: "Add to Cart",
              },
            }}
          />
        </div>
      </Container>
    );
  }
}

export default withStyles(useStyles)(ViewRestaurant);
