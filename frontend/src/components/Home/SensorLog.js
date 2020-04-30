import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
// import Link from '@material-ui/core/Link';
// import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Title from './Title';

import { ApiService } from 'services';

const useStyles = (theme) => ({
});

// function preventDefault(event) {
//   event.preventDefault();
// }

// const useStyles = makeStyles((theme) => ({
//   seeMore: {
//     marginTop: theme.spacing(3),
//   },
// }));

class SensorLog extends Component {
  constructor(props) {
    // Inherit constructor
    super(props);

    this.state = {
      logs: null
    }

    // Bind functions
    this.loadLogs = this.loadLogs.bind(this);
    // Call `loadLogs` before mounting the app
    this.loadLogs();
  }

  // Get latest user object from blockchain
  loadLogs() {
    // Extract `setUser` of `UserAction` and `user.name` of UserReducer from redux
    const { user: { name } } = this.props;

    // Send request the blockchain by calling the ApiService,
    // Get the user object and store the `win_count`, `lost_count` and `game_data` object
    return ApiService.getUserLogs(name).then(data => {
      this.setState({ logs: data })
    }).catch((err) => {
      console.log(err)
    });
  }

  render() {
    // const { classes } = this.props;
    const { user } = this.props;
    const { logs } = this.state;
    return (
      <React.Fragment>
        <Title>Sensor Log <small>(For user: {user.name})</small></Title>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Sensor UID</TableCell>
              <TableCell align="right">Data</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs &&
              logs.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.sensor_uid}</TableCell>
                  <TableCell align="right">{row.data}</TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
        {/* <div className={classes.seeMore}>
        <Link color="primary" href="#" onClick={preventDefault}>
          See more orders
        </Link>
      </div> */}
      </React.Fragment>
    );
  }
}

export default withStyles(useStyles)(SensorLog)
