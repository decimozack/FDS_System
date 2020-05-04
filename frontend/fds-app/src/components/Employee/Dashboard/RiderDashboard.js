import React, { Fragment } from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import ManagerDataService from "../../../services/manager.service";
import DashboardCard from "./DashboardCard";
import formatMoney from "../../../utils/FormatCurrency";

const styles = (theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    width: 200,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  paper: {
    marginTop: theme.spacing(3),
    display: "flex",
    flexDirection: "column",
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

class RiderDashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedDate: new Date(),
      totalDeliveryOrder: 0,
      totalHours: 0,
      totalSalarys: 0,
      avgDeliveryTime: 0,
      ratingCount: 0,
      avgrating: 0,
      riderList: [],
      value: null,
      showResult: false,
    };

    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.retrieveRiderSummary = this.retrieveRiderSummary.bind(this);
    this.onValueChange = this.onValueChange.bind(this);
    this.retrieveRiders = this.retrieveRiders.bind(this);
  }

  componentDidMount() {
    this.retrieveRiders();
  }

  onValueChange(event, newValue) {
    this.setState({ value: newValue, showResult: false });
  }

  handleDateChange(value) {
    this.setState({
      selectedDate: value,
      showResult: false,
    });
  }

  retrieveRiders() {
    ManagerDataService.retrieveRiderList()
      .then((response) => {
        console.log(response.data.rows);
        this.setState({ riderList: response.data.rows });
      })
      .catch((e) => {
        console.log(e);
        this.setState({ riderList: [] });
      });
  }

  retrieveRiderSummary(year, month, emp_id) {
    ManagerDataService.getRiderSummary(year, month, emp_id)
      .then((response) => {
        console.log(response);
        const row = response.data.rows[0];
        this.setState({
          totalDeliveryOrder: row.deliveryordercount,
          totalHours: row.totalhours,
          totalSalarys: row.totalsalarys,
          avgDeliveryTime: row.avgdeliverytime,
          ratingCount: row.ratingcount,
          avgrating: row.avgrating,
          showResult: true,
        });
      })
      .catch((e) => {
        console.log(e);
        this.setState({
          totalDeliveryOrder: 0,
          totalHours: 0,
          totalSalarys: 0,
          avgDeliveryTime: 0,
          ratingCount: 0,
          avgrating: 0,
          showResult: true,
        });
      });
  }

  handleSubmit(event) {
    event.preventDefault();
    const currDate = this.state.selectedDate;
    if (this.state.value === null) {
      return;
    }
    this.retrieveRiderSummary(
      currDate.getFullYear(),
      currDate.getMonth() + 1,
      this.state.value.empid
    );
  }

  render() {
    const { classes } = this.props;

    const orderProp = [
      { label: "Orders Delivered", value: this.state.totalDeliveryOrder },
    ];

    const salaryProp = [
      {
        label: "Total Worked Hours",
        value: this.state.totalHours + " hrs",
      },
      {
        label: "Total Salary",
        value: "$" + formatMoney(this.state.totalSalarys),
      },
    ];

    const deliveryProp = [
      {
        label: "Average Delivery Time",
        value: this.state.avgDeliveryTime + " hrs",
      },
    ];

    const ratingProp = [
      {
        label: "Total Number of Rating",
        value: this.state.ratingCount,
      },
      {
        label: "Avg Rating",
        value: this.state.avgrating,
      },
    ];

    return (
      <div className={classes.root}>
        <Grid container spacing={4}>
          <Grid item xs={12} style={{ "margin-top": 50 }}>
            <Typography variant="h4" color="textSecondary" align="left">
              Rider Dashboard
            </Typography>
            <Typography variant="h5" color="textSecondary" align="left">
              {months[this.state.selectedDate.getMonth()]}&nbsp;
              {this.state.selectedDate.getFullYear()}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <form
              className={classes.form}
              onSubmit={this.handleSubmit}
              noValidate
            >
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
                <Autocomplete
                  value={this.state.value}
                  onChange={this.onValueChange}
                  className={classes.paper}
                  id="rider-id"
                  openOnFocus
                  options={this.state.riderList}
                  getOptionLabel={(option) =>
                    option.empid +
                    " - " +
                    option.emp_first_name +
                    " " +
                    option.emp_last_name +
                    " (" +
                    option.email +
                    ")"
                  }
                  style={{ width: 500 }}
                  renderInput={(params) => (
                    <TextField {...params} label="Rider" variant="outlined" />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                >
                  Search
                </Button>
              </Grid>
            </form>
          </Grid>
          {this.state.value !== null && this.state.showResult !== false && (
            <React.Fragment>
              <Grid item xs={12}>
                <Typography variant="h5" color="textSecondary" align="left">
                  {this.state.value.emp_first_name +
                    " " +
                    this.state.value.emp_last_name}{" "}
                  {months[this.state.selectedDate.getMonth()]}&nbsp;
                  {this.state.selectedDate.getFullYear()}&nbsp;Summary
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <DashboardCard
                  valueTitle="Orders"
                  valueDisplay={orderProp}
                  iconType="order"
                />
              </Grid>
              <Grid item xs={6}>
                <DashboardCard
                  valueTitle="Salary"
                  valueDisplay={salaryProp}
                  iconType="cost"
                />
              </Grid>
              <Grid item xs={6}>
                <DashboardCard
                  valueTitle="Delivery Time"
                  valueDisplay={deliveryProp}
                  iconType="time"
                />
              </Grid>
              <Grid item xs={6}>
                <DashboardCard
                  valueTitle="Rating"
                  valueDisplay={ratingProp}
                  iconType="rating"
                />
              </Grid>
            </React.Fragment>
          )}
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(RiderDashboard);
