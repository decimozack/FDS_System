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
                  <Route path="*" component={() => "404 Not Found"} />
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
