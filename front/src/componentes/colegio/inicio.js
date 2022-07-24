import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import Carrusel from '../carrusel';
import Cargando from '../esperar/cargar';

import {conexiones}from '../../procesos/servicios'


// import Tabla_multiple from '../tabla/tabla_multiple';

export default class Home extends React.Component {
  constructor(props) {
      super(props);

      this.state = {
          cargando:true,
          props: this.props,
          Config:this.props.Config,
          portada:[]
          
      }
  }
 
    async componentDidMount(){
      
        let resultados= await conexiones.Leer_C(['colegio_portada'], 
            {
                'colegio_portada':{},
            }
        );
        console.log('>>>>>>>>>>>>',resultados.datos)
        if (resultados.Respuesta==='Ok'){
            this.setState({
                portada:[
                    ...resultados.datos.colegio_portada, 
                ],
                cargando:false
            })
        }
        this.setState({cargando:false})
    }

    static getDerivedStateFromProps(props, state) {

        if (props !== state.props) {
            
        return {
            props,
            Config:props.Config,
        };
        }
        // No state update necessary
        return null;
    }

  render(){
    const {Config, portada, cargando}=this.state
    return (
        <Box sx={{ flexGrow: 1, height:'100%', ...Config.Estilos.Dialogo_cuerpo}}>
            <Grid container spacing={0}>
                <Grid item xs={12}>
                    <Carrusel datos={portada}/>
                </Grid>
            </Grid>
            <Cargando open={cargando}/>
        </Box>
    )
  }
}
