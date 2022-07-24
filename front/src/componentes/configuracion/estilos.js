import React, {Component} from 'react';
// import MailIcon from '@material-ui/icons/Mail';
// import NotificationsIcon from '@material-ui/icons/Notifications';
import CheckIcon from '@mui/icons-material/Check';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import {genera_fromulario, conexiones} from '../../procesos/servicios'
import Dialogo from '../herramientas/dialogo';
import Formulario from '../herramientas/formulario';
import { Ver_Valores, Form_todos } from '../../constantes';


const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default class Estilos extends Component {
  constructor(props) {
      super(props);

      this.state = {
          props: this.props,
          Config:this.props.Config,
          Guardar_datos:this.Guardar, 
          dialogo:{open:false}
      }
  }

  Guardar = async(valores, campos)=>{
    const {api} = this.state;
    let Config = {...Ver_Valores().config}
    if (api === undefined || api.master){
        console.log('Master')
        Config = {...Config, ...this.state.Config}
    }else{
        console.log('No master')
        Config = {...Config, ['Api_'+api.api] : this.state.Config}
    }
    console.log(Config, valores)
    Config = JSON.stringify(Config, null, 4)
    return await conexiones.Guardar_data(`${valores.path}${valores.archivo}${'.js'}`,Config)
    
    // return {Respuesta:'Ok'}
    // const nuevo = desgenera_formulario(campos)
  }

  SeleccionA = (valores)=>{
    const api = valores.resultados.apis
    if (api.master){
        console.log('Master')
        let Config = Ver_Valores().config
        this.Refrescar(Config)
    }else{
        console.log('No master')
        let Config = Ver_Valores().config['Api_'+api.api]
        this.Refrescar(Config)
    }
    this.setState({api})
  }

  Cambiar = (valores) =>{
    let {Config} = this.state;
    Config.Estilos= valores.data
    this.Refrescar(Config)
    return {Respuesta:'Ok'}
  }

  Refrescar = async(Config)=>{
    
    let formulario={
        datos:{archivo:'datos', data:Config, path:'data/',tipo:'.json'},
        titulos:{
          data:{
            label:'Estilos',
            helperText:'',
            value:Config.Estilos,
            multiline:true,
            maxRows:23,
            tipo:'Json',
            height:window.innerHeight*0.25,
            // width:window.innerWidth*0.50,
            // ...estilos.data
          },
        },
        botones:[
            {
              name:'cambiar', label:'Cambiar', title:'Cambiar estilo',
              variant:"contained", color:"primary",
              sx:{...Config.Estilos.Botones ? Config.Estilos.Botones.Aceptar : {}},
              icono:<CheckIcon />, mesperar:'Cambiando...',
              onClick:this.Cambiar
            },
            {
                name:'guardar', label:'Guardar', title:'Guardar estilo',
                variant:"contained", color:"primary",
                sx:{...Config.Estilos.Botones ? Config.Estilos.Botones.Aceptar : {}},
                icono:<CheckIcon />, mesperar:'Guardando...',
                confirmar:'true', confirmar_mensaje:'Desea modificar estilos',
                onClick:this.Guardar
            },
        ],
        config:Config
    };
    

    const muestra= {columna:2 , value:Form_todos(`Form_ejemplo`).value} 
    let formulario_muestra=await genera_fromulario({valores:{}, campos: muestra }, 2)
    formulario_muestra={...formulario_muestra,
        botones:[
            {
              name:'aceptar', label:'Aceptar', title:'Aceptar',
              variant:"contained", color:"primary",
              sx:{...Config.Estilos.Botones ? Config.Estilos.Botones.Aceptar : {}},
            },
            {
                name:'eliminar', label:'Eliminar', title:'Eliminar',
                variant:"contained", color:"primary",
                sx:{...Config.Estilos.Botones ? Config.Estilos.Botones.Eliminar : {}},
            },
            {
                name:'cancelar', label:'Cancelar', title:'Cancelar',
                variant:"contained", color:"primary",
                sx:{...Config.Estilos.Botones ? Config.Estilos.Botones.Cancelar : {}},
            },

            
        ],
    }
    
    this.setState({Config, input_campos:formulario, formulario_muestra,})
  }

  async componentDidMount(){
      
    const Config = Ver_Valores().config;
    let formulario_lista= await genera_fromulario({valores:{}, campos: Form_todos(`Form_api`) }, 2)
    const seleccionado = formulario_lista.titulos.apis.lista[0]
    formulario_lista.titulos.apis.value= seleccionado
    formulario_lista.titulos.apis.onChange= this.SeleccionA
    this.setState({Config, formularios:formulario_lista})
    this.Refrescar(Config)
    
  }

  static getDerivedStateFromProps(props, state) {

    if (props !== state.props) {
        
      return {
        props,
      };
    }
    // No state update necessary
    return null;
  }

  render(){
    const {formularios, formulario_muestra, input_campos, Config, dialogo}=this.state;
    
    return (
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={0.3}>
          <Grid item xs={12} md={12}>
            <Item style={{height:'auto', overflow:'auto'}}>
              <div style={{width:'50%'}}>
                <Formulario {...formularios}/>
              </div>  
              <div style={{marginTop:-20}}/>
              <Divider />
              <div style={{width:'100%'}}>
                <Formulario {...input_campos}/>
              </div>
            </Item>
          </Grid>
          <Grid item xs={12} md={12}>
            <Grid container spacing={0.3}>
              <Grid item xs={12} md={12}>
                <Item style={{height:'90vh', overflow:'auto'}}>
                    Muestra del Formulario
                    <Divider />
                    <Formulario {...formulario_muestra} config={Config}/>
                </Item>
              </Grid>
            </Grid>
            
          </Grid>
        </Grid>
        <Dialogo  {...dialogo} config={Config}/>
      </Box>
      
    )
  }
}
