import React, { Component, Fragment } from 'react';
import { UserActions } from 'store/actionCreators';
import { connect } from 'react-redux';
import storage, { keys } from 'lib/storage';
import { withRouter } from 'react-router-dom';
import NanoBar from 'components/common/NanoBar';
import { setup } from '../../lib/progress';

class Core extends Component {
  unlisten = null;

  checkUser = async () => {
    const storedUser = storage.get(keys.user);
    if (!storedUser) {
      return;
    }
    UserActions.setUser(storedUser);
    try {
      await UserActions.checkUser();
    } catch (e) {
      storage.remove(keys.user);
    }
  };

  initialize = async () => {
    this.checkUser();
  };

  // listenHistory = () => {
  //   const { history } = this.props;
  //   this.unlisten = history.listen((location, type) => {
  //     CommonActions.changeRoute({
  //       type,
  //       ...location,
  //     });
  //   });
  // };

  componentDidMount() {
    this.initialize();
    // this.listenHistory();
    // CommonActions.changeRoute({
    //   type: 'PUSH',
    //   ...this.props.location,
    // });
    setup();
  }

  componentWillUnmount() {
    // if (this.unlisten) this.unlisten();
  }

  render() {
    return (
      <Fragment>
        <NanoBar />
      </Fragment>
    );
  }
}

export default connect(
  ({ user }: State) => ({
    user: user.user,
  }),
  () => ({}),
)(withRouter(Core));
