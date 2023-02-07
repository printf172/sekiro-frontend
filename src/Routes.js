import React, { useContext } from "react";
import { Switch, Redirect } from "react-router-dom";

import { RouteWithLayout } from "./components";
import { Main as MainLayout, Minimal as MinimalLayout } from "./layouts";

import { AppContext } from "adapter";

import {
  Dashboard as DashboardView,
  Account as AccountView,
  Config as ConfigView,
  SignIn as SignInView,
  SignUp as SignUpView,
  NotFound as NotFoundView,
  GroupList as GroupListView,
  GroupDetail as GroupDetailView
} from "./views";

const PrivateRoute = ({ ...rest }) => {
  const { user } = useContext(AppContext);
  return !user.overdue ? (
    <RouteWithLayout {...rest} />
  ) : (
    <Redirect
      to={{
        pathname: "/sign-in"
      }}
    />
  );
};

const Routes = () => {
  return (
    <Switch>
      <Redirect
        exact
        from="/"
        to="/dashboard"
      />

      <PrivateRoute
        component={AccountView}
        exact
        layout={MainLayout}
        path="/account"
      />
      <PrivateRoute
        component={DashboardView}
        exact
        layout={MainLayout}
        path="/dashboard"
      />
      <PrivateRoute
        component={ConfigView}
        exact
        layout={MainLayout}
        path="/config"
      />

      <PrivateRoute
        component={GroupListView}
        exact
        layout={MainLayout}
        path="/groupList"
      />
      <PrivateRoute
        component={GroupDetailView}
        exact
        layout={MainLayout}
        path="/groupDetail/:groupName"
      />

      <RouteWithLayout
        component={SignInView}
        exact
        layout={MinimalLayout}
        path="/sign-in"
      />
      <RouteWithLayout
        component={SignUpView}
        exact
        layout={MinimalLayout}
        path="/sign-up"
      />
      <RouteWithLayout
        component={NotFoundView}
        exact
        layout={MinimalLayout}
        path="/not-found"
      />


      <Redirect to="/not-found"/>
    </Switch>
  );
};

export default Routes;
