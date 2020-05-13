import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
// import Typography from '@material-ui/core/Typography';
import Title from './Title';

import { ApiService } from 'services';

const useStyles = (theme) => ({
    depositContext: {
        flex: 1,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
});

class About extends Component {
    constructor(props) {
        // Inherit constructor
        super(props);

        this.state = {
            abi: null,
            success: false,
            error: false,

        }

        // Bind functions
        this.loadAbi = this.loadAbi.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleViewContract = this.handleViewContract.bind(this);
        // Call `loadAbi` before mounting the app
        this.loadAbi();
    }

    // Get latest user object from blockchain
    loadAbi() {
        // Extract `setUser` of `UserAction` and `user.name` of UserReducer from redux
        const { user: { name } } = this.props;

        // Send request the blockchain by calling the ApiService,
        // Get the user object and store the `win_count`, `lost_count` and `game_data` object
        return ApiService.getAbiInfo(name).then(data => {
            this.setState({ abi: data.abi })
        }).catch((err) => {
            console.log(err)
        });
    }

    // Handle form submission to call api
    handleSubmit(event) {
        // Stop the default form submit browser behaviour
        event.preventDefault();
        const form = {
            eos_api_url: event.target.elements.eos_api_url.value,
        }
        localStorage.setItem("REACT_APP_EOS_HTTP_ENDPOINT", form.eos_api_url);
        this.setState({ success: true })
    }

    handleViewContract(rc) {
        return () => {
            console.log(rc)
            alert(rc);
        }
    }

    render() {
        const { classes } = this.props;
        const { error, success, abi } = this.state;
        var handleViewContract = this.handleViewContract;
        console.log(abi)
        return (
            <Container component="main">
                <Title>About</Title>
                <form className={classes.form} onSubmit={this.handleSubmit}>
                    <TextField
                        fullWidth
                        label="Contract Name"
                        variant="outlined"
                        value={process.env.REACT_APP_EOS_CONTRACT_NAME}
                        margin="normal"
                        disabled
                    />
                    <TextField
                        fullWidth
                        label="RPC API URL"
                        variant="outlined"
                        defaultValue={process.env.REACT_APP_EOS_HTTP_ENDPOINT}
                        margin="normal"
                        name="eos_api_url"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >Submit
                    </Button>
                    <Box mt={8} color="success.main">
                        {success && <p>Success</p>}
                    </Box>
                    <Box mt={8} color="error.main">
                        {error && <pre>{error}</pre>}
                    </Box>
                </form>
                {abi ? (
                    <div>
                        <Title >Contract definitons <small>(v={abi.version})</small></Title>
                        Actions<ul>
                            {abi.actions.map(function (object) {
                                return <li key={object.name}> {object.name} (<small><Button
                                color="primary"
                                onClick={handleViewContract(object.ricardian_contract)}
                                >
                                    Ricardian Contract Template
                                </Button></small>)</li>;
                            })}
                        </ul>
                        Data Tables<ul>
                            {abi.tables.map(function (object) {
                                return <li key={object.name}> {object.name} </li>;
                            })}
                        </ul>
                    </div>
                ) :
                    (<p>Loading</p>)}

            </Container>
        );
    }
}

export default withStyles(useStyles)(About)