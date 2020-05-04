import React from "react";
import Alert from "@material-ui/lab/Alert";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import LocalAtmIcon from "@material-ui/icons/LocalAtm";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import { withStyles } from "@material-ui/core/styles";
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import ManagerDataService from "../../services/manager.service";
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
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
});

class AddPromo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      startTime: new Date(),
      endTime: new Date(),
      minSpend: 0,
      maxSpend: 0,
      discount: 0,
      errorMsg: "",
      successMsg: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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

  handleDateChange(value) {
    this.setState({
      startTime: value,
    });
  }

  handleEndDateChange(value) {
    this.setState({
      endTime: value,
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    ManagerDataService.addFDSDiscountPromo(
      this.state.startTime,
      this.state.endTime,
      this.state.minSpend,
      this.state.maxSpend,
      this.state.discount
    )
      .then((response) => {
        this.props.history.push("/promos/", { successMsg: "promo created" });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  render() {
    const { classes } = this.props;
    return (
      <Container component="main" maxWidth="xs">
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LocalAtmIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Create Discount Promo
          </Typography>
          {this.state.errorMsg.length > 0 && (
            <Alert severity="error">{this.state.errorMsg}</Alert>
          )}
          {this.state.successMsg.length > 0 && (
            <Alert severity="success">{this.state.successMsg}</Alert>
          )}
          <form className={classes.form} onSubmit={this.handleSubmit}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <DateTimePicker
                label="Select Start Date"
                helperText="Start Date"
                minDate={new Date()}
                value={this.state.startTime}
                onChange={this.handleDateChange}
                format="dd/MM/yyyy"
                name="startTime"
                fullWidth
                margin="normal"
              />
            </MuiPickersUtilsProvider>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <DateTimePicker
                label="Select End Date"
                helperText="End Date"
                minDate={new Date()}
                value={this.state.endTime}
                onChange={this.handleEndDateChange}
                format="dd/MM/yyyy"
                name="endTime"
                fullWidth
                margin="normal"
              />
            </MuiPickersUtilsProvider>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="minSpend"
              label="Min Spending"
              name="minSpend"
              type="number"
              value={this.state.minSpend}
              onChange={this.handleChange}
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="maxSpend"
              label="Max Spending"
              name="maxSpend"
              type="number"
              value={this.state.maxSpend}
              onChange={this.handleChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="discount"
              label="Discount"
              name="discount"
              type="number"
              value={this.state.discount}
              onChange={this.handleChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Add Promo
            </Button>
          </form>
        </div>
      </Container>
    );
  }
}

export default withStyles(useStyles)(AddPromo);
