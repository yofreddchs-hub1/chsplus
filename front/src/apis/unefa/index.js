import * as React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Inicio_api } from '../../procesos/servicios';
import { Ver_Valores } from '../../constantes';
import Principal from '../../componentes/principal';
import Esperar from '../../componentes/esperar';
import Dialogo from '../../componentes/herramientas/dialogo';
import { genera_fromulario, Usuario, conexiones} from '../../procesos/servicios';
import { Form_todos } from '../../constantes';
import Formulario from '../../componentes/herramientas/formulario';
import Logo from './imagenes/logo.png';
import { unefa_pantallas } from './pantallas';

export default function Unefa() {
    const [state, setState] = React.useState({Dialogo:{open:false}});
    const Inicio = async() =>{
        const User = await Usuario({api:'unefa'})
        const api = await Inicio_api('unefa');
        const config = Ver_Valores().config['Api_unefa'];
        window.document.title= `CHS + ${config.Titulo}`;
        setState({...state, api:api.api, config, User})
    }

    // React.useEffect(()=>{
    //     Inicio()
    // },[])
    const Iniciar = async(datos) =>{
        const respuesta= await conexiones.Login(datos,state.api);
        if (respuesta.Respuesta==='OK'){
            await Usuario({status:'Guardar', dato:respuesta.user, api:'unefa'})
            setState({...state,
                Dialogo:{open:false}
            })
            Inicio()
        }
        return respuesta
    }
    const Salir = async(valores) =>{
        await Usuario({status:'Guardar', dato:null, api:'unefa'})
        setState({...state,
            Dialogo:{open:false}
        })
        // Inicio()
        window.location.reload()
    }
    const Login = async()=>{
        const {config, User}= state;
        let nuevos= await genera_fromulario({valores:{}, campos: Form_todos('Form_login') },1)
        if(User!==null && User!==undefined){
            nuevos.titulos= {username:{...nuevos.titulos['username'], value:User.username, disabled:true}}
        }
        const formulario ={
          ...nuevos,
          botones:[
              {
                name:'iniciar', label: User===null ? 'Iniciar' : 'Salir', title:'Iniciar',
                variant:"contained", color: "success", icono: User===null ? 'check' : 'cancel',
                onClick: User===null ? Iniciar : Salir, validar:'true', 
                sx:{...config.Estilos.Botones ? User===null ? config.Estilos.Botones.Aceptar : config.Estilos.Botones.Eliminar : {}},
              },
          ]
        }
        setState({...state,
            Dialogo:{
                open:true,
                tam:'xs',
                Titulo:'Login',
                Cuerpo:<Formulario {...formulario} Agregar={false}/>,
                Cerrar: ()=>setState({...state, Dialogo:{open:false}}),
            }
        })
    }
    const Registrar = async(valores, campos)=>{
        valores.username=valores.username.toLowerCase()
        valores.newpassword = valores.password;
        valores.categoria = 3;
        valores.master = false;
        delete valores.cpassword;
        delete valores.password;
        const respuesta = await conexiones.Guardar({valores,multiples_valores:true, unico:'username'}, 'unefa_User_api',{username:valores.username})
        if (respuesta.Respuesta==='Ok'){
            // let usuario = respuesta.resultado.filter(f=> f.valores.username===valores.username)
            // if (usuario.length!==0){
            //     usuario={...usuario[0].valores, _id:usuario[0]._id};
            await conexiones.Guardar({valores:{username: valores.username},multiples_valores:true}, 'unefa_docente',{username:valores.username})
            // }
            
            Iniciar({username:valores.username, password:valores.newpassword})
            setState({...state, Dialogo:{open:false}})
        }
        return (respuesta)
    }
    const Registro = async() =>{
        const {config, User}= state;
        let nuevos= await genera_fromulario({valores:{}, campos: Form_todos('Form_unefa_registro') },1)
        const formulario ={
          ...nuevos,
          botones:[
              {
                name:'iniciar', label: 'Registrar', title:'Registrar',
                variant:"contained", color: "success", icono: 'check',
                onClick: Registrar, validar:'true', 
                sx:{...config.Estilos.Botones ? User===null ? config.Estilos.Botones.Aceptar : config.Estilos.Botones.Eliminar : {}},
              },
          ]
        }
        setState({...state,
            Dialogo:{
                open:true,
                tam:'xs',
                Titulo:'Registro',
                Cuerpo:<Formulario {...formulario} Agregar={false}/>,
                Cerrar: ()=>setState({...state, Dialogo:{open:false}}),
            }
        })
    }
    if (Ver_Valores().config && state.config===undefined){
        Inicio()
    }
    if(state.config && window.document.title!==`CHS + ${state.config.Titulo}`){
        window.document.title= `CHS + ${state.config.Titulo}`;
    }
    const darkTheme = createTheme({
        palette: {
          mode: 'light',
        },
    });
    return state.config ?(
        <ThemeProvider theme={darkTheme}>
            <React.Fragment>
                <Principal Config={{...state.config, Logo}} Login={Login} Registro={Registro} User={state.User} Api={state.api.api} pantallas={unefa_pantallas}/>
                <Dialogo {...state.Dialogo} config={{...state.config, Logo}}/>
            
            </React.Fragment>
        </ThemeProvider>
    ) : <Esperar Logo={Logo}/>;
}
