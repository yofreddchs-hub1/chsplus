import React, {useState, useEffect} from 'react';
import TablaMultiple from '../../componentes/herramientas/tabla/tabla_multiple';
import { conexiones, MaysPrimera } from '../../procesos/servicios';
import { Form_todos, Titulos_todos } from '../../constantes/formularios';
import Logo from './imagenes/logo.png';
import Esperar from '../../componentes/esperar';

function Usuarios (props) {
    const [state, setState]= useState({esperar:true});
    
    const cambiarState = (nuevostate)=>{
        setState({...state, ...nuevostate, cambio:true})
    }
    
    const Condiciones = async(campo, datos) =>{
        let {valores, campos}= datos
        valores.categoria = valores.categoria._id;
        if (valores.npassword && valores.npassword!==''){
            valores.newpassword= valores.npassword;
        }
        delete valores.npassword;
        delete valores.cpassword;

        const respuesta = await conexiones.Guardar({valores,multiples_valores:true, unico:'username'}, 'unefa_User_api',props.User)
        // }else if (respuesta.Respuesta==='Error'){
        //     respuesta.mensaje='Ya la cedula se encuentra previamente registrada'
        // }
        
        return {finalizado_condicion:true, ...respuesta}
    }
    const Inicio = async()=>{
        let titulos_table= Titulos_todos(`Titulos_unefa_docente`);
        titulos_table[0].title='Username';
        titulos_table[0].field='username';
        titulos_table[0].formato = (dato)=>`${dato.valores.username}`;

        let form_origen = {...Form_todos(`Form_unefa_user_api`)};
        cambiarState({esperar:false, titulos_table, form_origen})
    }
    useEffect(()=>{
        Inicio()
    }, props)
    // Table tabla de la base de datos
    // Titulo titulo de la tabla 
    // Form nombre del formulario
    //Titulos titulos de la tabla
    return state.esperar ? <Esperar Logo={Logo}/> :(
        
            <TablaMultiple
                Config={props.Config}
                multiples_valores={true}
                Condiciones={Condiciones}
                Agregar_mas={false}
                Columnas={2} 
                Form_origen = {state.form_origen}
                Titulo_tabla={'Usuarios'}
                Table = {'unefa_User_api'}
                Eliminar= {'username'}
                Titulo_dialogo ={(dato)=> dato._id ? `Registro de ${dato.nombres} ${dato.apellidos}`: `Nuevo Docente`}
                Titulos_tabla = {state.titulos_table}
                cargaporparte = {true}
                sinpaginacion = {true}
                
            />
        
      
    )
}

export default Usuarios;