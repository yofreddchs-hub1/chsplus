import React, {useState, useEffect} from 'react';
import Formulario from '../../componentes/herramientas/formulario';
import { conexiones, genera_fromulario, MaysPrimera } from '../../procesos/servicios';
import { Form_todos } from '../../constantes/formularios';
import CheckIcon from '@mui/icons-material/Check';
import Logo from './imagenes/logo.png';
import Esperar from '../../componentes/esperar';

function MisDatos (props) {
    const [state, setState]= useState({});
    
    const cambiarState = (nuevostate)=>{
        setState({...state, ...nuevostate, cambio:true})
    }
    
    const Guardar = async(valores, campos)=>{
        valores.nombres = MaysPrimera(valores.nombres);
        valores.apellidos = MaysPrimera(valores.apellidos);
        let usuario = {...valores.usuario, npassword:valores.password, nombres:valores.nombres, apellidos:valores.apellidos}
        delete valores.password
        delete valores.cpassword
        
        let respuesta = await conexiones.Guardar({campos, valores,multiples_valores:true, unico:'cedula'}, 'unefa_docente',props.User)
        if(respuesta.Respuesta==='Ok'){
            if (usuario.npassword!==''){
                usuario.newpassword = usuario.npassword
            }
            delete usuario.npassword;
            await conexiones.Guardar({valores:usuario,multiples_valores:true, unico:'username'}, 'unefa_User_api',props.User)
        }else if (respuesta.Respuesta==='Error'){
            respuesta.mensaje='Ya la cedula se encuentra previamente registrada'
        }
        return respuesta
        
    }
    const Inicio= async()=>{
        let forma = {...Form_todos('Form_unefa_docente')};
        forma.value= [...forma.value, ...Form_todos('Form_unefa_registro').value]
        forma.value[forma.value.length-3].disabled=true;
        let resultado = await conexiones.MisDatos(props.User, props.Api)
        let valores={};
        if(resultado.Respuesta==='Ok'){
            valores= {...resultado.datos}
        }
        let formulario = await genera_fromulario({ valores, campos: forma });
        formulario.titulos[2].value.asignaturas.disabled= true;
        formulario.titulos[2].value.carreras.disabled= true;
        formulario = {
            ...formulario,
            botones:[
                {
                  name:'guardar', label:'Guardar', title:'Guardar',
                  variant:"contained", color:"success", icono:<CheckIcon/>,
                  onClick: Guardar, validar:'true', 
                  sx:{...props.Config.Estilos.Botones ? props.Config.Estilos.Botones.Aceptar : {}}
                },
                
            ]
        }
        cambiarState({formulario})
    }

    useEffect(()=>{
        Inicio()
    }, props)
    
    return state.formulario ? (
        <Formulario {...state.formulario} config={props.Config}/>
      
    ) : <Esperar Logo={Logo}/>
}

export default MisDatos;