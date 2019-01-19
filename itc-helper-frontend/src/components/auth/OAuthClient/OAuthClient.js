import React from 'react';
import Divider from 'components/common/Divider';
import './OAuthClient.scss';

const OAuthClient = ({ clientInfo }) => {
  if (clientInfo) {
    const scopesShort = clientInfo.scopes.map(s => s.name).join(', ');
    return (
      <div className="OAuthClient">
        <Divider text="권한 안내" />
        {clientInfo.image && (
          <div className="client-logo">
            <img
              src={`https://images.itc-helper.dguri.io/${clientInfo.image}`}
              alt={clientInfo.name}
            />
          </div>
        )}
        <div className="client-name">
          <strong>{clientInfo.name}</strong>
          앱에서 수신하는 정보 :
        </div>
        <div className="client-scope">{scopesShort}</div>
        <Divider />
      </div>
    );
  }
  return null;
};

export default OAuthClient;
