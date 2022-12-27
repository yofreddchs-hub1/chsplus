import React, {Component,  useState} from 'react';
// Import Parse minified version
import Parse from 'parse/dist/parse.min.js';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import { SnackbarProvider, useSnackbar } from 'notistack';
import Snackbar from '@mui/material/Snackbar';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import socketIOClient from "socket.io-client";
import './App.css';
import {Inicio, Usuario} from './procesos/servicios';
import {nuevo_Valores} from './constantes'
import Esperar from './componentes/esperar';
import Principal  from './componentes/principal';
import Cuerpo from './componentes/herramientas/cuerpo';
import Formulario from './componentes/herramientas/formulario';
// import Configuracion from './componentes/configuracion';
// import DataBase from './componentes/configuracion/database';
// import CrearFormulario from './componentes/configuracion/crearformulario';
import Home from './page/home';
import Dialogo from './componentes/herramientas/dialogo';
import { pantallas } from './page/pantallas';
import {const_procesos} from './constantes';
import {genera_fromulario, conexiones} from './procesos/servicios'
import {Form_todos} from './constantes';
import Noexiste from './componentes/herramientas/pantallas/noexiste'

import { Apis } from './apis';
import Logo from './imagenes/logo1.png'
import Carrusel from './componentes/carrusel';

// Your Parse initialization configuration goes here
const PARSE_APPLICATION_ID = 'K6Z0K1MkzhWG4MTgg3xzWowj0eJl6J6KTUPfFWrd';
const PARSE_HOST_URL = 'https://chs.b4a.app';
const PARSE_JAVASCRIPT_KEY = 'Bt1PyOaq93UHGnReFsSCekWr56v0tXjoHwOb3pzA';
Parse.initialize(PARSE_APPLICATION_ID, PARSE_JAVASCRIPT_KEY);
Parse.serverURL = PARSE_HOST_URL;

class InicioPrincipal extends Component {
  constructor(props) {
      super(props);
      this.state = {
        props: this.props,
        esperar:true,
        Login: this.Login,
        dialogo:{open:false},
        publicidad:false,
        portadas:[]
      }

  }
  
  Iniciar= async(datos) =>{
    
    const respuesta= await conexiones.Login(datos);
    console.log(respuesta)
    if (respuesta.Respuesta==='OK'){
      await Usuario({status:'Guardar', dato:respuesta.user})
      this.setState({
        dialogo:{open:false}
      })
      this.Refrescar()
    }
    return respuesta
  }
  
  Salir= async()=>{

    await localStorage.setItem(const_procesos.dir_user,null);
    this.setState({User:null,  dialogo:{open:false}})
    try {
      this.state.socket.emit('desconectar')
    }catch(error) {

    }
    this.Refrescar()
  }
  
  Login = async()=>{
    const {Config, User}= this.state;
    let nuevos= await genera_fromulario({valores:{}, campos: Form_todos('Form_login') },1)
    if(User!==null){
        nuevos.titulos= {username:{...nuevos.titulos['username'], value:User.username, disabled:true}}
    }
    const formulario ={
      ...nuevos,
      botones:[
          {
            name:'iniciar', label: User===null ? 'Iniciar' : 'Salir', title:'Iniciar',
            variant:"contained", color: "success", icono: User===null ? 'check' : 'cancel',
            onClick: User===null ? this.Iniciar : this.Salir, validar:'true', 
            sx:{...Config.Estilos.Botones ? User===null ? Config.Estilos.Botones.Aceptar : Config.Estilos.Botones.Eliminar : {}},
          },
      ]
    }
    const {dialogo}=this.state;
    this.setState({
      dialogo:{
        ...dialogo, 
        open:true,
        tam:'xs',
        Titulo:'Login',
        Cuerpo:<Formulario {...formulario} Agregar={false}/>,
        Cerrar: ()=>this.setState({dialogo:{open:false}}),
    }
    })
  }
  
