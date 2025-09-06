import { Component } from 'react';
import React, { useState, useEffect } from 'react';
import Grid from "@mui/material/Grid";   
import LinearProgress from "@mui/material/LinearProgress"; 
import IconButton from  "@mui/material/IconButton"; 
import Card from "@mui/material/Card";             
import Typography from "@mui/material/Typography";  
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import Icon from '@mui/material/Icon';

export default function MusicPlayer({ song }) {
  // If no song → return early before using song at all
  if (!song) {
    return (
      <Card>
        <Typography variant="h6" component="h6">
          No song playing
        </Typography>
      </Card>
    );
  }

  // ✅ Safe to use song here, because we already know it exists
  const songProgress = (song.time / song.duration) * 100;
  //console.log(songProgress);

  return (
    
    <Card>
      <Grid container direction="column" alignItems="center">
        <Grid item align="center" xs={4}>
          <img src={song.image_url} height="80%" width="80%" alt="Album cover" />
        </Grid>
        <Grid item align="center" xs={8}>
          <Typography component="h5" variant="h5">
            {song.title}
          </Typography>
          <Typography color="textSecondary" variant="subtitle1">
            {song.artist}
          </Typography>
          <div>
            <IconButton>
              {song.is_playing ? <PauseIcon /> : <PlayArrowIcon />}
            </IconButton>
            <IconButton>
              <SkipNextIcon />
            </IconButton>
          </div>
        </Grid>
      </Grid>
      <LinearProgress variant="determinate" value={songProgress} />
    </Card>
  );
}