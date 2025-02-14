import React, { Fragment } from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
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

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

class DeliveryLocationDashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedDate: new Date(),
      totalOrder: 0,
      areaList: [],
      value: null,
      showResult: false,
    };

    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.retrieveDeliveryLocationSummary = this.retrieveDeliveryLocationSummary.bind(
      this
    );
    this.onValueChange = this.onValueChange.bind(this);
    this.retrieveAreas = this.retrieveAreas.bind(this);
  }

  componentDidMount() {
    const currDate = this.state.selectedDate;

    this.retrieveAreas();
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

  // the day here is the date. eg 20 May 2020, 20 is the day
  retrieveDeliveryLocationSummary(year, month, day, hour, area) {
    ManagerDataService.getDeliveryLocationSummary(year, month, day, hour, area)
      .then((response) => {
        console.log(response);

        this.setState({
          totalOrder: response.data.rows[0].ordercount,
          showResult: true,
        });
      })
      .catch((e) => {
        console.log(e);
        this.setState({
          totalOrder: 0,
          showResult: true,
        });
      });
  }

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

  handleSubmit(event) {
    event.preventDefault();
    const currDate = this.state.selectedDate;
    if (this.state.value === null) {
      return;
    }
    this.retrieveDeliveryLocationSummary(
      currDate.getFullYear(),
      currDate.getMonth() + 1,
      currDate.getDate(),
      currDate.getHours(),
      this.state.value.area_name
    );
  }

  render() {
    const { classes } = this.props;

    const totalOrderProp = [
      { label: "Number of Orders in Location", value: this.state.totalOrder },
    ];

    return (
      <div className={classes.root}>
        <Grid container spacing={4}>
          <Grid item xs={12} style={{ "margin-top": 50 }}>
            <Typography variant="h4" color="textSecondary" align="left">
              Delivery Location Summary Dashboard
            </Typography>
            <Typography variant="h5" color="textSecondary" align="left">
              {days[this.state.selectedDate.getDay()]},&nbsp;
              {this.state.selectedDate.getDate()}&nbsp;
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
                  <DateTimePicker
                    label="Select Time Period"
                    helperText="Select the time period that you are interested in. eg, if you are interest in the time period of 05 May 2020, 15:00 - 16:00, choose any time between 15:00-15:59"
                    minDate={new Date("1990-01-01")}
                    maxDate={new Date()}
                    value={this.state.selectedDate}
                    onChange={this.handleDateChange}
                    style={{ width: 500 }}
                    showTodayButton
                  />
                </MuiPickersUtilsProvider>
              </Grid>
              <Grid item xs={6}>
                <Autocomplete
                  value={this.state.value}
                  onChange={this.onValueChange}
                  className={classes.paper}
                  id="area-id"
                  openOnFocus
                  options={this.state.areaList}
                  getOptionLabel={(option) => option.area_name}
                  style={{ width: 500 }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Location Area"
                      variant="outlined"
                    />
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
                  Delivery Location Summary
                </Typography>
                <Typography color="textSecondary" align="left">
                  {this.state.value.area_name}
                  <br />
                  {days[this.state.selectedDate.getDay()]},&nbsp;
                  {this.state.selectedDate.getDate()}&nbsp;
                  {months[this.state.selectedDate.getMonth()]}&nbsp;
                  {this.state.selectedDate.getFullYear()}
                  <br />
                  {this.state.selectedDate.getHours() +
                    ":00 - " +
                    (this.state.selectedDate.getHours() + 1) +
                    ":00"}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <DashboardCard
                  valueTitle="Orders"
                  valueDisplay={totalOrderProp}
                  iconType="order"
                />
              </Grid>
              <Grid item xs={6}></Grid>
            </React.Fragment>
          )}
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(DeliveryLocationDashboard);
