import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { AuthActions } from 'store/actionCreators';
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
      console.log(user);
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
