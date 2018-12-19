/**
 * In my option, 'scope' is something like 'role' in the role-based security machanism.
 * Note: in the 'role' case, usually we can grant more than one roles to an client/user, but here the 'scope' is just a single string. However you are free to use the string to represent whatever you want, like several sub-scopes by concating those sub-scopes.
 */
const itc_clova = {
  id: 'Dv72-g7gd^k!9Vh!$ekXJxqq',
  clientSecret: 'FvpN-y4E6Hf6rktK@Zm6fBxY4rwC6J!L@R$PbG?T4ewe##%^Gqse-Kb6h&6k',
  name: '인하공전 음성 도우미 클로바', // custom field
  scope: 'profile:read,user_timetable:read,user_subject:read', // a custom scope, indicating that this client is allowed to be authorized to read the user's information
  grants: ['authorization_code', 'refresh_token'],
  redirectUris: ['https://prod-ni-cic.clova.ai/v1/al/token'],
  accessTokenLifetime: 7200, // not required, default is 3600,
  refreshTokenLifetime: 3600 * 24 * 30, // not required, default is 2 weeks
};

const registry = {
  clients: {
    itc_clova,
  },
  scopes: {
    'profile:read': {
      desc: '내 기본 정보를 접근할 수 있습니다.',
    },
    'profile:write': {
      desc: '내 기본 정보를 수정할 수 있습니다.',
    },
    'user_timetable:read': {
      desc: '내 시간표 정보를 접근할 수 있습니다.',
    },
    'user_subject:read': {
      desc: '내 과목 정보를 접근할 수 있습니다.',
    },
  },
};

module.exports = registry;
