import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import queryString from 'query-string';
import OAuthDialog from 'components/auth/OAuthDialog';

class OAuthDialogContainer extends Component {
  onAgree = async () => {
    const { location } = this.props;
    let host = 'https://api.itc-helper.dguri.io/oauth/authorize';
    if (process.env.NODE_ENV === 'development') {
      host = 'http://localhost:4000/oauth/authorize';
    }
    const {
      client_id,
      redirect_uri,
      response_type,
      scope,
      state,
    } = queryString.parse(location.search);
    const query = queryString.stringify({
      client_id,
      redirect_uri,
      response_type,
      scope: scope.split(' ').join(','),
      state,
    });
    window.location.replace(`${host}?${query}`);
  };

  onDeny = async () => {};

  render() {
    const { onAgree } = this;
    const { user } = this.props;
    if (!user) return null;
    return <OAuthDialog name={user.name} onAgree={onAgree} />;
  }
}

export default compose(
  withRouter,
  connect(({ user }) => ({
    user: user.user,
  })),
)(OAuthDialogContainer);
