import React from 'react';
import { Link } from 'react-router-dom';
import { ReactComponent as Logo } from 'static/images/logo.svg';
import './AuthTemplate.scss';

const AuthTemplate = ({ children, client }) => (
  <section className="AuthTemplate">
    <main className="auth-wrapper">
      <div className="box">
        <h1 className="logo">
          <Logo />
        </h1>
        {client && <div className="client-content">{client}</div>}
        <div className="auth-content">{children}</div>
      </div>
    </main>
    <footer className="footer">
      <div className="footer-content">
        <nav className="nav-container">
          <ul className="nav-items">
            <li>
              <Link to="/policy/privacy">개인정보처리방침</Link>
            </li>
            <li>
              <Link to="/policy/agreement">이용약관</Link>
            </li>
            <li>
              <Link to="#">고객지원</Link>
            </li>
            <li>
              <Link to="#">공지사항</Link>
            </li>
          </ul>
        </nav>
        <span className="copyright">© 2018 인하공업전문대학교 커뮤니티</span>
      </div>
    </footer>
  </section>
);

export default AuthTemplate;
