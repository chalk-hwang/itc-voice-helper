// @flow
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import { Login } from 'pages';

const App = () => (
  <React.Fragment>
    <Helmet>
      <title>인하공업전문대학 커뮤니티</title>
    </Helmet>
    <Switch>
      <Route path="/login" component={Login} />
    </Switch>
  </React.Fragment>
);

export default App;