  Inicio_Socket =async()=>{
    const User = await Usuario()
    console.log('En user>>',User)
    const socket=socketIOClient("/")
    socket.on("conectado", async data => {
      console.log('>>>>>>>>>>>>>>>>>>>>>Conectado',data)
      socket.emit('conectar',{...User, id_socket:data.id})
      
      let Config = await Inicio() 
      this.setState({Config})
    })
    socket.on("Refrescar-datos", data => {
      this.Refrescar()
      console.log('Refrescar data config, realizar cambios en codigo')
      // try{
      //   let Config = JSON.parse(data)
      //   this.setState({Config})
      // }catch(error) {
      //   console.log('El dato no es JSON en Refrescar')
      // }
    })
    socket.on("Usuario_presentes", datos =>{
      // console.log('Usuarios presentes',datos)
    })
    socket.on("Actualizar_Portada", datos =>{
      //  console.log('Actualizar Portada',datos);
       this.Publicidades();
    })
    socket.on("Actualizar_tasa", datos =>{
       console.log('Actualizar tasa',datos);
       nuevo_Valores(datos);
    })
    this.setState({socket})
    nuevo_Valores({socket})
  }

  Refrescar = async()=>{
    let Config = await Inicio();
    // console.log('Configuracion >>>>>>>>>>>>>>>',Config)
    let User = await Usuario();
    // if (User!==null)
    //   this.Inicio_menu(User, Config);
    this.setState({Config, User, esperar:false})
  }

  async componentDidMount(){
    this.Inicio_Socket();
    this.Refrescar();
    this.Publicidad();
    this.Publicidades();

  }
  
  Publicidades = async()=>{
    let resultados= await conexiones.Leer_C(['Portada'], {'Portada':{}});
    if (resultados.Respuesta==='Ok'){
        this.setState({portadas:[...resultados.datos.Portada]});
    }
  }
  Publicidad = (estado=true)=>{
    this.setState({publicidad:estado})
    if (!this.state.publicidad || !estado){
      setTimeout(()=>{
        this.Publicidad();
      }, 10 * 60 * 1000)
    }
  }

  componentWillUnmount(){
    
  }

  Sacar=(valores)=>{
    let resultado=[];
    valores.map(val=>{
      if (val.childen){
        resultado=[...resultado, ...this.Sacar(val.childen)];
      }else if (val.path){
        
        resultado=[...resultado,{...val}]
      }
      return val
    })
    return resultado
  }

  Buscar_pantalla = async (listas, seleccion) =>{
    let Pantallas={}
    // Object.keys(listas).map(async v=>{
    for (var i=0 ; i<Object.keys(listas).length; i++ ){ 
      let v=Object.keys(listas)[i];
      if (typeof listas[v]==='object'){
        let nuevo= await this.Buscar_pantalla(listas[v], seleccion)
        Pantallas={...Pantallas, ...nuevo}
      }else if(v===seleccion){
        const P = listas[v]
        Pantallas[v]=<P {...this.state}/>
      }  
      // return v
    }//)
    
    return Pantallas
  }

  Seleccion_pantalla = async(value, padre)=>{
    console.log(value)
    let {Config}= this.state;
    this.Sacar(Config.Menu)
    let seleccion= value.pantalla ? value.pantalla : value.value;
    let pantalla= value.primary;
    
    
    let Pantallas= await this.Buscar_pantalla(pantallas, seleccion)
    // Object.keys(pantallas).map(v=>{
    //   console.log(v)
    //   console.log( typeof pantallas[v])
    //   if(v===seleccion){
    //     const P = pantallas[v]
    //     Pantallas[v]=<P {...this.state}/>
    //   }  
    //   return v
    // })
    // if (padre){
    //   seleccion = Pantallas[padre.value][seleccion] ? Pantallas[padre.value][seleccion] :  <Noexiste />
    // }else{
      seleccion = Pantallas[seleccion] ? Pantallas[seleccion] :  <Noexiste />
    // }
    this.setState({seleccion, pantalla})

  }
  
