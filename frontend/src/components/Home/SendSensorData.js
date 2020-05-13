import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
// import Link from '@material-ui/core/Link';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';
import Modal from '@material-ui/core/Modal';
import { RicardianContractFactory } from 'ricardian-template-toolkit'

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
    },
    contractDocument: {
        padding: "10px",
        border: "black thin solid",
        background: "#e8e9ff",
        marginBottom: "10px",
        "& .variable": {
            display: "inline",
            color: "DarkRed",
            fontStyle: "italic",
            fontWeight: "bold",
        }
    },
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
            form: false,
            abi: null,
            open: false,
            BackdropOpen: false,
            success: false,
            error: false,
            confirm: false,
            ricardian_body: "",
        }
        // Bind functions
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleBackdropClose = this.handleBackdropClose.bind(this);
        this.handleBackdropOpen = this.handleBackdropOpen.bind(this);
        this.getTnxDetails = this.getTnxDetails.bind(this);
        this.loadAbi = this.loadAbi.bind(this);


        this.loadAbi();
    }

    handleBackdropClose = () => {
        this.setState({ BackdropOpen: false });
    };
    handleBackdropOpen = () => {
        this.setState({ BackdropOpen: false });
    };

    getTnxDetails(tnx_id) {
        return ApiService.getTnx(tnx_id)
            .then((tnx_data) => {
                console.log(tnx_data);
            })
            .catch(err => {
                console.error(err);
            });
    }

    // Handle form submission to call api
    handleSubmit(event) {
        // Stop the default form submit browser behaviour
        event.preventDefault();
        var { confirm, form, abi } = this.state;
        if (!confirm) {
            const { user } = this.props;
            const formdata = {
                sensor_uid: event.target.elements.sensor_uid.value,
                date: event.target.elements.date.value,
                data: event.target.elements.data.value,
                username: user.name
            }
            this.setState({ ricardian_body: this.makeRicardian(formdata, abi) });
            this.setState({ open: true });
            this.setState({ confirm: true });
            this.setState({ form: formdata });
        } else {
            this.setState({ open: false });
            this.handleBackdropOpen();
            // Extract `form` state
            ApiService.sendSensorData(form)
                .then((tnx) => {
                    console.log(tnx)
                    this.getTnxDetails(tnx.transaction_id);
                    this.handleBackdropClose();
                    this.setState({ error: false });
                    this.setState({ success: true });
                    this.setState({ confirm: false });
                    this.setState({ form: false });
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
    }

    makeRicardian(form, abi) {
        const factory = new RicardianContractFactory()
        const config = {
            abi: abi,
            transaction: {
                "actions": [
                    {
                        "account": "sensordapp",
                        "name": "log",
                        "authorization": [
                            {
                                "actor": form.username,
                                "permission": "active"
                            }
                        ],
                        "data": {
                            "username": form.username,
                            "sensor_uid": form.sensor_uid,
                            "date": form.date,
                            "data": form.data
                        },
                    }
                ]
            },
            actionIndex: 0,
            // Optional - defaults to 3
            // maxPasses: 3,
            // Optional - developer flag - if true ignore errors if a variable
            // is specified in the contract but no value is found to substitute
            allowUnusedVariables: true
        }
        const ricardianContract = factory.create(config)

        const metadata = ricardianContract.getMetadata()
        const body = ricardianContract.getHtml()
        return body;
    }

    // Get latest user object from blockchain
    loadAbi() {
        // Extract `setUser` of `UserAction` and `user.name` of UserReducer from redux
        const { user: { name } } = this.props;

        // Send request the blockchain by calling the ApiService,
        // Get the user object and store the `win_count`, `lost_count` and `game_data` object
        return ApiService.getAbiInfo(name).then(data => {
            this.setState({ abi: data.abi })
            console.log(data.abi)
        }).catch((err) => {
            console.log(err)
        });
    }

    render() {
        Moment.locale('fr');
        const { classes, user } = this.props;
        const { confirm, open, ricardian_body, error, success, BackdropOpen } = this.state;

        return (
            <Container component="main" maxWidth="lg">
                <Title>Add Sensor Log <small>(Using user: {user.name})</small></Title>
                <form className={classes.form} onSubmit={this.handleSubmit}>
                    {!confirm && (<div>
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
                            Open Ricardian Contract
                    </Button>
                    </div>)}
                    <Box mt={2} color="">
                        {open && <div className={classes.contractDocument} dangerouslySetInnerHTML={{ __html: ricardian_body }}></div>}
                    </Box>
                    {confirm && (
                        <div><Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            mb={8}
                        >
                            Accept &amp; Submit
                    </Button>
                        </div>)}
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
