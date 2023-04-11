import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Scrollbars from '../herramientas/scrolbars';
import {conexiones} from '../../procesos/servicios'
import moment from 'moment';
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#051E34' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function Sincronizar() {
    const [baselocal, setBaselocal] = React.useState(false);
    const [datalocal, setDatalocal] = React.useState([]);
    const [dataselect, setDataselect] = React.useState(0);
    const [datosS, setDatosS] = React.useState({});
    const [destino, setDestino] = React.useState('');
    const [baselocald, setBaselocald] = React.useState(false);
    const Informacion = async()=>{
        const Respuesta= await conexiones.Infodatabase();
        let database= await conexiones.DataBase();
        if (Respuesta.Respuesta==='Ok'){
            setBaselocal(Respuesta.URI);
            setDatalocal(database.models);
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
    const Seleccionar = async(data, select, dest) =>{
        console.log(data, select, dest)
        const resp= await conexiones.Infodatos(data,dest );
        console.log(resp);
        if (resp.Respuesta==='Ok'){
            console.log(resp.datoorigen, resp.datodestino)
            setDatosS({origen: {...resp.datoorigen}, destino:{...resp.datodestino}});
        }
        setDataselect(select)
    }
    const Listado = (data, select) =>{
        
        return (
            <Scrollbars sx={{height:window.innerHeight * 0.68}}>
                <List>
                    {data.map((val,i)=>
                        
                        <ListItem  key={val+i} component="div" disablePadding>
                            <ListItemButton selected={select === i } onClick={()=>Seleccionar(data[i],i,destino)}>
                                <ListItemText primary={`${val}`} />
                            </ListItemButton>
                        </ListItem>    
                    )}

                </List>
            </Scrollbars>
        )
    }

    const Datos = (data, select, datos) =>{
        console.log(datos)
        return(
            <Scrollbars sx={{height:window.innerHeight * 0.68}}>
                
                    <Stack 
                            direction="row" 
                            justifyContent="center"
                            spacing={2}
                    >
                        <Item sx={{p: 2, width:'50%'}}>
                            <Typography noWrap>LOCAL</Typography>
                            <Typography noWrap>Registros {datos.origen && datos.origen.total ? datos.origen.total : 0}</Typography>
                            <Typography noWrap>Actualizado {datos.origen && datos.origen.ultimo && datos.origen.ultimo.length!==0 ? moment(datos.origen.ultimo[0].updatedAt).format('DD/MM/YYYY HH:mm') : ''}</Typography>
                        </Item>
                        <Item sx={{p: 2, width:'50%'}}>
                            <Typography noWrap>DESTINO</Typography>
                            <Typography noWrap>Registros {datos.destino && datos.destino.total ? datos.origen.total : 0}</Typography>
                            <Typography noWrap>Actualizado {datos.destino && datos.destino.ultimo && datos.destino.ultimo.length!==0 ? moment(datos.destino.ultimo[0].updatedAt).format('DD/MM/YYYY HH:mm') : ''}</Typography>
                        </Item>
                        
                    </Stack>
                
            </Scrollbars>
        )
    } 
    return (
        <Scrollbars sx={{ flexGrow: 1, height:window.innerHeight * 0.86 }}>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <Item>
                        <Button variant="contained" onClick={Informacion}>Información</Button>
                        <Typography variant="h6" gutterBottom noWrap>
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
                                        value={destino}
                                        onChange ={Destino}
                            />
                            <Button variant="contained" onClick={InformacionD}>Información</Button>
                        </Stack>
                        <Typography variant="h6" gutterBottom noWrap>
                            {baselocald}
                        </Typography>
                    </Item>
                </Grid>
                <Grid item xs={4}>
                    <Item>{Listado(datalocal, dataselect)} </Item>
                </Grid>
                <Grid item xs={8}>
                    <Item>{Datos(datalocal, dataselect, datosS)}</Item>
                </Grid>
            </Grid>
        </Scrollbars>
    );
}
