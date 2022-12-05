import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import MP from './materiaprima';
import ProduccionDia from './producciondia';
import Empaques from './empaques';
import PT from './productoterminado';
import ProduccionObrero from './produccion_obrero';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function Dashboard(props) {
  
  return (
    <Box sx={(theme) => ({ flexGrow: 1, 
        height:'100%',
        overflow: 'hidden auto',
        '&::-webkit-scrollbar': { height: 10, width:10, WebkitAppearance: 'none' },
        '&::-webkit-scrollbar-thumb': {
            borderRadius: 8,
            border: '2px solid',
            borderColor: theme.palette.mode === 'dark' ? '' : '#E7EBF0',
            backgroundColor: 'rgba(0 0 0 / 0.5)',
        },
    })}
    >
      <Grid container spacing={0.5}>
        <Grid xs={4}>
            <Item elevation={6}>
                <MP />
            </Item>
        </Grid>
        <Grid xs={8}>
          <Item elevation={6}>
            <ProduccionDia />
          </Item>
        </Grid>
        <Grid xs={4}>
          <Item elevation={6}>
            <Empaques />
          </Item>
        </Grid>
        <Grid xs={8}>
          <Item elevation={6}>
            <PT />
          </Item>
        </Grid>
        <Grid xs={12}>
          <Item elevation={6}>
            <ProduccionObrero/>
          </Item>
        </Grid>
        
      </Grid>
    </Box>
  );
}
