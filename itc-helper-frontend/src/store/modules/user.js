import { createAction, handleActions } from 'redux-actions';
import { applyPenders } from 'redux-pender';
import produce from 'immer';
import * as AuthAPI from 'lib/api/auth';

const SET_USER = 'user/SET_USER';
const CHECK_USER = 'user/CHECK_USER';

export const actionCreators = {
  setUser: createAction(SET_USER),
  checkUser: createAction(CHECK_USER, AuthAPI.check),
};

const initialState: User = {
  user: null,
  processed: false,
};

const reducer = handleActions(
  {
    [SET_USER]: (state, action) => {
      return produce(state, (draft) => {
        if (!action) return;
        draft.user = action.payload;
      });
    },
  },
  initialState,
);

export default applyPenders(reducer, [
  {
    type: CHECK_USER,
    onSuccess: (state, { payload: { data } }) => {
      return produce(state, (draft) => {
        draft.user = data.user;
        draft.processed = true;
      });
    },
    onError: state => produce(state, (draft) => {
      draft.user = null;
      draft.processed = true;
    }),
  },
]);
