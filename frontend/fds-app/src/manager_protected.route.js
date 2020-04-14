import React from "react";
import { Route, Redirect } from "react-router-dom";
import auth from "./auth";

export const ManagerProtectedRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        const user = localStorage.getItem("user");
        return auth.isAuthenticated() && user ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/home",
              state: {
                from: props.location,
              },
            }}
          />
        );
      }}
    />
  );
};
