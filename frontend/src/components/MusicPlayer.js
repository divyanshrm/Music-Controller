import React from "react";
import { Grid, Typography, Card, IconButton, LinearProgress } from "@material-ui/core";
import { PlayArrow as PlayArrowIcon, SkipNext as SkipNextIcon, Pause as PauseIcon } from "@material-ui/icons";

const skipSong = () => {
    const csrfToken = document.cookie
        .split('; ')
        .find((row) => row.startsWith('csrftoken='))
        .split('=')[1];
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json",
    'X-CSRFToken': csrfToken,},
  };
  fetch("/spotify/skip", requestOptions);
};

const pauseSong = () => {
    const csrfToken = document.cookie
        .split('; ')
        .find((row) => row.startsWith('csrftoken='))
        .split('=')[1];
  
      const requestOptions = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        }}
  
  fetch("/spotify/pause", requestOptions);
};

const playSong = () => {
    const csrfToken = document.cookie
    .split('; ')
    .find((row) => row.startsWith('csrftoken='))
    .split('=')[1];

    const requestOptions = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        }}
  fetch("/spotify/play", requestOptions);
};

 export const MusicPlayer = (props) => {
  return (
    <>
      <Card>
        <Grid container alignItems="center">
          <Grid item align="center" xs={4}>
            <img src={props.image_url} height="100%" width="100%" alt="Album Cover" />
          </Grid>
          <Grid item align="center" xs={8}>
            <Typography component="h5" variant="h5">
              {props.title}
            </Typography>
            <Typography color="textSecondary" variant="subtitle1">
              {props.artist}
            </Typography>
            <div>
              <IconButton
                onClick={() => {
                  props.is_playing ? pauseSong() : playSong();
                }}
              >
                {props.is_playing ? <PauseIcon /> : <PlayArrowIcon />}
              </IconButton>
              <IconButton onClick={() => skipSong()}>
                {props.votes} / {props.votes_required}
                <SkipNextIcon />
              </IconButton>
            </div>
          </Grid>
        </Grid>
        <LinearProgress variant="determinate" value={props.songProgress} />
      </Card>
    </>
  );
};

