import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import MaterialTable from "material-table";
import Container from "@material-ui/core/Container";
import { withStyles } from "@material-ui/core/styles";
import formatMoney from "../../utils/FormatCurrency";

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
      qty: 0,
      notes: "",
    };

    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {}

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  }

  onSubmit = (event) => {
    this.props.onSubmit(event, parseInt(this.state.qty), this.state.notes);
    this.setState({ qty: 0, notes: "" });
  };

  render() {
    const { classes } = this.props;
    return (
      <Container>
        {this.props.selectedFoodItem !== null && (
          <Dialog
            open={this.props.open}
            onClose={this.props.onClose}
            aria-labelledby="form-dialog-title"
          >
            <form onSubmit={this.onSubmit}>
              <DialogTitle id="form-dialog-title">
                {this.props.selectedFoodItem.fname} - $
                {formatMoney(this.props.selectedFoodItem.price)}
              </DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Please enter the amount of quantity you want and also list
                  down any notes to restaurant.
                </DialogContentText>
                <DialogContentText>
                  <b>Total Price</b> -{" $"}
                  {formatMoney(
                    this.props.selectedFoodItem.price * this.state.qty
                  )}
                </DialogContentText>
                <TextField
                  autoFocus
                  required
                  margin="dense"
                  id="qty"
                  name="qty"
                  autoComplete="qty"
                  label="Quantity"
                  type="number"
                  value={this.state.qty}
                  onChange={this.handleChange}
                  fullWidth
                />
                <TextField
                  margin="dense"
                  id="notes"
                  name="notes"
                  autoComplete="notes"
                  label="Notes to Restaurant"
                  value={this.state.notes}
                  onChange={this.handleChange}
                  fullWidth
                  multiline
                  rows={5}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={this.props.onClose} color="secondary">
                  Cancel
                </Button>
                <Button type="submit" color="primary">
                  Add To Cart
                </Button>
              </DialogActions>
            </form>
          </Dialog>
        )}
      </Container>
    );
  }
}

export default withStyles(useStyles)(ViewRestaurant);
