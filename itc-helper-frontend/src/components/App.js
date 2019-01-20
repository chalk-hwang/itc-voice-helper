// @flow
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Core from 'containers/base/Core';

import { Auth } from 'pages';

const App = () => (
  <React.Fragment>
    <Helmet>
      <title>인하공업전문대학 학사도우미</title>
    </Helmet>
    <Switch>
      <Route path="/:mode(login|oauth)" component={Auth} />
    </Switch>
    <Core />
  </React.Fragment>
);

export default App;
