import axios from 'lib/defaultClient';
import queryString from 'query-string';

export const getClient = ({ clientId, scope, redirectUri }) => {
  const query = queryString.stringify({
    client_id: clientId,
    scope,
    redirect_uri: redirectUri,
  });
  return axios.get(`/oauth/getClient?${query}`);
};

export const login = ({ form }) => {
  return axios.post('/oauth/login', { form });
};