  Pantalla = ()=>{
    const formulario={
      datos:{nombre:'',password:''},
      titulos:{
        username:{
          label: 'Usuario',
          helperText:'',
          value:'',
          type:'email',
          
        },
        password:{
          label: 'Contraseña',
          helperText:'',
          value:'',
          tipo:'password',
        },
      },
      botones:[
          {
            name:'iniciar', label:'Inciar', title:'Iniciar sesion',
            variant:"contained", color:"primary", 
            onClick:()=>console.log('Po iniciar'), 
          },
      ],
      
    };
    const Bloques={
      Uno:<div>Primera pantalla</div>,
      Dos:<Formulario {...formulario}/>
    }
    return(
      <Cuerpo Bloques={Bloques}/>
    )
  }
  
  render(){
    const {esperar, seleccion, pantalla}=this.state;
    const Pantalla = seleccion ? seleccion : <Home {...this.state} />
    let dir = window.location.pathname.split('/');
    if (dir[1]!=='' && Apis[dir[1]]===undefined) window.location.pathname='';
    if (dir[1]==='' ){
      return esperar ? <Esperar/> : (
        <div> 
          <Principal 
              {...this.state}
              Pantalla={Pantalla}
              Seleccion_pantalla= {this.Seleccion_pantalla}
              Seleccion={pantalla}
              pantallas={pantallas}
          />
          <Dialogo {...this.state.dialogo} config={this.state.Config}/>
        </div>
      )
    }else{
      const Api = Apis[dir[1]];
      window.document.title= `CHS+ ${dir[1].toUpperCase()}`
      return esperar ? <Esperar/> :(
        <div>
          <Api/>
          <Snackbar open={this.state.publicidad} autoHideDuration={6000} >
            <div style={{ width:230, backgroundColor:'#fff', borderRadius:10, borderColor:'#000'}}>
              <div style={{width:'100%', height:30, backgroundColor:'gray', borderTopLeftRadius:10, borderTopRightRadius:10, flexDirection:'row', display:'flex'}}>
                <div style={{width:'20%', height:30, borderTopLeftRadius:10, color:'#fff'}}>
                  <img
                          src={Logo}
                          alt={'Logo'}
                          loading="lazy"
                          style={{height:25}}
                  />
                </div>
                <div style={{width:'60%', height:30, color:'#fff', padding:5}}>Publicidad</div>
                <div style={{width:'20%', height:30, borderTopRightRadius:10, cursor:'pointer', color:'#fff'}}
                      onClick={()=>{
                        this.Publicidad(false);
                      }}
                >
                  <IconButton onClick={()=>{
                        this.Publicidad(false);
                      }}
                  >
                      <CloseIcon fontSize="small"/>
                  </IconButton>
                </div>
              </div>
              <div onClick={()=>window.location.pathname=''}>
                <Carrusel datos={this.state.portadas} height={200}/>
              </div>
            </div>
          </Snackbar>
        </div>
      )
      
    }
  }
}

function MyApp() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [datos, setDatos]= useState({});
  const [open, setOpen]= useState(false);
  const handleClickVariant = (mensaje, variant) => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(mensaje, variant);
  };
  const handleDismiss = (key) =>{
    closeSnackbar(key)
  }
  const Ver_reporte = (datos) =>{
    setDatos(datos)
    setOpen(true)
  }
  const action = (key, datos) => (
    <div>
      <IconButton onClick={()=> Ver_reporte(datos)}>
          <ManageSearchIcon />
      </IconButton>
      <IconButton onClick={()=>handleDismiss(key)}>
          <CloseIcon />
      </IconButton>
    </div>
  );
  
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <React.Fragment>
        <InicioPrincipal noticia={handleClickVariant} action={action}/>
      </React.Fragment>
    </ThemeProvider>
  );
}

function App() {
  return (
    <SnackbarProvider maxSnack={5} dense>
        <div className="App">
          <MyApp />
        </div>
    </SnackbarProvider>
  );
}

export default App;
