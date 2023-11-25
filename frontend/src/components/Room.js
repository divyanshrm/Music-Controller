import React, { useState, useEffect } from 'react';
import Alert from '@material-ui/lab/Alert';
import { useParams } from 'react-router-dom';
import { Grid, FormControl, FormLabel, Radio, RadioGroup, FormHelperText, FormControlLabel, TextField, Button,Typography,ButtonGroup} from '@material-ui/core';
import { Link ,useNavigate} from 'react-router-dom';
import CreateRoomPage from './CreateRoomPage';
import {Collapse} from '@material-ui/core';
const Room = (props) => {
    const navigate = useNavigate();
    const [msg,setmsg]=useState("")
    const [roomState, setRoomState] = useState({
      votesToSkip: 2,
      guestCanPause: false,
      isHost: false,
      showSettings: false,
      spotifyAuthenticated:false,
      song:{},
    });
    // Set up a timeout to automatically collapse the message after 2000 milliseconds (2 seconds)
    useEffect(() => {
      if (msg.length>0){
     
      const timeoutId = setTimeout(() => {
        setmsg("");
      }, 3000);
  
      // Cleanup the timeout if the component unmounts or the message is manually closed
      return () => clearTimeout(timeoutId);}
    }, [msg]);
    const { roomCode } = useParams();
    const get_room_details=()=>{
        fetch('http://127.0.0.1:8000/api/get-room' + "?code=" + roomCode)
        .then((response) => response.json())
        .then((data) => {
          setRoomState((prevRoomState) => ({
            ...prevRoomState,
            votesToSkip: data.votes_to_skip,
            guestCanPause: data.guest_can_pause,
            isHost: data.is_host,
          }));
          if (data.is_host){
          authenicateSpotify();
          }
        }).then(getCurrentSong());
  
      props.updateRoomCallback();
    }
    useEffect(() => {
      get_room_details();
    }, [roomCode]);
    
    const updateCallBack = (v,g) => {
        const csrfToken = document.cookie
        .split('; ')
        .find((row) => row.startsWith('csrftoken='))
        .split('=')[1];
  
      const requestOptions = {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify({
          code:roomCode,
          votes_to_skip: v,
          guest_can_pause: g,
        }),
      };
  
      fetch('/api/update-room', requestOptions)
        .then((response) => {
          if (response.ok){
            return true;
          }
          return false;
        }).then((flag)=>{
            get_room_details()
            if (flag){
              setmsg("ROOM UPDATED SUCCESSFULLY")
            }
            else{
              setmsg("OOPS! SOMETHING WENT WRONG")
            }
        });
        
    };
  
    const updateShowSettings = (value) => {
      setRoomState((prevRoomState) => ({
        ...prevRoomState,
        showSettings: value,
      }));
    };
  
    const render_settings = () => {
      return (
        <Grid item xs={12} align='center'>
          <ButtonGroup disableElevation variant='contained' color='primary'>
            {roomState.showSettings ? (<Button color='secondary' onClick={() => updateShowSettings(false)}> Close Settings </Button>):(
            <Button color='secondary' onClick={() => updateShowSettings(true)}> Settings </Button>)}
            
          </ButtonGroup>

        </Grid>
      );
    };
  
    const authenicateSpotify=()=>{
      fetch('/spotify/is-authenticated').then((response)=> response.json()).then((data)=>{
        setRoomState((prevRoomState) => ({
          ...prevRoomState,
          spotifyAuthenticated:data.status
        }))
        if (!data.status){
          fetch('/spotify/get-auth-url').then((response)=>response.json()).then((data)=>{
            window.location.replace(data.url)
          })
        }
      })
    }
    const getCurrentSong=()=>{
      fetch('/spotify/current-song').then((response)=>{
        if (!response.ok){
          return {}
        }else{
          return response.json()
        }
      }).then((data)=>setRoomState((prevRoomState) => ({
        ...prevRoomState,
        song:data
      })));
    }
    useEffect(() => {
      const intervalId = setInterval(() => {
        getCurrentSong();
      }, 2000);
  
      // Cleanup the interval when the component unmounts
      return () => clearInterval(intervalId);
    }, []);
    // Inside the Room component

  const renderCreateRoomPage = () => {
    if (roomState.showSettings) {
      return (
        <Grid container spacing={1}>
          <Grid item xs={12} align='center'>
          <Collapse in={msg.length > 0 && msg.includes('OOP')}>
            <Alert severity='error'>{msg}</Alert>
          </Collapse>
          <Collapse in={msg.length > 0 && msg.includes('SUCC')}>
            <Alert>{msg}</Alert>
          </Collapse> 
          </Grid>

          <Grid item xs={12} align='center'>
            {/* Pass the necessary props to CreateRoomPage */}
            <CreateRoomPage

              update={true}
              votesToSkip={roomState.votesToSkip}
              isHost={roomState.isHost}
              guestCanPause={roomState.guestCanPause}
              roomCode={roomCode}
              updateCallBack={updateCallBack}
            />
          </Grid>
          <Grid item xs={12} align='center'>
            <ButtonGroup disableElevation variant='contained' color='primary'>
              <Button color='secondary' onClick={() => updateShowSettings(false)}> Close Settings </Button>
            </ButtonGroup>
          </Grid>
        </Grid>
      );
    }
    return null;
  };


    const handle_leave = () => {
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
      };
  
      fetch('/api/leave-room', requestOptions)
        .then((response) => response.json())
        .then((data) => {
          props.leaveRoomCallback();
          navigate('/');
        });
    };
  
    return (
      <>
        <Grid container spacing={1}>
        {!roomState.showSettings ? (<><Grid item xs={12} align="center">
            <Typography variant='h4' component='h4'>
              Room Code: {roomCode}
            </Typography>
          </Grid>

          <Grid item xs={12} align="center">

          </Grid></>):null}

          {(roomState.isHost)&&(!roomState.showSettings) ? render_settings() : null}
          {renderCreateRoomPage()} {/* Render the CreateRoomPage conditionally */}

          <Grid item xs={12} align="center">
            
            <ButtonGroup disableElevation variant='contained' color='primary'>
              <Button color='primary' onClick={handle_leave}> Leave </Button>
              <Button color='primary' onClick={()=>console.log(roomState)}> Leave </Button>
            </ButtonGroup>
          </Grid>
          <Grid item xs={12} align="center">
            
          <Typography variant='h6' component='h6'>
              {roomState.song.title}
            </Typography>
          </Grid>
        </Grid>
      </>
    );
  };
  
  export default Room;
  