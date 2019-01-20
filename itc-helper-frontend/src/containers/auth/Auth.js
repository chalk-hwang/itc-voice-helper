import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Switch, Route, withRouter } from 'react-router-dom';
import { compose } from 'redux';
import queryString from 'query-string';
import { AuthActions } from 'store/actionCreators';
import AuthTemplate from 'components/auth/AuthTemplate';
import OAuthClient from 'components/auth/OAuthClient';
import { Login, OAuthDialog } from 'pages';

class Auth extends Component {
  initialize = async () => {
    const { location, history, user } = this.props;
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
        console.log(location);
        if (user !== null && location.pathname === '/login') {
          history.push({
            pathname: '/oauth/dialog',
            search: location.search,
          });
        }
      } catch (e) {
        history.replace('/404');
      }
    }
  };

  componentDidMount() {
    this.initialize(); // "?filter=top&origin=im"
  }

  componentDidUpdate(prevProps) {
    const { user } = this.props;
    if (prevProps.user !== user) {
      this.initialize();
    }
  }

  render() {
    const { client } = this.props;
    return (
      <AuthTemplate client={<OAuthClient clientInfo={client} />}>
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/oauth/dialog" component={OAuthDialog} />
        </Switch>
      </AuthTemplate>
    );
  }
}

export default compose(
  withRouter,
  connect(
    ({ auth, user }) => ({
      client: auth.client,
      user: user.user,
    }),
    () => ({}),
  ),
)(Auth);
