import React, {Component} from 'react';
// import MailIcon from '@material-ui/icons/Mail';
// import NotificationsIcon from '@material-ui/icons/Notifications';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
// import Divider from '@mui/material/Divider';
// import Cuerpo from '../herramientas/cuerpo';
import Tabla from '../herramientas/tabla';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/AddCircle';
import FeedIcon from '@mui/icons-material/Feed';
import CancelIcon from '@mui/icons-material/Cancel';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import {genera_fromulario, Permiso, conexiones} from '../../procesos/servicios'

import Formulario from '../herramientas/formulario';
import Dialogo from '../herramientas/dialogo';
import { Ver_Valores, Form_todos, Titulos_todos } from '../../constantes';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default class Listas extends Component {
  constructor(props) {
      super(props);

      this.state = {
          props: this.props,
          Config:this.props.Config,
          dato:[],
          dialogo:{open:false}
      }
  }

  Refrescar = async(Config, seleccion=null)=>{
    let nuevos = await genera_fromulario({valores:{}, campos: Form_todos('Form_Listas') })
    console.log(nuevos, Config)
    nuevos.titulos.select_a.lista=Object.keys(Config.Listas).filter(f=>['lista_tipo'].indexOf(f)===-1).map((v,i)=>{
        return {_id:i, titulo:v}
    })
    if(seleccion===null){
      nuevos.datos.select_a=nuevos.titulos.select_a.lista[0]
      nuevos.titulos.select_a.value=nuevos.titulos.select_a.lista[0]
    }else{
      nuevos.datos.select_a=nuevos.titulos.select_a.lista.filter(f=>f.titulo===seleccion)[0]
      nuevos.titulos.select_a.value=nuevos.datos.select_a;
    } 
    nuevos.titulos.select_a.onChange = this.Cambio;
    
    const datos= Config.Listas[nuevos.datos.select_a.titulo];

    this.setState({Config, formulario:nuevos, datos, seleccion:nuevos.datos.select_a.titulo})

  }

  async componentDidMount(){
      
    let formulario_lista= await genera_fromulario({valores:{}, campos: Form_todos(`Form_api`) })
    const litt= await conexiones.VerApis()
    let lista=[]
    if (litt.Respuesta==='Ok'){
      lista= litt.lista.filter(f=> f!=='Apis').map( (v, i)=>{
        return {_id:i, titulo:v, nombre:v, api:v}
      })
    }else{
      const listado = await conexiones.Leer_C(['Api'],{'Api':{}})
      lista= listado.datos.Api.map( v=>{
        return {...v.valores ? {_id:v._id, ...v.valores} : v}
      })
    }
    const seleccionado = lista[0]
    formulario_lista.titulos.apis.value= seleccionado
    formulario_lista.titulos.apis.onChange= this.Seleccion
    formulario_lista.titulos.apis.lista= lista;
    this.setState({formulario_lista, lista_apis:lista})
    this.SeleccionA(seleccionado)
  }

  Seleccion = (data)=>{
    let seleccionado = data.resultados.apis;
    this.SeleccionA(seleccionado)
  }
  SeleccionA = async(seleccionado) =>{
    let Config = Ver_Valores().config;
    let archivo=`data/${seleccionado.api}.js`;
    const respuesta = await conexiones.Leer_data(archivo);
    if (respuesta.Respuesta==='Ok'){
      Config=JSON.parse(respuesta.datos);
      this.setState({Config, seleccionado})
    }
    
    this.Refrescar(Config)
  }
  static getDerivedStateFromProps(props, state) {

    if (props !== state.props) {
        console.log('Por aqui<<>>>>>>>>>>>')
      return {
        props,
        Config:props.Config,
      };
    }
    // No state update necessary
    return null;
  }

  Cambio = (datos)=>{
    // const Config = Ver_Valores().config;
    const {Config}= this.state;
    const nuevo=Config.Listas[datos.resultados[datos.name].titulo];
    this.setState({datos:nuevo, seleccion:datos.resultados[datos.name].titulo})
  }

  Guardar = async(datos)=>{
    //let Config = this.state.Config;//Ver_Valores().config;
    let {seleccion, Config, seleccionado}=this.state;
    const pos= Config.Listas[seleccion].findIndex(f=>f._id===datos._id);
    
    let permitir = Object.keys(datos).filter(f=> f.indexOf('Error-')===-1)
    let nuevod={}
    permitir.map(value=>{
      nuevod[value]=datos[value]
      return value
    })

    if (pos!==-1){
        Config.Listas[seleccion][pos]={            
            ...nuevod
            // _id: datos._id,
            // titulo: datos.titulo,
            // value: datos.value,
            // permisos: datos.permisos,
        }
    }else{
        Config.Listas[seleccion].push({            
            _id: Config.Listas[seleccion].length,
            titulo: datos.titulo,
            value: datos.value,
            permisos: datos.permisos,
        })
    } 
    let nuevo=Config;
    nuevo=JSON.stringify(nuevo, null, 4)
    const resul= await conexiones.Guardar_data(`data/${seleccionado.api}${'.js'}`,nuevo)
    this.Refrescar(Config, seleccion)
    this.setState({dialogo:{...this.state.dialogo, open: false}})
    return resul

  }
  
  Eliminar = async(datos)=>{
    
    // let Config = Ver_Valores().config;
    let {seleccion, Config, seleccionado}=this.state;
    Config.Listas[seleccion]= Config.Listas[seleccion].filter(f=>f._id!==datos._id).map((v,i)=>{
        return {...v, _id:i}
    });
    let nuevo=Config;
    nuevo=JSON.stringify(nuevo, null, 4)
    const resul= await conexiones.Guardar_data(`data/${seleccionado.api}${'.js'}`,nuevo)
    this.Refrescar(Config, this.state.seleccion)
    this.setState({dialogo:{...this.state.dialogo, open: false}})
    return resul
  }

  Abrir = async(valores)=>{
    const Config = Ver_Valores().config;
    
    const nuevos = valores._id!==undefined
                        ? await genera_fromulario({valores, campos: Form_todos('Form_Listas_m') })
                        : await genera_fromulario({valores:{}, campos: Form_todos('Form_Listas_m') })
        
    let dato=nuevos.datos;
    const pguardar=await Permiso('guardar');
    const peliminar= await Permiso('eliminar')
    const formulario ={
        ...nuevos,
        botones:[
            {
                name:'guardar', label:'Guardar', title:'Guardar ',
                variant:"contained", color:"success", icono:<CheckIcon/>,
                onClick: this.Guardar, validar:'true', 
                sx:{...Config.Estilos.Botones ? Config.Estilos.Botones.Aceptar : {}},
                disabled: !pguardar,
            },
            ...dato._id!==undefined  && peliminar
                ?
                    [{
                    name:'eliminar', label:'Eliminar', title:'Eliminar ',
                    variant:"contained", color:"secondary", icono:<DeleteIcon/>,
                    sx:{...Config.Estilos.Botones ? Config.Estilos.Botones.Eliminar : {}},
                    confirmar:'true', confirmar_mensaje:'Desea eliminar',confirmar_campo:'titulo',
                    onClick: this.Eliminar,
                    }]
                :[],
            {
                name:'cancelar', label:'Cancelar', title:'Cancelar',
                variant:"contained",  icono:<CancelIcon/>,
                sx:{...Config.Estilos.Botones ? Config.Estilos.Botones.Cancelar : {}},
                onClick: ()=>this.setState({dialogo:{...this.state.dialogo,open:false}})
            },
        ]
    }
    this.setState({dialogo:{
        ...this.state.dialogo, 
        open: true,
        tam:'md',
        Titulo:dato._id!==undefined ? `Modificar ${dato.titulo}` : 'Nuevo item a lista',
        Cuerpo:<Formulario {...formulario}/>,
        Cerrar: ()=>this.setState({dialogo:{...this.state.dialogo,open:false}})
    }})
  }

  Crear = async(valores) =>{
    const nueva= `lista_${valores.nombre}`;
    // let Config = Ver_Valores().config;
    let {Config, seleccionado} = this.state;
    Config.Listas={...Config.Listas, [nueva]:[]}
    let nuevo=Config;
    nuevo=JSON.stringify(nuevo, null, 4)
    await conexiones.Guardar_data(`data/${seleccionado.api}${'.js'}`,nuevo)
    this.Refrescar(Config, this.state.seleccion)
    this.setState({dialogo:{...this.state.dialogo, open: false}})
  }

  Eliminar_lista = async() =>{
    const Config = Ver_Valores().config;
    
    const peliminar= await Permiso('eliminar')
    const formulario ={
        ...this.state.formulario,
        botones:[
            ...peliminar
              ?
                  [{
                  name:'eliminar', label:'Eliminar', title:'Eliminar ',
                  variant:"contained", color:"secondary", icono:<DeleteIcon/>,
                  sx:{...Config.Estilos.Botones ? Config.Estilos.Botones.Eliminar : {}},
                  confirmar:'true', confirmar_mensaje:'Desea eliminar',confirmar_campo:'select_a',
                  onClick: this.Eliminar_lista_e,
                  }]
              :[],
            
            {
                name:'cancelar', label:'Cancelar', title:'Cancelar',
                variant:"contained",  icono:<CancelIcon/>,
                sx:{...Config.Estilos.Botones ? Config.Estilos.Botones.Cancelar : {}},
                onClick: ()=>this.setState({dialogo:{...this.state.dialogo,open:false}})
            },
        ]
    }
    this.setState({dialogo:{
        ...this.state.dialogo, 
        open: true,
        tam:'xs',
        Titulo:'Eliminar lista',
        Cuerpo:<Formulario {...formulario}/>,
        Cerrar: ()=>this.setState({dialogo:{...this.state.dialogo,open:false}})
    }})
  }

  Eliminar_lista_e = async(datos)=>{
    console.log('Elimniar',datos)
    //let Config = Ver_Valores().config;
    let {Config, seleccionado} = this.state;
    let lista= {};
    Object.keys(Config.Listas).filter(f=>f!==datos.select_a.titulo).map(v=>{
      lista={...lista, [v]:Config.Listas[v]}
      return v
    });
    Config.Listas=lista
    
    let nuevo=Config;
    nuevo=JSON.stringify(nuevo, null, 4)
    const resul= await conexiones.Guardar_data(`data/${seleccionado.api}${'.js'}`,nuevo)
    this.Refrescar(Config)
    this.setState({dialogo:{...this.state.dialogo, open: false}})
    return resul
  }

  Agregar= async()=>{
    const Config = Ver_Valores().config;
    let nuevos = await genera_fromulario({valores:{}, campos: Form_todos('Form_Listas_n') })
    const pguardar=await Permiso('guardar');
    const formulario ={
        ...nuevos,
        botones:[
            {
                name:'guardar', label:'Guardar', title:'Guardar ',
                variant:"contained", color:"success", icono:<CheckIcon/>,
                onClick: this.Crear, validar:'true', 
                sx:{...Config.Estilos.Botones ? Config.Estilos.Botones.Aceptar : {}},
                disabled: !pguardar,
            },
            {
                name:'cancelar', label:'Cancelar', title:'Cancelar',
                variant:"contained",  icono:<CancelIcon/>,
                sx:{...Config.Estilos.Botones ? Config.Estilos.Botones.Cancelar : {}},
                onClick: ()=>this.setState({dialogo:{...this.state.dialogo,open:false}})
            },
        ]
    }
    this.setState({dialogo:{
        ...this.state.dialogo, 
        open: true,
        tam:'xs',
        Titulo:'Crear nueva lista al sistema',
        Cuerpo:<Formulario {...formulario}/>,
        Cerrar: ()=>this.setState({dialogo:{...this.state.dialogo,open:false}})
    }})
  }

  Copia = async(valores)=>{
    // let Config = Ver_Valores().config;
    const {Config} = this.state;
    let Config_nuevo= Ver_Valores().config;
    let archivo=`data/${valores.apis.titulo}.js`;
    const respuesta = await conexiones.Leer_data(archivo);
    if (respuesta.Respuesta==='Ok'){
      Config_nuevo=JSON.parse(respuesta.datos);
    }
    Config_nuevo.Listas = Config_nuevo.Listas ? Config_nuevo.Listas : {};
    Config_nuevo.Listas[this.state.seleccion]=this.state.datos;
    // console.log(valores, Config[valores.apis.titulo], Config[valores.apis.titulo].Listas, this.state.datos, this.state.seleccion)
    let nuevoc=Config_nuevo;
    nuevoc=JSON.stringify(nuevoc, null, 4)
    await conexiones.Guardar_data(`data/${valores.apis.titulo}${'.js'}`,nuevoc);
    this.setState({dialogo:{...this.state.dialogo,open:false}})
    return
  }
  Copiar = async()=>{
    const Config = Ver_Valores().config;
    let formularios = await genera_fromulario({valores:{}, campos: Form_todos(`Form_api`) }, 2)
    // let listaA= Object.keys(Config).filter(f=> f.indexOf('Api_')!==-1).map((val,i)=>{
    //   return {_id:i, titulo:val, api:val}
    // })
    formularios.titulos.apis.lista=this.state.lista_apis;
    // formularios.titulos.apis.onChange= this.SeleccionA
    const pguardar=await Permiso('guardar');
    const formulario ={
        ...formularios,
        botones:[
            {
                name:'guardar', label:'Copiar', title:'Copiar ',
                variant:"contained", color:"success", icono:<CheckIcon/>,
                onClick: this.Copia, validar:'true', 
                sx:{...Config.Estilos.Botones ? Config.Estilos.Botones.Aceptar : {}},
                disabled: !pguardar,
            },
            {
                name:'cancelar', label:'Cancelar', title:'Cancelar',
                variant:"contained",  icono:<CancelIcon/>,
                sx:{...Config.Estilos.Botones ? Config.Estilos.Botones.Cancelar : {}},
                onClick: ()=>this.setState({dialogo:{...this.state.dialogo,open:false}})
            },
        ]
    }
    this.setState({dialogo:{
      ...this.state.dialogo, 
      open: true,
      tam:'xs',
      Titulo:'Copiar en Api',
      Cuerpo:<Formulario {...formulario}/>,
      Cerrar: ()=>this.setState({dialogo:{...this.state.dialogo,open:false}})
    }})
  }

  render(){
    const {Config, formulario, datos, dialogo, formulario_lista}=this.state;
    
    return (
      <Box sx={{ flexGrow: 1, padding:0.2 }}>
        <Item style={{height:window.innerHeight * 0.9}}>
          <Tabla
          
                Titulo={"Listas del sistema"}
                Config={Config}
                titulos={Titulos_todos('Titulos_Listas')}
                table={''}
                cantidad={ null}
                datos={datos}
                Accion={this.Abrir}
          
                acciones1={
                    <Grid container spacing={0.3} justifyContent="center" alignItems="center" sx={{marginTop:-5}}>
                        <Grid item xs={8} md={8} style={{ height:80}}>
                            <Formulario {...formulario}/>
                        </Grid>
                        <Grid item xs={4} md={4}>
                            <IconButton  title={'Crear una nueva lista'} onClick={this.Agregar}>
                                <FeedIcon />
                            </IconButton> 
                            <IconButton  title={'Eliminar lista'} onClick={this.Eliminar_lista}>
                                <DeleteIcon />
                            </IconButton> 
                            <IconButton  title={'Agregrar nuevo item a lista'} onClick={()=>this.Abrir({})}>
                                <AddIcon />
                            </IconButton>
                            <IconButton  title={'Copiar titulo en api'} onClick={()=>this.Copiar()}>
                                <ContentCopyIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                }
                acciones={<Formulario {...formulario_lista}/>}
          />
        </Item>  
        <Dialogo  {...dialogo} config={Config}/>
      </Box>
      
    )
  }
}
