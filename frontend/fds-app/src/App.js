import React, { Component } from "react";
import "./App.css";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import Home from "./components/Home";
import About from "./components/About";
import Contact from "./components/Contact";
import SignIn from "./components/Signin";
import Header from "./components/Header";
import CustomerSignUp from "./components/Customer/Signup";
import UpdateCustomer from "./components/Customer/UpdateCustomer";
import UpdateEmployee from "./components/Employee/UpdateEmployee";
import EmployeeSignUp from "./components/Employee/Signup";
import { ProtectedRoute } from "./protected.route";
import { CustomerProtectedRoute } from "./customer_protected.route";
import { ManagerProtectedRoute } from "./manager_protected.route";
import { RiderProtectedRoute } from "./rider_protected.route";
import OverallFDSDashboard from "./components/Employee/Dashboard/OverallFDSDashboard";
import CustomerOrderDashboard from "./components/Employee/Dashboard/CustomerOrderDashboard";
import auth from "./auth";
import WorkSchedule from "./components/Riders/workshift.js";
import WorkHistory from "./components/Riders/workhistory.js";
import WorkDetails from "./components/Riders/workdetails.js";
import RiderSalary from "./components/Riders/salary.js";
import RiderRatings from "./components/Riders/ratings.js";

const useStyles = makeStyles((theme) => ({
  mainGrid: {
    marginTop: theme.spacing(3),
  },
}));

const sections = [
  { title: "Home", url: "/" },
  { title: "Update Info", url: "/updateCustomer" },
  { title: "About", url: "/about" },
];

const managerSections = [
  { title: "Sign Up", url: "/empsignup" },
  { title: "Update Info", url: "/updateEmployee" },
  { title: "Customer Management", url: "/contact" },
  { title: "Employee Management", url: "/about" },
  { title: "Restaurant Management", url: "/about" },
  { title: "Overall FDS Dashboard", url: "/dashboard/fds" },
  {
    title: "Customer Order Summary Dashboard",
    url: "/dashboard/customerorder",
  },
  { title: "Delivery Location Summary Dashboard", url: "/about" },
  { title: "Rider Summary Dashboard", url: "/about" },
];

const riderSections = [
  { title: "Work Schedule", url: "/riders/workschedule" },
  { title: "Work Details", url: "/riders/workdetails" },
  { title: "Work History", url: "/riders/workhistory" },
  { title: "Salary", url: "/riders/salary" },
  { title: "Ratings", url: "/riders/ratings" },
  { title: "Update Info", url: "/updateEmployee" },
];

class App extends Component {
  constructor(props) {
    super(props);
    let isLogin = auth.isAuthenticated();
    this.state = { isLogin: isLogin };
  }

  handleIsLoginValue = () => {
    let isLogin = auth.isAuthenticated();
    this.setState({ isLogin: isLogin });
  };

  render() {
    const routing = (
      <React.Fragment>
        <CssBaseline />
        <Container maxWidth="lg">
          <Header
            title="FDS System"
            sections={sections}
            managerSections={managerSections}
            riderSections={riderSections}
            onIsLoginValue={this.handleIsLoginValue}
            isLogin={this.state.isLogin}
          />
          <main>
            <BrowserRouter>
              <div>
                <Switch>
                  <Route exact path="/" component={Home} />
                  <ProtectedRoute path="/about" component={About} />
                  <CustomerProtectedRoute
                    path="/updateCustomer"
                    component={UpdateCustomer}
                  />
                  <Route path="/contact" component={Contact} />
                  <Route
                    path="/signup"
                    render={(routeProps) => (
                      <CustomerSignUp
                        {...routeProps}
                        isLogin={this.state.isLogin}
                      />
                    )}
                  />
                  <Route
                    path="/empsignup"
                    render={(routeProps) => (
                      <EmployeeSignUp
                        {...routeProps}
                        isLogin={this.state.isLogin}
                      />
                    )}
                  />
                  <Route
                    path="/updateEmployee"
                    render={(routeProps) => (
                      <UpdateEmployee
                        {...routeProps}
                        isLogin={this.state.isLogin}
                      />
                    )}
                  />
                  <ManagerProtectedRoute
                    path="/dashboard/fds"
                    component={OverallFDSDashboard}
                  />
                  <ManagerProtectedRoute
                    path="/dashboard/customerorder"
                    component={CustomerOrderDashboard}
                  />
                  <RiderProtectedRoute
                    path="/riders/workschedule"
                    component={WorkSchedule}
                  />
                  <RiderProtectedRoute
                    path="/riders/workhistory"
                    component={WorkHistory}
                  />
                  <RiderProtectedRoute
                    path="/riders/workdetails"
                    component={WorkDetails}
                  />
                  <RiderProtectedRoute
                    path="/riders/salary"
                    component={RiderSalary}
                  />
                  <RiderProtectedRoute
                    path="/riders/ratings"
                    component={RiderRatings}
                  />
                  <Route
                    path="/signin"
                    render={(routeProps) => (
                      <SignIn
                        {...routeProps}
                        onIsLoginValue={this.handleIsLoginValue}
                        isLogin={this.state.isLogin}
                      />
                    )}
                  />
                  <Route
                    path="*"
                    component={() => <h1 align="center">404 Not Found</h1>}
                  />
                </Switch>
              </div>
            </BrowserRouter>
          </main>
        </Container>
      </React.Fragment>
    );

    return routing;
  }
}

export default App;
