// React core
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Copyright } from 'components';

import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import MenuIcon from '@material-ui/icons/Menu';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DashboardIcon from '@material-ui/icons/Dashboard';
import PublishIcon from '@material-ui/icons/Publish';
import InfoIcon from '@material-ui/icons/Info';
import SettingsInputAntennaIcon from '@material-ui/icons/SettingsInputAntenna';

import Account from './Account';
import About from './About';
import SensorLog from './SensorLog';
import SendSensorData from './SendSensorData';

// Services and redux action
import { UserAction } from 'actions';
import { ApiService } from 'services';

const drawerWidth = 240;
const useStyles = (theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
})

class Home extends Component {

  constructor(props) {
    // Inherit constructor
    super(props);

    this.state = {
      open: true,
      page: localStorage.getItem("current_page") || "dashboard",
    }

    // Bind functions
    this.logout = this.logout.bind(this);
    this.handleDrawerOpen = this.handleDrawerOpen.bind(this);
    this.handleDrawerClose = this.handleDrawerClose.bind(this);
    this.handleChangePage = this.handleChangePage.bind(this);

  }


  logout = () => {
    const { setUser } = this.props;
    ApiService.logout().then(() => {
      setUser({
        name: ""
      });
    })
  };

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };
  handleChangePage = (page) => {
    return () => {
      localStorage.setItem("current_page", page);
      this.setState({ page: page });
    }
  };
  render() {
    const { classes } = this.props;
    // Extract data from user data of `UserReducer` from redux
    const { user } = this.props;
    const { open, page } = this.state;
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
          <Toolbar className={classes.toolbar}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={this.handleDrawerOpen}
              className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
            >
              <MenuIcon />
            </IconButton>
            <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
              EOS Sensor dApp
          </Typography>
            <IconButton color="inherit" onClick={this.logout} >
              <ExitToAppIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          classes={{
            paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
          }}
          open={open}
        >
          <div className={classes.toolbarIcon}>
            <IconButton onClick={this.handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
          <Divider />
          <List>
            <div>
              <ListItem button onClick={this.handleChangePage("dashboard")} >
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItem>
              <ListItem button onClick={this.handleChangePage("push_sensors_log")} >
                <ListItemIcon>
                  <PublishIcon />
                </ListItemIcon>
                <ListItemText primary="Push Sensors Data" />
              </ListItem>
              <ListItem button onClick={this.handleChangePage("sensors_log")} >
                <ListItemIcon>
                  <SettingsInputAntennaIcon />
                </ListItemIcon>
                <ListItemText primary="Sensors Data" />
              </ListItem>
              <ListItem button onClick={this.handleChangePage("about")} >
                <ListItemIcon>
                  <InfoIcon />
                </ListItemIcon>
                <ListItemText primary="About" />
              </ListItem>
            </div>
          </List>
        </Drawer>
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <Container maxWidth="lg" className={classes.container}>
            <Grid container spacing={3}>
              {(() => {
                if (page === "dashboard") {
                  return (
                    <Grid item xs={12}>
                      <Paper className={fixedHeightPaper}>
                        <Account {...{ user: user }} />
                      </Paper>
                    </Grid>
                  )
                } else if (page === "sensors_log") {
                  return (

                    <Grid item xs={12}>
                      <Paper className={classes.paper}>
                        <SensorLog {...{ user: user }} />
                      </Paper>
                    </Grid>
                  )
                } else if (page === "push_sensors_log") {
                  return (
                    <Grid item xs={12}>
                      <Paper className={classes.paper}>
                        <SendSensorData {...{ user: user }} />
                      </Paper>
                    </Grid>
                  )
                } else if (page === "about") {
                  return (
                    <Grid item xs={12}>
                      <Paper className={classes.paper}>
                        <About {...{ user: user }} />
                      </Paper>
                    </Grid>
                  )
                } else {
                  return (
                    <h3>Page Not Found</h3>
                  )
                }
              })()}
            </Grid>
            <Box pt={4}>
              <Copyright />
            </Box>
          </Container>
        </main>
      </div>
    )
  }

}

// Map all state to component props (for redux to connect)
const mapStateToProps = state => state;

// Map the following action to props
const mapDispatchToProps = {
  setUser: UserAction.setUser,
};

// Export a redux connected component
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(useStyles)(Home));
