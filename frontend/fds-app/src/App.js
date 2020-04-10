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

const useStyles = makeStyles(theme => ({
  mainGrid: {
    marginTop: theme.spacing(3)
  }
}));

const sections = [
  { title: "Home", url: "/" },
  { title: "Contact", url: "/contact" },
  { title: "About", url: "/about" }
];

const routing = (
  <React.Fragment>
    <CssBaseline />
    <Container maxWidth="lg">
      <Header title="FDS System" sections={sections} />
      <main>
        <BrowserRouter>
          <div>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/about" component={About} />
              <Route path="/contact" component={Contact} />
              <Route path="/signin" component={SignIn} />
            </Switch>
          </div>
        </BrowserRouter>
      </main>
    </Container>
  </React.Fragment>
);

class App extends Component {
  render() {
    return routing;
  }
}

export default App;
