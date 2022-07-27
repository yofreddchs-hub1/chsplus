import React, {useState} from 'react';
import TablaMultiple from '../../componentes/herramientas/tabla/tabla_multiple';

import { Form_todos, Titulos_todos } from '../../constantes/formularios';

function General (props) {
    const [state, setState]= useState({esperar:false});
    
    const cambiarState = (nuevostate)=>{
        setState({...state, ...nuevostate, cambio:true})
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
                Agregar_mas={false}
                Columnas={2} 
                Form_origen = {Form_todos(`${props.Form}`)}
                Titulo_tabla={props.Titulo}
                Table = {`${props.Table}`}
                Eliminar_props={(dato)=>{
                    return `Desea eliminar`
                }}
                Titulo_dialogo ={(dato)=> dato._id ? `Registro `: `Nuevo Carrera`}
                Titulos_tabla = {Titulos_todos(`${props.Titulos}`)}
                cargaporparte = {props.cargaporparte ? props.cargaporparte: {condicion:{}}}
                sinpaginacion = {false}
                
            />
        
      
    )
}

export default General;