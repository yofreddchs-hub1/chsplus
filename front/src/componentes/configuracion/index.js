import React, {Component} from 'react';
// import MailIcon from '@material-ui/icons/Mail';
// import NotificationsIcon from '@material-ui/icons/Notifications';
import Formulario from '../herramientas/formulario';
//Icono
import CheckIcon from '@mui/icons-material/Check';

import Cuerpo from '../herramientas/cuerpo';
import {conexiones}from '../../procesos/servicios'


// import Tabla_multiple from '../tabla/tabla_multiple';

export default class Configuracion extends Component {
  constructor(props) {
      super(props);

      this.state = {
          props: this.props,
          Config:this.props.Config,
          Guardar_datos:this.Guardar
      }
  }


  Editores = (campo)=>{
    const {Config} = this.state;
    let formulario={
        datos:{archivo:'datos', data:Config, path:'data/',tipo:'.json'},
        titulos:{
          data:{
            label:`${campo}`,
            helperText:'',
            value:Config[campo],
            ...['Logo'].indexOf(campo)!==-1 ?{
                tipo:  'Imagen',
                
            }: {},
            ...['Titulo', 'Logo'].indexOf(campo)===-1 ?{
                multiline: true ,
                maxRows:23,
                tipo:  'Json',
                height:window.innerHeight*0.65,
            }: {}
            
            // width:window.innerWidth*0.80,
            // ...estilos.data
          },
        },
        botones:[
            {
              name:'guardar', label:'Guardar', title:'Guardar cambios',
              variant:"contained", color:"primary",
              icono:<CheckIcon />, mesperar:'Guardando...',
              onClick:(datos)=>this.Guardar_parte(datos, campo)
            },
        ]
    };
    return <Formulario {...formulario} config={Config}/>
    

  }
  componentDidMount(){
      
    const {Config} = this.state;
    let formulario={
        datos:{archivo:'datos', data:Config, path:'data/',tipo:'.json'},
        titulos:{
          data:{
            label:'Datos Configuración',
            helperText:'',
            value:Config,
            multiline:true,
            maxRows:23,
            tipo:'Json',
            height:window.innerHeight*0.65,
            // width:window.innerWidth*0.80,
            // ...estilos.data
          },
        },
        botones:[
            {
              name:'guardar', label:'Guardar', title:'Guardar cambios',
              variant:"contained", color:"primary",
              icono:<CheckIcon />, mesperar:'Guardando...',
              onClick:this.Guardar
            },
        ]
    };
    let Bloques={
        Datos:<Formulario {...formulario} config={Config}/>,
    }
    Object.keys(Config).map(m=>{
        Bloques[m]=this.Editores(m);
        return m
    })

    this.setState({Bloques})
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

  Guardar_parte = async(datos, campo)=>{
    
    if (campo!=='Logo'){
        datos[campo]= datos.data;  
        datos.data=undefined;
        return await this.Guardar(datos)
    }else{
        const enviar={Logo:datos.data, Logo_url:datos.data_url}
        const respuesta= await conexiones.Guardar(enviar,'null');
        if (respuesta.Respuesta==='Ok'){
            datos['Logo']= respuesta.newdatos.Logo
            datos.data=undefined;
            return await this.Guardar(datos)
        }    
    }  
  }
  //Guardar los datos de la configuracion
  Guardar=async(datos)=>{
    const {Config}=this.state;
    if (datos.data===undefined){
        let nuevo = {archivo:'datos', path:'data/',tipo:'.json'}
        nuevo.data=Config;
        Object.keys(datos).map(val=>{
          if (['path','archivo','tipo', 'data'].indexOf(val)===-1 && val.indexOf('Error')===-1){
            nuevo.data[val]=datos[val]
          }
           return val
        })
        nuevo.data=JSON.stringify(nuevo.data, null, 4)
        datos=nuevo
    }else if (typeof datos.data ==='object'){
        datos.data=JSON.stringify(datos.data, null, 4)
    }
    
    return await conexiones.Guardar_data(`${datos.path}${datos.archivo}${'.js'}`,datos.data)
  }
  render(){
    const {Bloques}=this.state;
    return (
      <Cuerpo Bloques={Bloques}/>
    )
  }
}
