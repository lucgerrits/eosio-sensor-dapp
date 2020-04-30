import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
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
            abi: null
        }

        // Bind functions
        this.loadAbi = this.loadAbi.bind(this);
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

    render() {
        const { classes } = this.props;
        const { abi } = this.state;
        console.log(abi)
        return (
            <Container component="main">
                <Title>About</Title>
                <form className={classes.form} autoComplete="off">
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
                        value={process.env.REACT_APP_EOS_HTTP_ENDPOINT}
                        margin="normal"
                        disabled
                    />
                </form>
                {abi ? (
                    <div>
                        <Title >Contract definitons <small>(v={abi.version})</small></Title>
                        Actions<ul>
                            {abi.actions.map(function (object) {
                                return <li key={object.name}> {object.name} </li>;
                            })}
                        </ul>
                        Tables<ul>
                            {abi.tables.map(function (object) {
                                return <li key={object.name}> {object.name} </li>;
                            })}
                        </ul>
                        Ricardian contract<ul>
                            N/A
                            {/* {abi.actions.map(function (object) {
                                return <li key={object.name}> {object.name} </li>;
                            })} */}
                        </ul>
                    </div>
                ) :
                    (<p>Loading</p>)}

            </Container>
        );
    }
}

export default withStyles(useStyles)(About)