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

class CustomerOrderDashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedDate: new Date(),
      totalOrder: 0,
      totalOrderCost: 0,
      customerList: [],
      value: null,
      showResult: false,
    };

    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.retrieveCustomerOrderSummary = this.retrieveCustomerOrderSummary.bind(
      this
    );
    this.onValueChange = this.onValueChange.bind(this);
    this.retrieveCustomers = this.retrieveCustomers.bind(this);
  }

  componentDidMount() {
    const currDate = this.state.selectedDate;

    this.retrieveCustomers();
  }

  onValueChange(event, newValue) {
    console.log(newValue);
    this.setState({ value: newValue, showResult: false });
  }

  handleDateChange(value) {
    this.setState({
      selectedDate: value,
      showResult: false,
    });
  }

  retrieveCustomerOrderSummary(year, month, cid) {
    ManagerDataService.getCustomerOrderSummary(year, month, cid)
      .then((response) => {
        console.log(response);
        this.setState({
          totalOrder: response.data.rows[0].ordercount,
          totalOrderCost: response.data.rows[0].totalprice,
          showResult: true,
        });
      })
      .catch((e) => {
        console.log(e);
        this.setState({
          totalOrder: 0,
          totalOrderCost: 0,
          showResult: true,
        });
      });
  }

  retrieveCustomers() {
    ManagerDataService.retrieveCustomers()
      .then((response) => {
        console.log(response.data.rows);
        this.setState({ customerList: response.data.rows });
      })
      .catch((e) => {
        console.log(e);
        this.setState({ customerList: [] });
      });
  }

  handleSubmit(event) {
    event.preventDefault();
    const currDate = this.state.selectedDate;
    if (this.state.value === null) {
      return;
    }
    this.retrieveCustomerOrderSummary(
      currDate.getFullYear(),
      currDate.getMonth() + 1,
      this.state.value.cid
    );
  }

  render() {
    const { classes } = this.props;

    const totalOrderProp = [
      { label: "Customer Number of Orders", value: this.state.totalOrder },
    ];

    const totalSpendingProp = [
      {
        label: "Customer Total Spending",
        value: "$" + formatMoney(this.state.totalOrderCost),
      },
    ];

    return (
      <div className={classes.root}>
        <Grid container spacing={4}>
          <Grid item xs={12} style={{ "margin-top": 50 }}>
            <Typography variant="h4" color="textSecondary" align="left">
              Customer Order Summary Dashboard
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
                  id="customer-id"
                  openOnFocus
                  options={this.state.customerList}
                  getOptionLabel={(option) => option.email}
                  style={{ width: 500 }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Customer"
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
                  {this.state.value.c_first_name +
                    " " +
                    this.state.value.c_last_name}{" "}
                  {months[this.state.selectedDate.getMonth()]}&nbsp;
                  {this.state.selectedDate.getFullYear()}&nbsp;Summary
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <DashboardCard
                  valueTitle="Customer Orders"
                  valueDisplay={totalOrderProp}
                  iconType="order"
                />
              </Grid>
              <Grid item xs={6}>
                <DashboardCard
                  valueTitle="Customer Total Spending"
                  valueDisplay={totalSpendingProp}
                  iconType="cost"
                />
              </Grid>
            </React.Fragment>
          )}
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(CustomerOrderDashboard);
