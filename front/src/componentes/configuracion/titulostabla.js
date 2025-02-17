import React, {Component} from 'react';
// import MailIcon from '@material-ui/icons/Mail';
// import NotificationsIcon from '@material-ui/icons/Notifications';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
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

export default class Titulos_tablas extends Component {
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
    nuevos.titulos.select_a.lista=Object.keys(Config.Titulos).filter(f=>['Titulos_Cabezera'].indexOf(f)===-1).map((v,i)=>{
        return {_id:i, titulo:v}
    })
    nuevos.titulos.select_a.label='Seleccione Titulo'
    if(seleccion===null){
      nuevos.datos.select_a=nuevos.titulos.select_a.lista[0]
      nuevos.titulos.select_a.value=nuevos.titulos.select_a.lista[0]
    }else{
      nuevos.datos.select_a=nuevos.titulos.select_a.lista.filter(f=>f.titulo===seleccion)[0]
      nuevos.titulos.select_a.value=nuevos.datos.select_a;
    } 
    nuevos.titulos.select_a.onChange = this.Cambio;
    console.log(Config, nuevos.datos)
    let datos= []
    if (nuevos.datos.select_a){
      datos= Config.Titulos[nuevos.datos.select_a.titulo];
    }
    
    console.log(nuevos)
    this.setState({Config, formulario:nuevos, datos, seleccion: nuevos.datos.select_a ? nuevos.datos.select_a.titulo : ''})

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
    // this.Refrescar(Config)
    
    
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
    const nuevo=Config.Titulos[datos.resultados[datos.name].titulo];
    this.setState({datos:nuevo, seleccion:datos.resultados[datos.name].titulo})
  }

  Guardar = async(datos)=>{
    // let Config = Ver_Valores().config;
    const{seleccion, Config, seleccionado}=this.state;
    const pos= Config.Titulos[seleccion].findIndex(f=>f.field===datos.field);
    if (pos!==-1){
        Config.Titulos[seleccion][pos]={            
            title: datos.title,
            field: datos.field,
            tipo: datos.tipo,
            formato: datos.formato,
            cantidad: datos.cantidad,
            default: datos.default,
            type: datos.type,
            editable: datos.editable
        }
    }else{
        Config.Titulos[seleccion].push({            
            title: datos.title,
            field: datos.field,
            tipo: datos.tipo,
            formato: datos.formato,
            cantidad: datos.cantidad,
            default: datos.default,
            type: datos.type,
            editable: datos.editable
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
    Config.Titulos[seleccion]= Config.Titulos[seleccion].filter(f=>f.field!==datos.field);
    let nuevo=Config;
    nuevo=JSON.stringify(nuevo, null, 4)
    const resul= await conexiones.Guardar_data(`data/${seleccionado.api}${'.js'}`,nuevo)
    console.log(resul)
    this.Refrescar(Config, seleccion)
    this.setState({dialogo:{...this.state.dialogo, open: false}})
    return resul
  }

  Abrir = async(valores)=>{
    const Config = Ver_Valores().config;
    const nuevos = valores.title!==undefined
                        ? await genera_fromulario({valores, campos: Form_todos('Form_Cabezera_m') })
                        : await genera_fromulario({valores:{}, campos: Form_todos('Form_Cabezera_m') })
        
    let dato=nuevos.datos;
    nuevos.titulos[2].value.editable.value=dato.editable
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
            ...dato.field!==undefined  && peliminar
                ?
                    [{
                    name:'eliminar', label:'Eliminar', title:'Eliminar ',
                    variant:"contained", color:"secondary", icono:<DeleteIcon/>,
                    sx:{...Config.Estilos.Botones ? Config.Estilos.Botones.Eliminar : {}},
                    confirmar:'true', confirmar_mensaje:'Desea eliminar',confirmar_campo:'field',
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
        Titulo:dato._id!==undefined ? `Modificar ${dato.title}` : 'Nuevo titulo',
        Cuerpo:<Formulario {...formulario}/>,
        Cerrar: ()=>this.setState({dialogo:{...this.state.dialogo,open:false}})
    }})
  }

  Crear = async(valores) =>{
    const nueva= `Titulos_${valores.nombre}`;
    // let Config = Ver_Valores().config;
    let {Config, seleccionado} = this.state;
    Config.Titulos={...Config.Titulos, [nueva]:[]}
    let nuevo=Config;
    nuevo=JSON.stringify(nuevo, null, 4)
    const resul= await conexiones.Guardar_data(`data/${seleccionado.api}${'.js'}`,nuevo)
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
        Titulo:'Eliminar Titulo',
        Cuerpo:<Formulario {...formulario}/>,
        Cerrar: ()=>this.setState({dialogo:{...this.state.dialogo,open:false}})
    }})
  }

  Eliminar_lista_e = async(datos)=>{
    // let Config = Ver_Valores().config;
    let {Config, seleccionado} = this.state;
    let lista= {};
    Object.keys(Config.Titulos).filter(f=>f!==datos.select_a.titulo).map(v=>{
      lista={...lista, [v]:Config.Titulos[v]}
      return v
    });
    Config.Titulos=lista
    
    let nuevo=Config;
    nuevo=JSON.stringify(nuevo, null, 4)
    const resul= await conexiones.Guardar_data(`data/${seleccionado.api}${'.js'}`,nuevo)
    console.log(resul)
    this.Refrescar(Config)
    this.setState({dialogo:{...this.state.dialogo, open: false}})
    return resul
  }

  Agregar= async()=>{
    const Config = Ver_Valores().config;
    let nuevos = await genera_fromulario({valores:{}, campos: Form_todos('Form_Listas_n') });
    nuevos.titulos.nombre.label='Nombre';
    nuevos.titulos.nombre.placeholder='Nombre';
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
        Titulo:'Crear nuevo titulo al sistema',
        Cuerpo:<Formulario {...formulario}/>,
        Cerrar: ()=>this.setState({dialogo:{...this.state.dialogo,open:false}})
    }})
  }

  Copia = async(valores)=>{
    let Config_nuevo= Ver_Valores().config;
    let archivo=`data/${valores.apis.titulo}.js`;
    const respuesta = await conexiones.Leer_data(archivo);
    if (respuesta.Respuesta==='Ok'){
      Config_nuevo=JSON.parse(respuesta.datos);
    }
    Config_nuevo.Titulos = Config_nuevo.Titulos ? Config_nuevo.Titulos : {};
    Config_nuevo.Titulos[this.state.seleccion]=this.state.datos;
    // console.log(valores, Config[valores.apis.titulo], Config[valores.apis.titulo].Titulos, this.state.datos, this.state.seleccion)
    let nuevoc=Config_nuevo;
    nuevoc=JSON.stringify(nuevoc, null, 4)
    await conexiones.Guardar_data(`data/${valores.apis.titulo}${'.js'}`,nuevoc)
    this.setState({dialogo:{...this.state.dialogo,open:false}})
    return
  }
  Copiar = async()=>{
    const Config = Ver_Valores().config;
    let formularios = await genera_fromulario({valores:{}, campos: Form_todos(`Form_api`) }, 2)
    // let listaA= Object.keys(Config).filter(f=> f.indexOf('Api_')!==-1).map((val,i)=>{
    //   return {_id:i, titulo:val, api:val}
    // })
    // formularios.titulos.apis.lista=listaA
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
          
                Titulo={"Titulos en tablas"}
                Config={Config}
                titulos={Titulos_todos('Titulos_Cabezera')}
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
