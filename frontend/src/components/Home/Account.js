import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Title from './Title';

import { UserAction } from 'actions';
import { ApiService } from 'services';

const useStyles = (theme) => ({
});

class Account extends Component {

  constructor(props) {
    // Inherit constructor
    super(props);

    this.state = {
      open: true,
      page: localStorage.getItem("current_page") || "dashboard",
    }

    this.loadUser = this.loadUser.bind(this);
    // Bind functions
    this.loadUser();
  }

  // Get latest user object from blockchain
  loadUser() {
    // Extract `setUser` of `UserAction` and `user.name` of UserReducer from redux
    const { setUser, user: { name } } = this.props;
    // Send request the blockchain by calling the ApiService,
    return ApiService.getUserByName(name).then(user => {
      setUser({
        log_count: user.log_count
      });
    });
  }
  render() {
    // const { classes } = this.props;
    const { user } = this.props;
    return (
      <React.Fragment>
        <Title>Account</Title>
        <Typography color="textPrimary">
          Name: {user.name}
        </Typography>
        <Typography color="textSecondary">
          Total sensor logs: {user.log_count}
        </Typography>
      </React.Fragment>
    );
  }
}
// Map all state to component props (for redux to connect)
const mapStateToProps = state => state;

// Map the following action to props
const mapDispatchToProps = {
  setUser: UserAction.setUser,
};
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(useStyles)(Account))