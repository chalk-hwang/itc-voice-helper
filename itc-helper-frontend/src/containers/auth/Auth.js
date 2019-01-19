import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Switch, Route, withRouter } from 'react-router-dom';
import { compose } from 'redux';
import queryString from 'query-string';
import { AuthActions } from 'store/actionCreators';
import AuthTemplate from 'components/auth/AuthTemplate';
import OAuthClient from 'components/auth/OAuthClient';
import Login from 'pages/Login';

class Auth extends Component {
  initialize = async () => {
    const { location, history } = this.props;
    const {
      response_type,
      client_id: clientId,
      redirect_uri: redirectUri,
      scope,
    } = queryString.parse(location.search);

    if (response_type === 'code') {
      try {
        await AuthActions.getClient({
          clientId,
          redirectUri,
          scope: scope.split(' ').join(','),
        });
      } catch (e) {
        history.replace('/404');
      }
    }
  };

  componentDidMount() {
    const { location } = this.props;
    this.initialize(); // "?filter=top&origin=im"
  }

  render() {
    const { client } = this.props;
    return (
      <AuthTemplate client={<OAuthClient clientInfo={client} />}>
        <Switch>
          <Route path="/login" component={Login} />
        </Switch>
      </AuthTemplate>
    );
  }
}

export default compose(
  withRouter,
  connect(
    ({ auth }) => ({
      client: auth.client,
    }),
    () => ({}),
  ),
)(Auth);
