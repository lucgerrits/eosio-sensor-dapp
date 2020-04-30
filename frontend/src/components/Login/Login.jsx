import React, { Component } from 'react';
import { connect } from 'react-redux';
// Components
import { Copyright } from 'components';
// import { Button } from 'components';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
// import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

// Services and redux action
import { UserAction } from 'actions';
import { ApiService } from 'services';

const useStyles = (theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
})

class Login extends Component {

  constructor(props) {
    // Inherit constructor
    super(props);
    // State for form data and error message
    this.state = {
      BackdropOpen: false,
      form: {
        username: '',
        key: '',
        error: '',
      },
    }
    // Bind functions
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleBackdropOpen = this.handleBackdropOpen.bind(this);
    this.handleBackdropClose = this.handleBackdropClose.bind(this);
  }


  // Runs on every keystroke to update the React state
  handleChange(event) {
    const { name, value } = event.target;
    const { form } = this.state;

    this.setState({
      error: '',
      form: {
        ...form,
        [name]: value,
      },
    });
  }

  // Handle form submission to call api
  handleSubmit(event) {
    // Stop the default form submit browser behaviour
    event.preventDefault();
    this.handleBackdropOpen();
    // Extract `form` state
    const { form } = this.state;
    // Extract `setUser` of `UserAction` and `user.name` of UserReducer from redux
    const { setUser } = this.props;
    // Send a login transaction to the blockchain by calling the ApiService,
    // If it successes, save the username to redux store
    // Otherwise, save the error state for displaying the message
    return ApiService.login(form)
      .then(() => {
        setUser({ name: form.username });
        console.log("Connected")
      })
      .catch(err => {
        // this.setState({ error: err.toString() + "\n\n" + err.stack.toString()});
        this.setState({ error: err.toString() });
        this.handleBackdropClose();
      });
  }
  handleBackdropClose = () => {
    this.setState({ BackdropOpen: false });
  };
  handleBackdropOpen = () => {
    this.setState({ BackdropOpen: false });
  };

  render() {
    const { classes } = this.props;
    // Extract data from state
    const { form, error, BackdropOpen } = this.state;

    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Login
        </Typography>
          <form className={classes.form} onSubmit={this.handleSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="Account name"
              name="username"
              value={form.username}
              type="text"
              title="All small letters, a-z, 1-5 or dot, max 12 characters"
              placeholder="All small letters, a-z, 1-5 or dot, max 12 characters"
              pattern="[\.a-z1-5]{2,12}"
              onChange={this.handleChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="key"
              value={form.key}
              label="Private key"
              type="password"
              id="key"
              pattern="^.{51,}$"
              onChange={this.handleChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Login
          </Button>
          </form>
        </div>
        <Box mt={8} color="error.main">
          {error && <pre>{error}</pre>}
        </Box>
        <Box mt={8}>
          <Copyright />
        </Box>
        <Backdrop className={classes.backdrop} open={BackdropOpen} onClick={this.handleBackdropClose}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </Container>
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
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(useStyles)(Login));
