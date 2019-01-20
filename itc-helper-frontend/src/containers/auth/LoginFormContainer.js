import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { AuthActions, UserActions } from 'store/actionCreators';
import storage, { keys } from 'lib/storage';
import LoginForm from 'components/auth/LoginForm';

class LoginFormContainer extends Component {
  onLogin = async () => {
    const { email, password } = this.props;
    try {
      const form = {
        email,
        password,
      };
      await AuthActions.login({
        form,
      });

      const { authResult } = this.props;

      if (!authResult) return;
      const { user } = authResult;

      UserActions.setUser(user);
      storage.set(keys.user, user);
    } catch (e) {
      console.log(e);
    }
  };

  onChange = (e) => {
    const { value, name } = e.target;
    AuthActions.changeLoginForm({ name, value });
  };

  render() {
    const { onChange, onLogin } = this;
    return <LoginForm onChange={onChange} onLogin={onLogin} />;
  }
}

export default connect(({ auth }) => {
  const { client, loginForm, authResult } = auth;
  const { email, password } = loginForm;
  return {
    client,
    email,
    password,
    authResult,
  };
})(withRouter(LoginFormContainer));
