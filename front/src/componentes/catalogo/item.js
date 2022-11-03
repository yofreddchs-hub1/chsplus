import * as React from 'react';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';

const Img = styled('img')({
  margin: 'auto',
  display: 'block',
  maxWidth: '100%',
  maxHeight: '100%',
});

export default function Item(props) {
    console.log(props)
  return (
    <Paper
      sx={{
        p: 2,
        margin: 'auto',
        // maxWidth: 500,
        height:250,
        flexGrow: 1,
        backgroundColor: (theme) =>
          theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
      }}
    >
      <Grid container spacing={1}>
        <Grid item>
          <ButtonBase sx={{ height: '90%' }}>
            <Img alt="complex" src={props.valores.imagen} />
          </ButtonBase>
        </Grid>
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column" spacing={1}>
            <Grid item xs>
              <Typography gutterBottom variant="subtitle1" component="div">
                {props.valores.nombre}
              </Typography>
              <Typography variant="body2" gutterBottom >
                Full resolution 1920x1080 • JPEG
              </Typography>
              <Typography variant="body2" color="text.secondary">
                CODIGO: {props.valores.codigo}
              </Typography>
            </Grid>
            <Grid item>
              <Typography sx={{ cursor: 'pointer' }} variant="body2">
                Remove
              </Typography>
            </Grid>
          </Grid>
          
        </Grid>
      </Grid>
    </Paper>
  );
}
