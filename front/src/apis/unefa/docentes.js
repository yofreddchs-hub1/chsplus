import React, {useState} from 'react';
import TablaMultiple from '../../componentes/herramientas/tabla/tabla_multiple';
import { conexiones, MaysPrimera } from '../../procesos/servicios';
import { Form_todos, Titulos_todos } from '../../constantes/formularios';

function Docentes (props) {
    const [state, setState]= useState({esperar:false});
    
    const cambiarState = (nuevostate)=>{
        setState({...state, ...nuevostate, cambio:true})
    }
    
    const Condiciones = async(campo, datos) =>{
        let {valores, campos}= datos
        valores.username = valores.cedula;
        valores.nombres = MaysPrimera(valores.nombres);
        valores.apellidos = MaysPrimera(valores.apellidos);
        
        let respuesta = await conexiones.Guardar({campos, valores,multiples_valores:true, unico:'cedula'}, 'unefa_docente',props.User)
        if(respuesta.Respuesta==='Ok'){
            if (!valores._id)
                await conexiones.Guardar({valores:{username: valores.username, newpassword: valores.cedula, nombres:`${valores.nombres}`, apellidos:valores.apellidos, categoria:3},multiples_valores:true, unico:'username'}, 'unefa_User_api',props.User)
        }else if (respuesta.Respuesta==='Error'){
            respuesta.mensaje='Ya la cedula se encuentra previamente registrada'
        }
        
        return {finalizado_condicion:true, ...respuesta}
    }
    // useEffect(()=>{
    //     Inicio()
    // }, props)
    // Table tabla de la base de datos
    // Titulo titulo de la tabla 
    // Form nombre del formulario
    //Titulos titulos de la tabla
    return (
        
            <TablaMultiple
                Config={props.Config}
                multiples_valores={true}
                Condiciones={Condiciones}
                Agregar_mas={false}
                Columnas={2} 
                Form_origen = {Form_todos(`Form_unefa_docente`)}
                Titulo_tabla={'Docentes'}
                Table = {'unefa_docente'}
                Eliminar= {'cedula'}
                Titulo_dialogo ={(dato)=> dato._id ? `Registro de ${dato.nombres} ${dato.apellidos}`: `Nuevo Docente`}
                Titulos_tabla = {Titulos_todos(`Titulos_unefa_docente`)}
                cargaporparte = {true}
                sinpaginacion = {true}
                
            />
        
      
    )
}

export default Docentes;