import * as React from 'react';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Logo from '../../imagenes/logo1.png'

export default function Cargando(props) {
  const {open, Fondo, Config} = props;
  return open ? (
    <div style={{
        height:'100%', width:'100%', 
        backgroundColor: Fondo ? Fondo : Config ? Config.Estilos.Fondo_pantalla : '#7ABC32', opacity:0.6,
        position: 'absolute', top:0,
        display:'flex', alignItems:'center', justifyContent:'center',
        zIndex:100
    }}>
        {/* <CircularProgress color="inherit" /> */}
        <div style={{alignItems:'center', justifyContent:'center', justifyItems:'center', marginTop:20}}> 
            <img
                    src={props.Logo ? props.Logo : Config && Config.Logo ? Config.Logo : Logo}
                    alt={'Cargando'}
                    loading="lazy"
                    style={{height:window.innerHeight * 0.25}}
            />
            <Box sx={{ width: '100%' }}>
            <LinearProgress color="inherit"/>
            </Box>
        </div>
      
    </div>
  ): null;
}
