// @flow
import React from 'react';
import Button from 'components/common/Button';
import './OAuthDialog.scss';

const OAuthDialog = ({ name, onAgree, onDeny }) => (
  <div className="OAuthDialog">
    <Button onClick={onAgree} fullWidth>
      {name}
      님으로 계속
    </Button>
    <Button className="btn-deny" onClick={onDeny} fullWidth theme="transparent">
      거부
    </Button>
  </div>
);

export default OAuthDialog;
