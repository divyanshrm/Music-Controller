import React, { Component } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RoomJoinPage from "./RoomJoinPage";
import CreateRoomPage from "./CreateRoomPage";
import Room from "./Room";
export default class HomePage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Router>
        <Routes>
          <Route path='/' element={<p>This is the Home page</p>} />
          <Route path='/join' element={<RoomJoinPage />}/>
          <Route path='/create' element={<CreateRoomPage />}/>
          <Route path='/room/:roomCode' element={<Room />}/>
          {/* Add other Route components here if needed */}
        </Routes>
      </Router>
    );
  }
}