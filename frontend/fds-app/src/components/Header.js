import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import auth from "../auth";

const useStyles = makeStyles((theme) => ({
  toolbar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  toolbarTitle: {
    flex: 1,
  },
  toolbarSecondary: {
    justifyContent: "flex-start",
    overflowX: "auto",
  },
  toolbarLink: {
    padding: theme.spacing(1),
    flexShrink: 0,
  },
  overrides: {
    color: "white",
    textTransform: "none",
    textEmphasis: "none",
  },
  linkcolor: {
    color: "black",
  },
}));

export default function Header(props) {
  const classes = useStyles();
  const {
    sections,
    customerSections,
    managerSections,
    riderSections,
    title,
    restaurantSections,
  } = props;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorCustomer, setAnchorCustomer] = React.useState(null);
  const [anchorE2, setAnchorE2] = React.useState(null);
  const [anchorE3, setAnchorE3] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClickCustomer = (event) => {
    setAnchorCustomer(event.currentTarget);
  };

  const handleClickRider = (event) => {
    setAnchorE2(event.currentTarget);
  };

  const handleClickRestaurant = (event) => {
    setAnchorE3(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setAnchorCustomer(null);
    setAnchorE2(null);
    setAnchorE3(null);
  };

  const handleSignIn = (event) => {
    props.onIsLoginValue();
    props.history.push("/signin");
  };
  const handleSignOut = (event) => {
    auth.logout();
    props.onIsLoginValue();
    props.history.push("/");
  };

  return (
    <React.Fragment>
      <Toolbar className={classes.toolbar}>
        <Typography
          component="h2"
          variant="h5"
          color="inherit"
          align="center"
          noWrap
          className={classes.toolbarTitle}
        >
          {title}
        </Typography>

        {props.isLogin == false && (
          <Link href="/signin">
            <Button variant="outlined" size="small" onClick={handleSignIn}>
              Sign in
            </Button>
          </Link>
        )}
        {props.isLogin && (
          <Link href="/signin">
            <Button variant="outlined" size="small" onClick={handleSignOut}>
              Logout
            </Button>
          </Link>
        )}
      </Toolbar>
      <AppBar position="static">
        <Toolbar
          component="nav"
          variant="dense"
          className={classes.toolbarSecondary}
        >
          {sections.map((section) => (
            <Link
              color="inherit"
              noWrap
              key={section.title}
              variant="body2"
              href={section.url}
              className={classes.toolbarLink}
            >
              {section.title}
            </Link>
          ))}
          <Button
            aria-controls="customer-menu"
            aria-haspopup="true"
            onClick={handleClickCustomer}
            color="white"
            className={classes.overrides}
          >
            Customer
          </Button>
          <Menu
            id="customer-menu"
            anchorEl={anchorCustomer}
            keepMounted
            open={Boolean(anchorCustomer)}
            onClose={handleClose}
          >
            {customerSections.map((section) => (
              <MenuItem onClick={handleClose}>
                <Link
                  className={classes.linkcolor}
                  noWrap
                  key={section.title}
                  href={section.url}
                >
                  {section.title}
                </Link>
              </MenuItem>
            ))}
          </Menu>

          <Button
            aria-controls="simple-menu"
            aria-haspopup="true"
            onClick={handleClick}
            color="white"
            className={classes.overrides}
          >
            Manager
          </Button>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            {managerSections.map((section) => (
              <MenuItem onClick={handleClose}>
                <Link
                  className={classes.linkcolor}
                  noWrap
                  key={section.title}
                  href={section.url}
                >
                  {section.title}
                </Link>
              </MenuItem>
            ))}
          </Menu>

          <Button
            aria-controls="simple-menu-3"
            aria-haspopup="true"
            onClick={handleClickRider}
            color="white"
            className={classes.overrides}
          >
            Riders
          </Button>
          <Menu
            id="simple-menu-3"
            anchorEl={anchorE2}
            keepMounted
            open={Boolean(anchorE2)}
            onClose={handleClose}
          >
            {riderSections.map((section) => (
              <MenuItem onClick={handleClose}>
                <Link
                  className={classes.linkcolor}
                  noWrap
                  key={section.title}
                  href={section.url}
                >
                  {section.title}
                </Link>
              </MenuItem>
            ))}
          </Menu>

          <Button
            aria-controls="simple-menu-2"
            aria-haspopup="true"
            onClick={handleClickRestaurant}
            color="white"
            className={classes.overrides}
          >
            Restaurant
          </Button>
          <Menu
            id="simple-menu-2"
            anchorEl={anchorE3}
            keepMounted
            open={Boolean(anchorE3)}
            onClose={handleClose}
          >
            {restaurantSections.map((section) => (
              <MenuItem onClick={handleClose}>
                <Link
                  className={classes.linkcolor}
                  noWrap
                  key={section.title}
                  href={section.url}
                >
                  {section.title}
                </Link>
              </MenuItem>
            ))}
          </Menu>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
}

Header.propTypes = {
  sections: PropTypes.array,
  title: PropTypes.string,
};
