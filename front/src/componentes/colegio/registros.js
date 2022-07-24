import React, {Component} from 'react';
// import MailIcon from '@material-ui/icons/Mail';
// import NotificationsIcon from '@material-ui/icons/Notifications';

import Cuerpo from '../herramientas/cuerpo';
import {conexiones, genera_fromulario, Permiso, MaysPrimera} from '../../procesos/servicios'
import TablaMultiple from '../herramientas/tabla/tabla_multiple';
import { Form_todos, Titulos_todos } from '../../constantes';

import { Condicion_Estudiante, Condicion_Representante } from './funciones';
import Cargando from '../esperar/cargar';

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
        if (valores.password!==''){
          // datos.password =await encriptado.Hash_password(datos.npassword)
          valores.newpassword=true;
        }
        // else{
        //   delete datos.password
        // }
        valores.categoria = typeof valores.categoria === 'object' ? valores.categoria._id : valores.categoria 
        return valores
      }
      case 'colegio_estudiante':{
        valores= await Condicion_Estudiante(datos);
        return valores
      }
      case 'colegio_representante':{
        valores = await Condicion_Representante(datos);
        return valores
      }
      default:
        return valores;
    }

  }

  Editores = (campo)=>{
    let multiples_valores= ['User_api'].indexOf(campo)===-1
    let nuevo_campo = MaysPrimera(campo.replace('colegio_',''))
    let Titulo_dialogo={
      colegio_arancel:(dato)=> dato.periodo ? dato.periodo.titulo : dato.periodo,
      colegio_cuenta: (dato)=> dato.nuero,
      colegio_estudiante:(dato)=>`de ${dato.nombres} ${dato.apellidos} ${dato.cedula} `,
      colegio_representante:(dato)=>`de ${dato.nombres} ${dato.apellidos} ${dato.cedula} `

    }
    const funcion= Titulo_dialogo[campo]
    return <TablaMultiple
                {...this.state.props}
                multiples_valores={multiples_valores}
                Agregar_mas={multiples_valores}
                Condiciones={this.Condiciones}
                Columnas={2} 
                Form_origen = {Form_todos(`Form_${nuevo_campo}`)}
                Titulo_tabla={nuevo_campo}
                Table = {campo}
                Eliminar_props={(dato)=>{
                    return `Desea eliminar de ${nuevo_campo} ${dato._id}`
                }}
                Titulo_dialogo ={(dato)=> dato._id ? `Registro ${Titulo_dialogo[campo] ? funcion(dato) : dato._id}`: `Nuevo Registro en ${nuevo_campo}`}
                Titulos_tabla = {Titulos_todos(`Titulos_${nuevo_campo}`)}
            />
  }
  
  async componentDidMount(){
    
    let database= await conexiones.DataBase();
    
    let Bloques1={}
    database.models.map((val,i)=>{
        if (val.indexOf('colegio_')!==-1){
            let nuevo = MaysPrimera(val.replace('colegio_',''))
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
