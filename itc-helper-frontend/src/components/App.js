// @flow
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import { Auth } from 'pages';

const App = () => (
  <React.Fragment>
    <Helmet>
      <title>인하공업전문대학 학사도우미</title>
    </Helmet>
    <Switch>
      <Route path="/login" component={Auth} />
    </Switch>
  </React.Fragment>
);

export default App;
