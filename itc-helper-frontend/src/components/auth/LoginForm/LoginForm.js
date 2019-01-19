// @flow
import React from 'react';
import { Link } from 'react-router-dom';
import Input from 'components/common/Input';
import Button from 'components/common/Button';
import Divider from 'components/common/Divider';
import './LoginForm.scss';

type Props = {};

const LoginForm = ({ onChange }: Props) => (
  <div className="LoginForm">
    <div className="login-wrapper">
      <Input
        label="이메일"
        className="inp-auth"
        name="email"
        onChange={onChange}
      />
      <Input
        type="password"
        className="inp-auth"
        label="비밀번호"
        name="password"
        onChange={onChange}
      />
    </div>
    <Button className="btn-login" fullWidth>
      로그인
    </Button>
    <Divider text="또는" />
    <div className="utilities">
      <p>
        회원이 아니신가요?
        {' '}
        <Link to="/register">회원가입하기</Link>
      </p>
      <p>
        로그인이 안나시나요?
        {' '}
        <Link to="/forgot">이메일 또는 비밀번호 찾기</Link>
      </p>
    </div>
  </div>
);

export default LoginForm;
