import React, { Component } from 'react';
import { connect } from 'react-redux';
import LoginFormContainer from 'containers/auth/LoginFormContainer';

function mapStateToProps(state) {
  return {};
}

class Login extends Component {
  render() {
    return <LoginFormContainer />;
  }
}

export default connect(mapStateToProps)(Login);
