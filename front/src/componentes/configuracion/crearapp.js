import React, {Component} from 'react';
// import MailIcon from '@material-ui/icons/Mail';
// import NotificationsIcon from '@material-ui/icons/Notifications';

import Cuerpo from '../herramientas/cuerpo';
import {conexiones, genera_fromulario, Permiso, MaysPrimera} from '../../procesos/servicios'
import TablaMultiple from '../herramientas/tabla/tabla_multiple';
import Formulario from '../herramientas/formulario';
import { Ver_Valores, Form_todos, Titulos_todos } from '../../constantes';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import Cargando from '../esperar/cargar';

export default class Crear_app extends Component {
  constructor(props) {
      super(props);

      this.state = {
          cargando:true,
          props: this.props,
          Config:this.props.Config,
          Guardar_datos:this.Guardar
      }
  }

  Condiciones = async(campo, datos) =>{
    
    switch (campo) {
      case 'User_api':{
        if (datos.password!==''){
          // datos.password =await encriptado.Hash_password(datos.npassword)
          datos.newpassword=true;
        }
        // else{
        //   delete datos.password
        // }
        datos.categoria = typeof datos.categoria === 'object' ? datos.categoria._id : datos.categoria 
        return datos
      }
      default:
        return datos;
    }

  }

  Editores = (campo)=>{
    let multiples_valores= ['User_api'].indexOf(campo)===-1 
    return <TablaMultiple
                {...this.state.props}
                multiples_valores={multiples_valores}
                Agregar_mas={multiples_valores}
                Condiciones={this.Condiciones}
                Columnas={2} 
                Form_origen = {Form_todos(`Form_${campo}`)}
                Titulo_tabla={campo}
                Table = {campo}
                Eliminar_props={(dato)=>{
                    return `Desea eliminar de ${campo} ${dato._id}`
                }}
                Titulo_dialogo ={(dato)=> dato._id ? `Registro ${dato._id}`: `Nuevo Registro en ${campo}`}
                Titulos_tabla = {Titulos_todos(`Titulos_${campo}`)}
            />
  }
  
  Guardar_codigo = async(valores)=>{
    let Config = Ver_Valores().config;
    const {seleccionado} = this.state
    const item = `Api_${valores.archivo}`
    let codigo = JSON.parse(valores.codigo) 
    Config[item]=codigo;
    console.log(Config)
    Config = JSON.stringify(Config, null, 4)
    return await conexiones.Guardar_data(`${'data/'}${'datos'}${'.js'}`,Config)

    // return await conexiones.Guardar_data(`models/${valores.archivo}.js`,valores.codigo)
  }

  Nuevo_archivo = async(valores, campos)=>{
    const Config = Ver_Valores().config;
    let campo= valores.resultados.archivo.toLowerCase();
    campo= MaysPrimera(campo)
    
    let {seleccionado}= this.state;
    
    let codigo
    if (seleccionado.master){
        codigo='master';
        let nuevo = {};
        Object.keys(Config).map(v=>{
            if (v.indexOf('Api_')===-1){
                nuevo[v]=Config[v]
            }
            return v
        });
        nuevo.Titulo= campo.toUpperCase()
        nuevo.Formularios={}
        nuevo.Listas={}
        nuevo.Titulos={}
        nuevo.Menu=[{value: "Inicio", primary: "Inicio", icon: "home", libre: "true"}];
        nuevo.Menu_iconos= [{icon: "shoppingcart", title: "Carrito de Compra", value: "carrito"}];
        nuevo.Funciones={}
        nuevo.Subtotales={}
        codigo = JSON.stringify(nuevo, null, 4)
    }else{
        let nuevo = {...Config['Api_'+seleccionado.api]}
        nuevo.Titulo= campo.toUpperCase()
        nuevo.Logo="/api/imagen/logo.png";
        nuevo.Menu=[{value: "Inicio", primary: "Inicio", icon: "home", libre: "true"}];
        nuevo.Menu_iconos= [{icon: "shoppingcart", title: "Carrito de Compra", value: "carrito"}];
        nuevo.Formularios={}
        nuevo.Listas={}
        nuevo.Titulos={}
        nuevo.Funciones={}
        nuevo.Subtotales={}
        codigo = JSON.stringify(nuevo, null, 4)
    }
    
    let nuevos = await genera_fromulario({valores:valores.resultados, campos: Form_todos(`Form_nuevodatabase`) })
    nuevos.titulos.archivo.onChange= this.Nuevo_archivo
    nuevos.titulos.codigo.value= codigo;
    nuevos.titulos.codigo.maxRows=15;
    const formulario ={
      ...nuevos,
      botones:[
          {
            name:'guardar', label:'Guardar', title:'Guardar ',
            variant:"contained", color:"success", icono:<CheckIcon/>,
            onClick: this.Guardar_codigo, validar:'true', 
            sx:{...Config.Estilos.Botones ? Config.Estilos.Botones.Aceptar : {}},
            disabled: !Permiso('guardar'),
          },
      ]
    }

    this.setState({formulario})
  }

  Eliminar_archivo = async(valores)=>{
    await conexiones.Eliminar_data(`models/${valores.lista.value}.js`)
    window.location.reload(true);
  }

  SeleccionA = (valores)=>{
    console.log(valores)
    const api=valores.resultados.apis
    
    if (api.master){
      
    }else{

     
    }
    this.setState({seleccionado:api})

  }
  async componentDidMount(){
      
    let nuevos = await genera_fromulario({valores:{}, campos: Form_todos(`Form_nuevodatabase`) })
    nuevos.titulos.archivo.onChange= this.Nuevo_archivo
    nuevos.titulos.codigo.maxRows=15;
    const formulario ={
      ...nuevos,
      botones:[
      ]
    }

    let formulario_lista= await genera_fromulario({valores:{}, campos: Form_todos(`Form_api`) }, 2)
    
    const seleccionado = formulario_lista.titulos.apis.lista[0]
    formulario_lista.titulos.apis.value= seleccionado
    formulario_lista.titulos.apis.onChange= this.SeleccionA

    this.setState({formulario, formulario_lista, seleccionado, cargando:false})
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
        let nuevo = {archivo:'datos', path:'data/',tipo:'.js'}
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
    
    return await conexiones.Guardar_data(`${datos.path}${datos.archivo}${datos.tipo}`,datos.data)
  }
  render(){
    const {formulario, formulario_lista, Config, cargando}=this.state;
    return (
      <div style={{width:'100%', position: "relative", height:'100%'}}>
        <div style={{width:'50%'}}>
            <Formulario {...formulario_lista} config={Config}/>
        </div>
        <div style={{marginTop:-50}}/>
            <Formulario {...formulario} config={Config}/>
      </div>
    )
  }
}
