import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { AuthActions } from 'store/actionCreators';
import LoginForm from 'components/auth/LoginForm';

class LoginFormContainer extends Component {
  onLogin = () => {};

  onChange = (e) => {
    const { value, name } = e.target;
    AuthActions.changeLoginForm({ name, value });
  };

  render() {
    const { onChange } = this;
    return <LoginForm onChange={onChange} />;
  }
}

export default connect(({ auth }) => ({
  client: auth.client,
}))(withRouter(LoginFormContainer));
