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
  const { sections, managerSections, title } = props;
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
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
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
}

Header.propTypes = {
  sections: PropTypes.array,
  title: PropTypes.string,
};
