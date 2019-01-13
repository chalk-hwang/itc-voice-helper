import React, { Component } from 'react';
import { connect } from 'react-redux';
import AuthTemplate from 'components/auth/AuthTemplate';
import LoginForm from 'components/auth/LoginForm';

function mapStateToProps(state) {
  return {};
}

class Login extends Component {
  render() {
    return <AuthTemplate form={<LoginForm />} />;
  }
}

export default connect(mapStateToProps)(Login);
