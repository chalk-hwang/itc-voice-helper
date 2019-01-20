import { bindActionCreators } from 'redux';
import store from './index';

import { actionCreators as authActions } from './modules/auth';
import { actionCreators as userActions } from './modules/user';

const { dispatch } = store;
export const AuthActions = bindActionCreators(authActions, dispatch);
export const UserActions = bindActionCreators(userActions, dispatch);
