import { bindActionCreators } from 'redux';
import store from './index';

import { actionCreators as authActions } from './modules/auth';

const { dispatch } = store;
export const AuthActions = bindActionCreators(authActions, dispatch);
