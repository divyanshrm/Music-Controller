import React, { useState,useEffect } from 'react';
import { Grid, FormControl, FormLabel, Radio, RadioGroup, FormHelperText, FormControlLabel, TextField, Button,Typography } from '@material-ui/core';
import { Link, useNavigate } from 'react-router-dom';
import Alert from "@material-ui/lab/Alert"
import {Collapse} from '@material-ui/core';
const CreateRoomPage = (props) => {
  const defaultVotes = 2;
  const [votesToSkip, setVotesToSkip] = useState(defaultVotes);
  const [guestCanPause, setGuestCanPause] = useState(true);
  const [msg,setmsg]=useState("")
  const navigate = useNavigate(); // Use useNavigate instead of useHistory
  
  const handle_submit = () => {
    // Get the CSRF token from the cookie
    const csrfToken = document.cookie
      .split('; ')
      .find((row) => row.startsWith('csrftoken='))
      .split('=')[1];

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
      },
      body: JSON.stringify({
        votes_to_skip: votesToSkip,
        guest_can_pause: guestCanPause,
      }),
    };

    fetch('/api/create_room', requestOptions)
      .then((response) => response.json())
      .then((data) => {
        navigate('/room/' + data.code); // Redirect using useNavigate
      });
  };

  const handleVotesChange = (e) => {
    setVotesToSkip(e.target.value);
  };

  const handleGuestCanPause = (e) => {
    setGuestCanPause(e.target.value === 'true');
  };
  const render_submit_button=()=>{
    if (!props.update){ return (
      <Button color="primary" variant="contained" onClick={handle_submit}>
      Create Room
      </Button>)
    }
    else{
      return ( <Button color="primary" variant="contained" onClick={()=>props.updateCallBack(votesToSkip,guestCanPause)}>
      Update Room
      </Button>)
    }
  };
  
  return (
    <Grid container spacing={1}>

        <Grid item xs={12} align="center"> 
            <Typography variant="h4" component="h4">{props.update ? (<>Update Room Settings</>):(<>Create a Room</>)}</Typography>
         </Grid>
      <Grid item xs={12} align="center">
        <FormControl component="fieldset">
          <FormHelperText>
            <div align="center">Guest Control of Playback State</div>
          </FormHelperText>
          <RadioGroup row defaultValue={props.update ? (props.guestCanPause.toString()):(true)} onChange={handleGuestCanPause}>
            <FormControlLabel
              value="true"
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
            defaultValue={props.update ? (props.votesToSkip):(defaultVotes)}
            type="number"
            inputProps={{
              min: 1,
              style: {
                textAlign: 'center',
              },
            }}
            onChange={handleVotesChange}
          />
          <FormHelperText>
            <div align="center">Votes Required to Skip</div>
          </FormHelperText>
        </FormControl>
      </Grid>
      <Grid item xs={12} align="center">

        {render_submit_button()}
      </Grid>

    </Grid>
  );
};

export default CreateRoomPage;
