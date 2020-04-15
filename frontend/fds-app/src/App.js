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
import EmployeeSignUp from "./components/Employee/Signup";
import { ProtectedRoute } from "./protected.route";
import auth from "./auth";

const useStyles = makeStyles((theme) => ({
  mainGrid: {
    marginTop: theme.spacing(3),
  },
}));

const sections = [
  { title: "Home", url: "/" },
  { title: "Contact", url: "/contact" },
  { title: "About", url: "/about" },
];

const managerSections = [
  { title: "Sign Up", url: "/empsignup" },
  { title: "Customer Management", url: "/contact" },
  { title: "Employee Management", url: "/about" },
  { title: "Restaurant Management", url: "/about" },
  { title: "Dashboard", url: "/about" },
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
            onIsLoginValue={this.handleIsLoginValue}
            isLogin={this.state.isLogin}
          />
          <main>
            <BrowserRouter>
              <div>
                <Switch>
                  <Route exact path="/" component={Home} />
                  <ProtectedRoute path="/about" component={About} />
                  <Route path="/contact" component={Contact} />
                  <Route path="/signup" component={CustomerSignUp} />
                  <Route path="/empsignup" component={EmployeeSignUp} />
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
