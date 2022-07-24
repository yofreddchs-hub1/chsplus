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

export default class Configuracion extends Component {
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
    return await conexiones.Guardar_data(`models/${valores.archivo}.js`,valores.codigo)
  }

  Nuevo_archivo = async(valores, campos)=>{
    const Config = Ver_Valores().config;
    let campo= valores.resultados.archivo.toLowerCase();
    const campo1=campo;
    campo= MaysPrimera(campo)
    
    const codigo = `const { Schema, model } = require('mongoose');

    const ${campo1}Schema = new Schema(
        {
            campos: {},
            valores:{},
            actualizado:String,
            seq_chs:{
              type: Number,
              default: 0,
              set:(v)=>{
                return Number(v)+1
              }
            },
            cod_chs:{
              type:String,
              unique:true
            },
            hash_chs:String
        }, {
            timestamps: true
        });
        ${campo1}Schema.index({'$**': 'text'});
    module.exports = model('${campo}', ${campo1}Schema);`
    
    let nuevos = await genera_fromulario({valores:valores.resultados, campos: Form_todos(`Form_nuevodatabase`) })
    nuevos.titulos.archivo.onChange= this.Nuevo_archivo
    nuevos.titulos.codigo.value= codigo;
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

    let {Bloques}= this.state;
    Bloques.Nuevo=<Formulario {...formulario} />
    this.setState({Bloques})
  }

  Eliminar_archivo = async(valores)=>{
    await conexiones.Eliminar_data(`models/${valores.lista.value}.js`)
    window.location.reload(true);
  }

  SeleccionA = (valores)=>{
    const api=valores.resultados.apis
    const {BloquesT} = this.state;
    let Bloques = {}
    if (api.master){
      Bloques= {...BloquesT}
    }else{

      Object.keys(BloquesT).map(v=>{
        if(v.indexOf(api.api)!==-1)
          Bloques[v]= BloquesT[v]
        return v
      })
    }
    this.setState({Bloques})

  }
  async componentDidMount(){
      
    const Config = Ver_Valores().config;
    let database= await conexiones.DataBase();
    let nuevos = await genera_fromulario({valores:{}, campos: Form_todos(`Form_nuevodatabase`) })
    nuevos.titulos.archivo.onChange= this.Nuevo_archivo
    const formulario ={
      ...nuevos,
      botones:[
      ]
    }
    let nuevos1 = await genera_fromulario({valores:{}, campos: Form_todos(`Form_eliminardatabase`) })
    let Bloques1={}
    let lista=database.models.map((val,i)=>{
      Bloques1[val]=this.Editores(val);
      return {_id:i, titulo:val, value:val}
    })
    nuevos1.titulos.lista.lista=lista.filter(f=> ['Api','User_api'].indexOf(f.titulo)===-1);
    const formulario1 ={
      ...nuevos1,
      botones:[
        {
          name:'eliminar', label:'Eliminar', title:'Eliminar ',
          variant:"contained", color:"secondary", icono:<DeleteIcon/>,
          sx:{...Config.Estilos.Botones ? Config.Estilos.Botones.Eliminar : {}},
          confirmar:'true', confirmar_mensaje:'Desea eliminar',confirmar_campo:'lista',
          onClick: this.Eliminar_archivo,
          disabled: !Permiso('guardar'),
        },
      ]
    }
    let Bloques={
      Nuevo : <Formulario {...formulario} />,
      Eliminar : <Formulario {...formulario1} />,
      ...Bloques1
    }

    
    // Object.keys(Config).map(m=>{
    //     Bloques[m]=this.Editores(m);
    // })
    let formulario_lista= await genera_fromulario({valores:{}, campos: Form_todos(`Form_api`) }, 2)
    
    const seleccionado = formulario_lista.titulos.apis.lista[0]
    formulario_lista.titulos.apis.value= seleccionado
    formulario_lista.titulos.apis.onChange= this.SeleccionA

    this.setState({Bloques, BloquesT:Bloques, formulario_lista, cargando:false})
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
    const {Bloques, formulario_lista, Config, cargando}=this.state;
    return (
      <div style={{width:'100%', position: "relative"}}>
        <div style={{width:'50%'}}>
          <Formulario {...formulario_lista} config={Config}/>
        </div>
        
        <div style={{marginTop:-50}}/>
        <Cuerpo Bloques={Bloques}/>
        <Cargando open={cargando}/>
      </div>
    )
  }
}
