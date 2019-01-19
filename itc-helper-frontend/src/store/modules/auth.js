import { createAction, handleActions } from 'redux-actions';
import { applyPenders } from 'redux-pender';
import produce from 'immer';
import * as AuthAPI from 'lib/api/auth';

const GET_CLIENT = 'auth/GET_CLIENT';
const CHANGE_LOGIN_FORM = 'auth/CHANGE_LOGIN_FORM';

export const actionCreators = {
  getClient: createAction(GET_CLIENT, AuthAPI.getClient),
  changeLoginForm: createAction(CHANGE_LOGIN_FORM),
};

const initialState = {
  client: null,
  loginForm: {
    email: '',
    password: '',
  },
};

const reducer = handleActions(
  {
    [CHANGE_LOGIN_FORM]: (state, action) => {
      const {
        payload: { name, value },
      } = action;
      return produce(state, (draft) => {
        draft.loginForm[name] = value;
      });
    },
  },
  initialState,
);

export default applyPenders(reducer, [
  {
    type: GET_CLIENT,
    onSuccess: (state, action) => {
      return {
        ...state,
        client: action.payload.data,
      };
    },
  },
]);
