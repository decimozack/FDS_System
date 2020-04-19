import React from "react";
import Alert from "@material-ui/lab/Alert";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { withStyles } from "@material-ui/core/styles";
import ManagerDataService from "../../services/manager.service";
import auth from "../../auth";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        FDS System
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

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

class UpdateCustomer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      creditCardInfo: "",
      errorMsg: "",
      successMsg: "",
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.retrieveCustomer = this.retrieveCustomer.bind(this);
  }

  retrieveCustomer() {
    const user = auth.getUser();
    ManagerDataService.retrieveCustomer(user.userid)
      .then((response) => {
        // console.log(response.data.rows);
        console.log(response.data.rows[0]);
        this.setState({
          email: response.data.rows[0].email.trim(),
          password: response.data.rows[0].cpassword.trim(),
          firstName: response.data.rows[0].c_first_name.trim(),
          lastName: response.data.rows[0].c_last_name.trim(),
          creditCardInfo: response.data.rows[0].credit_card_info.trim(),
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  componentDidMount() {
    this.retrieveCustomer();
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    const userObj = Object.keys(this.state).reduce((object, key) => {
      if (key !== "errorMsg") {
        object[key] = this.state[key];
      }
      return object;
    }, {});
    userObj.cid = auth.getUser().userid;
    ManagerDataService.updateCustomer(userObj)
      .then((response) => {
        console.log(response);
        this.setState({ successMsg: "Customer updated" });
        this.retrieveCustomer();
      })
      .catch((e) => {
        console.log(e);
        this.setState({ errorMsg: "Please try again" });
      });
  }

  render() {
    const { classes } = this.props;
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Update Info
          </Typography>
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
              id="email"
              label="Email Address"
              name="email"
              value={this.state.email}
              autoComplete="email"
              onChange={this.handleChange}
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="firstName"
              label="First Name"
              value={this.state.firstName}
              id="firstName"
              onChange={this.handleChange}
              autoComplete="firstName"
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="lastName"
              label="Last Name"
              value={this.state.lastName}
              id="lastName"
              onChange={this.handleChange}
              autoComplete="lastName"
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="creditCardInfo"
              label="Credit Card Info"
              value={this.state.creditCardInfo}
              id="creditCardInfo"
              onChange={this.handleChange}
              autoComplete="creditCardInfo"
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              value={this.state.password}
              type="password"
              id="password"
              onChange={this.handleChange}
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Update Info
            </Button>
          </form>
        </div>
        <Box mt={8}>
          <Copyright />
        </Box>
      </Container>
    );
  }
}

export default withStyles(useStyles)(UpdateCustomer);
