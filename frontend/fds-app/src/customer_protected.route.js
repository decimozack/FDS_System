import React from "react";
import { Route, Redirect } from "react-router-dom";
import auth from "./auth";

export const CustomerProtectedRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        const user = auth.getUser();
        return auth.isAuthenticated() && user.usertype === "c" ? (
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
