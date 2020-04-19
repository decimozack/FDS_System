import React from "react";
import Alert from "@material-ui/lab/Alert";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import MenuItem from "@material-ui/core/MenuItem";
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

const workRoles = [
  {
    value: "Rider",
    label: "Rider",
  },
  {
    value: "Manager",
    label: "Manager",
  },
];

const isPartTimes = [
  {
    value: false,
    label: "Full-Time",
  },
  {
    value: true,
    label: "Part-Time",
  },
];

class UpdateEmployee extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      workRole: "",
      isPartTime: false,
      errorMsg: "",
      successMsg: "",
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.retrieveEmployee = this.retrieveEmployee.bind(this);

    const user = auth.getUser();

    if (!this.props.isLogin) {
      this.props.history.push("/signin");
    } else if (user.usertype !== "ri" && user.usertype !== "m") {
      this.props.history.push("/");
    }
  }

  retrieveEmployee() {
    const user = auth.getUser();
    if (user.usertype === "ri") {
      this.setState({ workRole: "Rider" });
    } else {
      this.setState({ workRole: "Manager" });
    }
    ManagerDataService.retrieveEmployee(user.userid, user.usertype)
      .then((response) => {
        console.log(response.data.rows[0]);
        this.setState({
          email: response.data.rows[0].email,
          password: response.data.rows[0].emppassword,
          firstName: response.data.rows[0].emp_first_name,
          lastName: response.data.rows[0].emp_last_name,
          isPartTime: response.data.rows[0].isparttime,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  componentDidMount() {
    this.retrieveEmployee();
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
    userObj.empid = auth.getUser().userid;
    ManagerDataService.updateEmployee(userObj)
      .then((response) => {
        console.log(response);
        this.setState({ successMsg: "Information updated" });
        this.retrieveEmployee();
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
            Update Information
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
            {this.state.workRole === "Rider" && (
              <TextField
                id="isPartTime"
                select
                fullWidth
                label="Select"
                value={this.state.isPartTime}
                onChange={this.handleChange}
                helperText="Please select your emptype"
                name="isPartTime"
              >
                {isPartTimes.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            )}
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
              value={this.state.firstName}
              label="First Name"
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
              value={this.state.lastName}
              label="Last Name"
              id="lastName"
              onChange={this.handleChange}
              autoComplete="lastName"
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              value={this.state.password}
              label="Password"
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

export default withStyles(useStyles)(UpdateEmployee);
