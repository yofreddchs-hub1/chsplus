import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Logo from '../../../imagenes/noexiste.png'
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  height:window.innerHeight * 0.8,

}));

export default function Noexiste() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2} justifyContent="center" alignItems="center">
        <Grid item xs={2}>
        
        </Grid>
        <Grid item xs={8}>
          
            <img
                src={Logo}
                
                alt={'No Existe'}
                loading="lazy"
            />
          
        </Grid>
        <Grid item xs={2}>
          
        </Grid>
        
      </Grid>
    </Box>
  );
}
