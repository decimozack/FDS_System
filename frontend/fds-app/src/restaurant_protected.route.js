import React from "react";
import { Route, Redirect } from "react-router-dom";
import auth from "./auth";

export const RestaurantProtectedRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        const user = auth.getUser();
        return auth.isAuthenticated() && user.usertype === "r" ? (
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
