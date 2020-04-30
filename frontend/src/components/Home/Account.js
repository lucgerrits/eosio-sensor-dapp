import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Title from './Title';

const useStyles = (theme) => ({
});

class Account extends Component {
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

export default withStyles(useStyles)(Account)