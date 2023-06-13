import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from './screens/home';

const AppTravelWidgets = () => {
  return (
    <React.Fragment>
      <Switch>
        <Route
          exact
          path="/"
          render={(props) => <Home {...props} />}
        />
      </Switch>
    </React.Fragment>
  );
};

export default AppTravelWidgets;
