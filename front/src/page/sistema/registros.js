import React, {Component} from 'react';
// import MailIcon from '@material-ui/icons/Mail';
// import NotificationsIcon from '@material-ui/icons/Notifications';

import Cuerpo from '../../componentes/herramientas/cuerpo';
import {conexiones, genera_fromulario, Permiso, MaysPrimera} from '../../procesos/servicios'
import TablaMultiple from '../../componentes/herramientas/tabla/tabla_multiple';
import { Form_todos, Titulos_todos } from '../../constantes';

import { Condicion_Estudiante, Condicion_Representante } from './funciones';
import Cargando from '../../componentes/esperar/cargar';

export default class Registros extends Component {
  constructor(props) {
      super(props);

      this.state = {
          cargando:true,
          props: this.props,
          Config:this.props.Config,
      }
  }

  Condiciones = async(campo, datos) =>{
    let {valores}= datos
    switch (campo) {
      case 'User_api':{
        if (datos.password!==''){
          // datos.password =await encriptado.Hash_password(datos.npassword)
          datos.newpassword=datos.password;
          
        }
        // else{
          delete datos.password
        // }
        datos.categoria = typeof datos.categoria === 'object' ? datos.categoria._id : datos.categoria 
        return datos
      }
      
      default:
        return valores;
    }

  }

  Editores = (campo)=>{
    let multiples_valores= ['User_api'].indexOf(campo)===-1
    let nuevo_campo = campo//MaysPrimera(campo.replace('colegio_',''))
    let Titulo_dialogo={
      formula:(dato)=>dato.mezcla,
      inventariomp: (dato)=>dato.descripcion,
      inventariopt: (dato)=>dato.descripcion,
      empaque: (dato)=>dato.descripcion

    }
    let Eliminar={
      formula:'mezcla',
      inventariomp: 'descripcion',
      inventariopt: 'descripcion',
      empaque:'descripcion'
    }
    let Titulo;
    switch(campo){
      case 'Cliente':{
        Titulo= 'CLIENTES'
        break;
      }
      case 'Proveedor':{
        Titulo= 'PROVEEDORES'
        break;
      }
      case 'empaque':{
        Titulo= 'EMPAQUES'
        break;
      }
      case 'formula':{
        Titulo= 'FORMULAS'
        break;
      }
      case 'inventariomp':{
        Titulo= 'MATERIAS PRIMAS'
        break;
      }
      case 'inventariopt':{
        Titulo= 'PRODUCTO TERMINADO'
        break;
      }
      default:{
        Titulo=campo;
      }
    }

    const funcion= Titulo_dialogo[campo]
    return <TablaMultiple
                {...this.state.props}
                multiples_valores={multiples_valores}
                Agregar_mas={false}//multiples_valores}
                Condiciones={this.Condiciones}
                Columnas={2} 
                Form_origen = {Form_todos(`Form_${nuevo_campo}`)}
                Titulo_tabla={Titulo}
                Table = {campo}
                cargaporparte={{condicion:{}}}
                Eliminar_props={(dato)=>{
                    return `Desea eliminar de ${nuevo_campo} ${dato._id}`
                }}
                Eliminar= {Eliminar[nuevo_campo] ? Eliminar[nuevo_campo] : '_id'}
                Titulo_dialogo ={(dato)=> dato._id ?  Titulo_dialogo[campo] ? funcion(dato) : `Registro ${dato._id}`: `Nuevo registro en ${Titulo}`}
                Titulos_tabla = {Titulos_todos(`Titulos_${nuevo_campo}`)}
            />
  }
  
  async componentDidMount(){
    
    let database= await conexiones.DataBase();
    
    let Bloques1={PROVEEDORES:null, CLIENTES:null, 'MATERIAS PRIMAS':null, EMPAQUES:null, FORMULAS:null, 'PRODUCTO TERMINADO':null}
    database.models.map((val,i)=>{
        if ((val.indexOf('_')===-1 || val==='User_api')  && ['Api'].indexOf(val)===-1 ){
            let nuevo = MaysPrimera(val)
            switch(val){
              case 'Cliente':{
                nuevo= 'CLIENTES'
                break;
              }
              case 'Proveedor':{
                nuevo= 'PROVEEDORES'
                break;
              }
              case 'empaque':{
                nuevo= 'EMPAQUES'
                break;
              }
              case 'formula':{
                nuevo= 'FORMULAS'
                break;
              }
              case 'inventariomp':{
                nuevo= 'MATERIAS PRIMAS'
                break;
              }
              case 'inventariopt':{
                nuevo= 'PRODUCTO TERMINADO'
                break;
              }
              default:{

              }
            }

            Bloques1[nuevo]=this.Editores(val);
        }
        return {_id:i, titulo:val, value:val}
    })
   
    let Bloques={
     
      ...Bloques1
    }

    this.setState({Bloques, BloquesT:Bloques, cargando:false})
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
    const {Bloques, cargando}=this.state;
    return (
      <div style={{width:'100%', position: "relative"}}>
        <Cuerpo Bloques={Bloques}/>
        <Cargando open={cargando}/>
      </div>
    )
  }
}
