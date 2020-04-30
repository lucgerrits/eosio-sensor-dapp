import React, { useState } from 'react';
import { connect } from 'react-redux';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
// import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

// Services and redux action
import { UserAction } from 'actions';
import { ApiService } from 'services';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="/">
        Hello World dApp
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
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
}));


function Login(props) {
  const [formState, setformState] = useState({
    username: '',
    key: '',
    error: '',
  });

  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleToggle = () => {
    setOpen(!open);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    var newform  = formState;
    newform[name] = value;
    newform['error'] = '';
    setformState(newform);

    console.log(formState)
  }

  const handleSubmit = (event) => {
    //Suppress the default submit behavior
    event.preventDefault();
    console.log("Call blockchain")
    //handleToggle()

    //submit credentials to the blockchain
    // Extract `form` state
    const  form  = formState;
    // Extract `setUser` of `UserAction` and `user.name` of UserReducer from redux
    const { setUser } = this.props;
    // Send a login transaction to the blockchain by calling the ApiService,
    // If it successes, save the username to redux store
    // Otherwise, save the error state for displaying the message
    return ApiService.login(form)
      .then(() => {
        setUser({ name: form.username });
      })
      .catch(err => {
        this.setState({ error: err.toString() });
      });

  }

  const classes = useStyles();
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
        <form className={classes.form} onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Account name"
            name="username"
            type="text"
            title="All small letters, a-z, 1-5 or dot, max 12 characters"
            placeholder="All small letters, a-z, 1-5 or dot, max 12 characters"
            pattern="[\.a-z1-5]{2,12}"
            onChange={ handleChange }
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="key"
            label="Private key"
            type="password"
            id="key"
            pattern="^.{51,}$"
            onChange={ handleChange }
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
        { formState.error && <span>{formState.error}</span>}
      </Box>
      <Box mt={8}>
        <Copyright />
      </Box>
      <Backdrop className={classes.backdrop} open={open} onClick={handleClose}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Container>
  )
}

// Map all state to component props (for redux to connect)
const mapStateToProps = state => state;

// Map the following action to props
const mapDispatchToProps = {
  setUser: UserAction.setUser,
};

// Export a redux connected component
export default connect(mapStateToProps, mapDispatchToProps)(Login);