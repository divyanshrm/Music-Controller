import React,{useState,useEffect} from 'react';
import { BrowserRouter as Router, Routes, Route,useNavigate,Link,useLocation,Navigate } from 'react-router-dom';
import RoomJoinPage from './RoomJoinPage';
import CreateRoomPage from './CreateRoomPage';
import Room from './Room';
import {Grid,Button,ButtonGroup,Typography} from "@material-ui/core"


const HomePage = (props) => {
  const [inroom, setinroom] = useState({ inroom: false, roomCode: null });
  const clear_room=()=>{
    setinroom({
      inroom: false, roomCode: null,
    });
  }
  const update_room=async ()=>{
    try {
      const response = await fetch('/api/user-in-room');
      const data = await response.json();

      if (data.isroom) {
        setinroom((prevInRoom) => ({
          ...prevInRoom,
          inroom: data.isroom,
          roomCode: data.code,
        }));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/user-in-room');
        const data = await response.json();

        if (data.isroom) {
          setinroom((prevInRoom) => ({
            ...prevInRoom,
            inroom: data.isroom,
            roomCode: data.code,
          }));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []); // Empty dependency array means this effect runs only once after initial render


  const renderHomePage=()=>{
    return (
      <>
      <Grid container spacing={3}>
        <Grid item xs={12} align="center">
          <Typography variant='h3' component='h3'>
            House Party
          </Typography>
  
        </Grid>
        <Grid item xs={12} align="center">
          <ButtonGroup disableElevation variant='contained' color='primary'>
            <Button color='primary' to='/join' component={Link}>Join a Room</Button>
            <Button color='secondary' to='/create' component={Link}>Create a Room</Button>
          </ButtonGroup>
        </Grid>
      </Grid>
      </>
    );
  };
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If inroom has been updated, set loading to false
    setLoading(false);
  }, [inroom]);

  if (loading) {
    // You can render a loading spinner or some indication that data is being fetched
    return <div>Loading...</div>;
  }
  return (

      <Routes>
        <Route
  path='/'
  element={
    inroom.inroom ? (
      <Navigate to={`/room/${inroom.roomCode}`} />
    ) : (
      renderHomePage()
    )
  }
/>

        <Route path='/join' element={<RoomJoinPage />} />
        <Route path='/create' element={<CreateRoomPage />} />
        <Route  path='/room/:roomCode' element={<Room {...props} leaveRoomCallback={clear_room} updateRoomCallback={update_room} inroom={inroom}/>} />
        {/* Add other Route components here if needed */}
      </Routes>

  );
};

export default HomePage;
