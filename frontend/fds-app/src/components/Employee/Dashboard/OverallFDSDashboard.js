import React, { Fragment } from "react";
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
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { withStyles } from "@material-ui/core/styles";
import ManagerDataService from "../../../services/manager.service";
import auth from "../../../auth";
import DashboardCard from "./DashboardCard";

const styles = (theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
});

const months = [
  "January",
  "Feburary",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
class OverallFDSDashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedDate: new Date(),
      totalCustomer: 0,
      totalOrder: 0,
      totalOrderCost: 0,
    };

    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.retrieveMonthlySummary = this.retrieveMonthlySummary.bind(this);
  }

  componentDidMount() {
    const currDate = this.state.selectedDate;
    this.retrieveMonthlySummary(
      currDate.getFullYear(),
      currDate.getMonth() + 1
    );
  }

  handleDateChange(value) {
    this.setState({
      selectedDate: value,
    });
    this.retrieveMonthlySummary(value.getFullYear(), value.getMonth() + 1);
  }

  retrieveMonthlySummary(year, month) {
    ManagerDataService.getMonthlySummary(year, month)
      .then((response) => {
        console.log(response.data);
        const row = response.data.rows[0];
        this.setState({
          totalCustomer: row.customercount,
          totalOrder: row.ordercount,
          totalOrderCost: row.totalprice,
        });
      })
      .catch((e) => {
        console.log(e);
        this.setState({
          totalCustomer: 0,
          totalOrder: 0,
          totalOrderCost: 0,
        });
      });
  }

  handleSubmit(event) {
    event.preventDefault();
  }

  render() {
    const { classes } = this.props;

    const totalCustomerProp = [
      { label: "Total Customer", value: this.state.totalCustomer },
    ];

    const totalOrderProp = [
      { label: "Total Order", value: this.state.totalOrder },
      { label: "Total Order Cost", value: this.state.totalOrderCost },
    ];

    return (
      <div className={classes.root}>
        <Grid container spacing={4}>
          <Grid item xs={12} style={{ "margin-top": 50 }}>
            <Typography variant="h4" color="textSecondary" align="left">
              FDS Overall Summary Dashboard
            </Typography>
            <Typography variant="h5" color="textSecondary" align="left">
              {months[this.state.selectedDate.getMonth()]}&nbsp;
              {this.state.selectedDate.getFullYear()}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <DatePicker
                views={["year", "month"]}
                label="Select a valid Year and Month"
                helperText="Select the month that you are interested in"
                minDate={new Date("1990-01-01")}
                maxDate={new Date()}
                value={this.state.selectedDate}
                onChange={this.handleDateChange}
                style={{ width: 500 }}
              />
            </MuiPickersUtilsProvider>
          </Grid>
          <Grid item xs={6}>
            <DashboardCard
              valueTitle="Customer Summary"
              valueDisplay={totalCustomerProp}
              iconType="people"
            />
          </Grid>
          <Grid item xs={6}>
            <DashboardCard
              valueTitle="Order Summary"
              valueDisplay={totalOrderProp}
              iconType="order"
            />
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(OverallFDSDashboard);
