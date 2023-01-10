import React, {Component} from 'react';
// import MailIcon from '@material-ui/icons/Mail';
// import NotificationsIcon from '@material-ui/icons/Notifications';
import moment from "moment";
import { confirmAlert } from 'react-confirm-alert';
import Formulario from '../herramientas/formulario';
//Icono
import CheckIcon from '@mui/icons-material/Check';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import Cuerpo from '../herramientas/cuerpo';
import {conexiones, genera_fromulario}from '../../procesos/servicios'
import {Form_todos} from '../../constantes/formularios';
import Cargando from '../esperar/cargar';
import { Ver_Valores } from '../../constantes';

// import Tabla_multiple from '../tabla/tabla_multiple';

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

  Editores = (seleccionado, Config, campo)=>{
    // const {Config} = this.state;
    let formulario={
        datos:{archivo: seleccionado.api, data:Config, path:'data/',tipo:'.json'},
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
              sx:{...Config.Estilos && Config.Estilos.Botones ? Config.Estilos.Botones.Aceptar : Ver_Valores().config.Estilos.Botones.Aceptar},
              icono:<CheckIcon />, mesperar:'Guardando...',
              onClick:(datos)=>this.Guardar_parte(datos, campo)
            }
        ]
    };
    return <Formulario {...formulario}/>
    

  }

  SeleccionA = async (valores)=>{
    let Bloques = await this.Filtrar(valores.resultados.apis);
    this.setState({Bloques})

  }

  Filtrar = async (seleccionado) =>{
    let {Config} = this.state;
    console.log(seleccionado)
    let archivo=`data/${seleccionado.api}.js`;
    const respuesta = await conexiones.Leer_data(archivo);
    if (respuesta.Respuesta==='Ok'){
      Config=JSON.parse(respuesta.datos);
      this.setState({Config, seleccionado})
    }
    //if (seleccionado.master){
      console.log('Es master')
      
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
                sx:{...Config.Estilos && Config.Estilos.Botones ? Config.Estilos.Botones.Aceptar : Ver_Valores().config.Estilos.Botones.Aceptar},
                icono:<CheckIcon />, mesperar:'Guardando...',
                onClick:this.Guardar
              },
              {
                name:'descargar', label:'Descargar', title:'Descargar DAtos',
                variant:"contained", color:"primary",
                icono:<CloudDownloadIcon />, mesperar:'Guardando...',
                onClick:(datos)=>this.Descargar(datos)
              },
              {
                name:'actualizar', 
                label:'Actualizar', 
                title:'Actualizar datos',
                variant:"contained", color:"secondary",
                icono:<ImportExportIcon />,
                onClick:this.Actualizar
              },
          ]
      };
      let Bloques={
          Datos:<Formulario {...formulario} />,
      }
      Object.keys(Config).map(m=>{
          Bloques[m]=this.Editores(seleccionado, Config, m);
          return m
      })

      return Bloques
    //}else{
    //   let Bloques={
    //   }
    //   Object.keys(Config).map(m=>{
        
    //     if (m.indexOf(seleccionado.api)!==-1){
    //       Bloques[m]=this.Editores(m);
    //     }
    //     // console.log(m)
    //     return m
    //   })
    //   return Bloques 
    // }
  }

  async componentDidMount(){
    let formulario_lista= await genera_fromulario({valores:{}, campos: Form_todos(`Form_api`) }, 2)
    const litt= await conexiones.VerApis()
    console.log(litt)
    let lista=[]
    if (litt.Respuesta==='Ok'){
      lista= litt.lista.map( (v, i)=>{
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
    formulario_lista.titulos.apis.onChange= this.SeleccionA
    formulario_lista.titulos.apis.lista= lista;
    let Bloques= await this.Filtrar(seleccionado)
    
    this.setState({Bloques, formulario_lista, cargando:false})
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

  Actualizar = async()=>{
    
    // creas un enlace y lo añades al documento
    var a = document.createElement("input");
    document.body.appendChild(a);
    a.Accept='*.json';
    a.type='file';
    a.onchange=(e)=>{
      
      const { files} = e.target;
      const nombre = files[0].name;
      var archivo = e.target.files[0];
      if (!archivo) {
        return;
      }
      var lector = new FileReader();
      lector.onload = (e)=> {
        console.log(e)
        var contenido = JSON.parse(e.target.result);
        console.log(contenido)
        
        confirmAlert({
          title: 'Actualizar',
          message: `Desea actualizar el archivo Datos con ${nombre}?`,
          buttons: [
            {
              label: 'SI',
              onClick: async () => {
                let nuevo = {archivo:'datos', path:'data/',tipo:'.json', data:JSON.stringify(contenido, null, 4)}
                return await conexiones.Guardar_data(`${nuevo.path}${nuevo.archivo}${'.js'}`,nuevo.data)
                
              }
            },
            {
              label: 'NO',
    
            }
          ]
        });
        
        
      };
      lector.readAsText(archivo);
    }
    a.click();
  }
  Descargar = async(datos)=>{
    const {seleccionado}=this.state;
    const hoy = new Date();
    const fecha=moment(hoy).format('DD-MM-YYYY HH:mm');
    datos.archivo = seleccionado.api;
    var file = new File(
      [JSON.stringify(datos.data, null, 2)],
      datos.archivo+'-'+fecha+".json",
      {type:"text/plain;charset=utf-8"}
    );

    // obtienes una URL para el fichero que acabas de crear
    var url  = window.URL.createObjectURL(file);

    // creas un enlace y lo añades al documento
    var a = document.createElement("a");
    document.body.appendChild(a);

    // actualizas los parámetros del enlace para descargar el fichero creado
    a.href = url;
    a.download = file.name;
    a.click();
    window.URL.revokeObjectURL(url);
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
    const {Config, seleccionado}=this.state;
    if (datos.data===undefined){
        let nuevo = {archivo:seleccionado.api, path:'data/',tipo:'.json'}
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
        datos.archivo=seleccionado.api;
        datos.data=JSON.stringify(datos.data, null, 4)
    }
    
    return await conexiones.Guardar_data(`${datos.path}${datos.archivo}${'.js'}`,datos.data)
  }
  render(){
    const {Bloques, formulario_lista, Config, cargando}=this.state;
    return (
      <div style={{width:'100%', position: "relative"}}>
        <div style={{width:'50vw'}}>
          <Formulario {...formulario_lista} />
        </div>
        
        <div style={{marginTop:-20}}/>
        <Cuerpo Bloques={Bloques}/>
        <Cargando open={cargando}/>
      </div>
    )
  }
}
