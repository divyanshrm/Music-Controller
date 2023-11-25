import React, { useState, useEffect } from 'react';
import { Grid, FormControl, FormLabel, Radio, RadioGroup, FormHelperText, FormControlLabel, TextField, Button,Typography } from '@material-ui/core';
import { Link, useNavigate } from 'react-router-dom';
const RoomJoinRoomPage = () => {
   const [state,setState]=useState({roomCode:"",error:""});
   const navigate = useNavigate();
     const _handleTextFieldChange=(e) =>{
         setState({
            roomCode:e.target.value
         })
      }
      const _roomButtonPressed=()=>{
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
        code:state.roomCode,
      }),
    };

    fetch('/api/join-room'+ "?code=" +state.roomCode, requestOptions)
      .then((response) => { if (response.ok){
         navigate('/room/' + state.roomCode);
      }
   else{
      setState({error:"Room not found. "});
   };});
      };
     return(
        <Grid container spacing={1} alignItems="center">
         <Grid item xs={12} align="center"> 
            <Typography variant="h4" component="h4">Join a Room</Typography>
         </Grid>

         <Grid item xs={12} align="center">
        <FormControl>
          <TextField
            error={state.error}
            label="Code"
            placeholder="Enter Room Code"
            value={state.roomCode}
            helperText={state.error}
            variant="outlined"
            onChange={_handleTextFieldChange}
            InputLabelProps={{ shrink: true }}  
          />

        </FormControl>
      </Grid>
      <Grid item xs={12} align="center">
      <Grid item xs={12} align="center">
         <Button variant="contained" color="primary" onClick={_roomButtonPressed}>Enter Room</Button>
      </Grid>
      </Grid>
      <Grid item xs={12} align="center">
         <Button variant="contained" color="secondary" to="/" component={Link}>Back</Button>
      </Grid>
      </Grid>
     );};
export default RoomJoinRoomPage;
