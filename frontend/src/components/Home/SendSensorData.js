import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
// import Link from '@material-ui/core/Link';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';

import Title from './Title';

import Moment from 'moment';

import { ApiService } from 'services';

const useStyles = (theme) => ({
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    hiddenField: {
        display: "none"
    }
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

        // State for form data and error message
        this.state = {
            BackdropOpen: false,
            success: false,
            error: false,
        }
        // Bind functions
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleBackdropClose = this.handleBackdropClose.bind(this);
        this.handleBackdropOpen = this.handleBackdropOpen.bind(this);
    }

    handleBackdropClose = () => {
        this.setState({ BackdropOpen: false });
    };
    handleBackdropOpen = () => {
        this.setState({ BackdropOpen: false });
    };

    // Handle form submission to call api
    handleSubmit(event) {
        // Stop the default form submit browser behaviour
        event.preventDefault();
        this.handleBackdropOpen();
        // Extract `form` state
        const { user } = this.props;
        const form = {
            sensor_uid: event.target.elements.sensor_uid.value,
            date: event.target.elements.date.value,
            data: event.target.elements.data.value,
            username: user.name
        }
        return ApiService.sendSensorData(form)
            .then(() => {
                this.handleBackdropClose();
                this.setState({ success: true });
                setTimeout(() => {
                    this.setState({ success: false });
                }, 3000)
            })
            .catch(err => {
                // this.setState({ error: err.toString() + "\n\n" + err.stack.toString()});
                this.setState({ error: err.toString() });
                this.handleBackdropClose();
            });
    }

    render() {
        Moment.locale('fr');
        const { classes, user } = this.props;
        const { error, success, BackdropOpen } = this.state;
        return (
            <Container component="main" maxWidth="lg">
                <Title>Add Sensor Log <small>(Using user: {user.name})</small></Title>
                <form className={classes.form} onSubmit={this.handleSubmit}>
                    <TextField
                        fullWidth
                        label="Sensor UID"
                        defaultValue="001"
                        helperText="An unique ID for the sensor"
                        variant="outlined"
                        name="sensor_uid"
                    />
                    <TextField
                        fullWidth
                        label="Date"
                        variant="outlined"
                        defaultValue={Moment().format()}
                        helperText="Current date"
                        name="date"
                        margin="normal"
                        disabled
                    />
                    <TextField
                        fullWidth
                        label="Data"
                        defaultValue={`Some data given at ${Moment().format()}`}
                        helperText="Sensor information to save inside EOS"
                        name="data"
                        variant="outlined"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Submit
                        </Button>
                    <Box mt={8} color="success.main">
                        {success && <p>Success</p>}
                    </Box>
                    <Box mt={8} color="error.main">
                        {error && <pre>{error}</pre>}
                    </Box>
                </form>

                <Backdrop className={classes.backdrop} open={BackdropOpen} onClick={this.handleBackdropClose}>
                    <CircularProgress color="inherit" />
                </Backdrop>
            </Container>
        );
    }
}

export default withStyles(useStyles)(SensorLog)
