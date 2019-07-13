/* React */
import React from "react";

/* React router */
import { Route, Switch } from "react-router-dom";

/* All the pages */
import HomePage from "./containers/HomePage/HomePage";

const Routes = () => (
  <Switch>
    <Route exact path="/" component={HomePage}/>
  </Switch>
);

export default Routes;