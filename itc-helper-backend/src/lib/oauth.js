import OAuthServer from 'koa2-oauth-server';
import LocalClientRegistry from 'config/ClientRegistry';
import OAuthModelStore from 'models/oauth';

const OAuthModel = function (options = {}) {
  if (!(this instanceof OAuthModel)) {
    return new OAuthModel(options);
  }

  const {
    AuthorizationCode,
    AccessToken,
    RefreshToken,
    ClientRegistry,
  } = options;

  Object.assign(this, {
    AuthorizationCode,
    AccessToken,
    RefreshToken,
    ClientRegistry,
  });
};

OAuthModel.prototype = {
  /**
   * not implemented, use default
   */
  generateAccessToken: undefined,
  generateRefreshToken: undefined,
  generateAuthorizationCode: undefined,
  async getAccessToken(accessToken) {
    return this.AccessToken.get({ accessToken });
  },
  async getRefreshToken(refreshToken) {
    return this.RefreshToken.get({ refreshToken });
  },
  async getAuthorizationCode(authorizationCode) {
    return this.AuthorizationCode.get({ authorizationCode });
  },
  async getClient(clientId, clientSecret) {
    const { ClientRegistry } = this;
    const client = ClientRegistry.clients[clientId];
    if (!client) {
      return null;
    }
    if (clientSecret && client.clientSecret !== clientSecret) {
      return null;
    }
  },
  getUser: undefined,
  getUserFromClient: undefined,
  /**
   * the node-oauth2-server uses this method to save an access token and an refresh token(if refresh token enabled) during the token granting phase.
   * @param {Object} token - the token object
   * @param {String} token.accessToken - the access token string
   * @param {Date} token.accessTokenExpiresAt - @see OauthModel.prototype.getAccessToken
   * @param {String} token.refreshToken - the refresh token string
   * @param {Date} token.refreshTokenExpiresAt - @see OauthModel.prototype.getRefreshToken
   * @param {String} token.scope - the access scope
   * @param {Object} client - the client object - @see OauthModel.prototype.getClient
   * @param {String} client.id - the client id
   * @param {Object} user - the user object @see OauthModel.prototype.getAccessToken
   * @param {String} username - the user identifier
   * @return {Object} token - the token object saved, same as the parameter 'token'
   */
  async saveToken(token, client, user) {
    const { AccessToken, RefreshToken } = this;
    const commonInfo = {
      client,
      clientId: client.id,
      user,
      userId: user.id,
    };
    const promises = [];
    const accessToken = new AccessToken({
      accessToken: token.accessToken,
      accessTokenExpiresAt: token.accessTokenExpiresAt,
      ...commonInfo,
    });

    promises.push(accessToken.save());
    if (token.refreshToken) {
      const refreshToken = new RefreshToken({
        accessToken: token.refreshToken,
        accessTokenExpiresAt: token.refreshTokenExpiresAt,
        ...commonInfo,
      });

      promises.push(refreshToken.save());
    }

    return Promise.all(promises).then(() => {
      return Object.assign({}, token, commonInfo);
    });
  },
  async saveAuthorizationCode(code, client, user) {
    const { AuthorizationCode } = this;

    const params = {
      authorizationCode: code.authorizationCode,
      expiresAt: code.expiresAt,
      redirectUri: code.redirectUri,
      scope: code.scope,
      client,
      clientId: client.id,
      user,
      uesrId: user.id,
    };

    const authorizationCode = new AuthorizationCode(params);

    return authorizationCode.save().then(() => {
      return Object.assign({}, code, {
        client,
        user,
      });
    });
  },
  async revokeToken({ refreshToken }) {
    const { RefreshToken } = this;
    return RefreshToken.delete({ refreshToken })
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });
  },
  /**
   * the node-oauth2-server uses this method to revoke a authorization code(mostly when it expires)
   * @param {Object} code - the authorization code object
   * @param {String} code.code - The authorization code
   * @param {Date} code.expiresAt -the time when the code should expire
   * @param {String} code.redirectUri - the redirect uri
   * @param {String} code.scope - the authorization scope
   * @param {Object} code.client - the client object
   * @param {String} code.client.id - the client id
   * @param {Object}  code.user - the user object
   * @param {String} code.user.username - the user identifier
   * @return {Boolean} - true if the code is revoked successfully,false if the could not be found
   */
  async revokeAuthorizationCode({ code }) {
    const { AuthorizationCode } = this;
    return AuthorizationCode.delete({ authorizationCode: code })
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });
  },
  async validateScope(user, client, scope) {
    if (!scope) {
      return null;
    }
    const { ClientRegistry } = this;
    const clientInfo = ClientRegistry.clients[client.id];

    if (!clientInfo || !clientInfo.scope) {
      return null;
    }

    const validScopes = client.scope.split(',').map(s => s.trim());
    const scopes = scope
      .split(',')
      .map(s => s.trim())
      .filter(s => validScopes.indexOf(s) >= 0);

    return scope.length ? scopes.join(',') : false;
  },
  async verifyScope(accessToken, scope) {
    if (!scope) {
      return true;
    }
    if (!accessToken.scope) {
      return false;
    }

    const validScopes = scope.split(',').map(s => s.trim());
    const scopes = accessToken.scope.split(',').map(s => s.trim());

    return scopes.some(s => validScopes.indexOf(s) >= 0);
  },
};

export default () => {
  return new OAuthServer({
    model: OAuthModel({
      AuthorizationCode: OAuthModelStore.AuthorizationCode,
      AccessToken: OAuthModelStore.AccessToken,
      RefreshToken: OAuthModelStore.RefreshToken,
      ClientRegistry: LocalClientRegistry,
    }),
  });
};
