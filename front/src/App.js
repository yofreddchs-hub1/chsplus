import React, {Component,  useState} from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { SnackbarProvider, useSnackbar } from 'notistack';
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

class InicioPrincipal extends Component {
  constructor(props) {
      super(props);
      this.state = {
        props: this.props,
        esperar:true,
        Login: this.Login,
        dialogo:{open:false}
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
    socket.on("Refrescar", data => {
      // this.Refrescar()
      try{
        let Config = JSON.parse(data)
        this.setState({Config})
      }catch(error) {
        console.log('El dato no es JSON en Refrescar')
      }
    })
    socket.on("Usuario_presentes", datos =>{
      // console.log('Usuarios presentes',datos)
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
        <Api/>
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
