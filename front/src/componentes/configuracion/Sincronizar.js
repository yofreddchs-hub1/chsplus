import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {conexiones} from '../../procesos/servicios'
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function Sincronizar() {
    const [baselocal, setBaselocal] = React.useState(false);
    const [destino, setDestino] = React.useState('');
    const [baselocald, setBaselocald] = React.useState(false);
    const Informacion = async()=>{
        const Respuesta= await conexiones.Infodatabase();
        if (Respuesta.Respuesta==='Ok'){
            setBaselocal(Respuesta.URI);
        }
    }
    const Destino = (event)=>{
        let {name, value} = event.target;
        console.log(name,value)
        setDestino(value);
    }
    const InformacionD = async ()=>{
        const Respuesta= await conexiones.InfodatabaseD(destino);
        if (Respuesta.Respuesta==='Ok'){
            setBaselocald(Respuesta.URI);
        }
    }
    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <Item>
                        <Button variant="contained" onClick={Informacion}>Información</Button>
                        <Typography variant="h6" gutterBottom>
                            {baselocal}
                        </Typography>
                    </Item>
                </Grid>
                <Grid item xs={6}>
                    <Item>
                        <Stack direction="row" spacing={2}>
                            <TextField 
                                        size="small" id="standard-basic" 
                                        label="Dirección Server" variant="standard" sx={{ width: '45ch' }}
                                        onChange ={Destino}
                            />
                            <Button variant="contained" onClick={InformacionD}>Información</Button>
                        </Stack>
                        <Typography variant="h6" gutterBottom>
                            {baselocald}
                        </Typography>
                    </Item>
                </Grid>
                <Grid item xs={4}>
                <Item>xs=4</Item>
                </Grid>
                <Grid item xs={8}>
                <Item>xs=8</Item>
                </Grid>
            </Grid>
        </Box>
    );
}
