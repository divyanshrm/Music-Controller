import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Room = () => {
    const [roomState, setRoomState] = useState({
        votesToSkip: 2,
        guestCanPause: false,
        isHost: false,
    });

    // Use useParams hook to get the roomCode parameter
    const { roomCode } = useParams();

    // Simulate componentDidMount to fetch data
    useEffect(() => {
        // Fetch data based on roomCode and update state
        // Example: You might want to make an API request here

        // Example data update (replace with your data fetching logic)
        fetch('/api/get-room' + "?code=" + roomCode)
        .then((response)=> 
          response.json()).then((data)=>{
              setRoomState({
                  votesToSkip:data.votes_to_skip,
                  guestCanPause:data.guest_can_pause,
                  isHost: data.is_host,
              })
          });
    }, [roomCode]); // Trigger the effect whenever roomCode changes
 

    return (
        <>
            <div>
                <h1>Room Code:{roomCode}</h1>
                <p>Votes: {roomState.votesToSkip}</p>
                <p>Guest can pause: {roomState.guestCanPause.toString()}</p>
                <p>Is Host: {roomState.isHost.toString()}</p>
            </div>
        </>
    );
};

export default Room;
