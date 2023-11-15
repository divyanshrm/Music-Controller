import React, {Component} from "react";
import { render } from "react-dom";
import { Grid, FormControl, FormLabel, Radio, RadioGroup, FormHelperText, FormControlLabel,TextField,Button} from '@material-ui/core';
import { Link } from "react-router-dom";


export default class CreateRoomPage extends Component{
    defaultVotes=2
     constructor(props){
        
        super(props);
        this.defaultVotes=2;
        this.state={
            votesToSkip: this.defaultVotes,
            guestCanPause:true,
        };
        this.handle_submit=this.handle_submit.bind(this);
        this.handleGuestCanPause=this.handleGuestCanPause.bind(this);
        this.handleVotesChange=this.handleVotesChange.bind(this);
     }
     handle_submit = () => {
        // Get the CSRF token from the cookie
        const csrfToken = document.cookie
            .split("; ")
            .find(row => row.startsWith("csrftoken="))
            .split("=")[1];
    
        const requestOptions = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
            body: JSON.stringify({
                votes_to_skip: this.state.votesToSkip,
                guest_can_pause: this.state.guestCanPause,
            }),
        };
        
        fetch("/api/create_room", requestOptions)
            .then((response) => response.json());
    }
    
    
     
     handleVotesChange(e){
        this.setState({
            votesToSkip:e.target.value
        })
     }
     handleGuestCanPause(e){
        let guestCanPause;
        if (e.target.value === "true") {
            this.setState({
                guestCanPause:true,
            });
        } else {
            this.setState({
                guestCanPause:false,
            });
}

     }
     
     render(){
        return (
        <Grid container spacing={1}>
    <Grid item xs={12} align="center">
        <FormControl component="fieldset">
            <FormHelperText>
                <div align="center">Guest Control of Playback State</div>
            </FormHelperText>
            <RadioGroup row defaultValue="true" onChange={this.handleGuestCanPause}>
                <FormControlLabel
                    value='true'
                    control={<Radio color="primary" />}
                    label="Play/Pause"
                    labelPlacement="bottom"
                />
                <FormControlLabel
                    value="false"
                    control={<Radio color="secondary" />}
                    label="No Control"
                    labelPlacement="bottom"
                />
            </RadioGroup>
        </FormControl>
        
    </Grid>
    <Grid item xs={12} align="center">
        <FormControl>
            <TextField 
            required={true} 
            defaultValue={this.defaultVotes}
            type="number"
            inputProps={{
                min:1,
                style:{
                    textAlign :"centre",
                },
            }}
            onChange={this.handleVotesChange}
            />
            <FormHelperText>
                <div align="center">
                    Votes Requred to Skip
                </div>
            </FormHelperText>
        </FormControl>
    </Grid>
    <Grid item xs={12} align="center">
        <Button color="primary" variant="contained" onClick={this.handle_submit}>Create A Room</Button>
    </Grid>
    <Grid item xs={12} align="center">
        <Button color="secondary" variant="contained" to="/" component={Link}>Back</Button>
    </Grid>
</Grid>
        
        
        
        
        
    );
     }
}