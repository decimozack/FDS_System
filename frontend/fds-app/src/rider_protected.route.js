import React from "react";
import { Route, Redirect } from "react-router-dom";
import auth from "./auth";

export const RiderProtectedRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        const user = auth.getUser();
        return auth.isAuthenticated() && user.usertype === "ri" ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/",
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
