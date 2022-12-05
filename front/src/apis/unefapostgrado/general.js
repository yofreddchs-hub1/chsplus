import React from 'react';
import TablaMultiple from '../../componentes/herramientas/tabla/tabla_multiple';

import { Form_todos, Titulos_todos } from '../../constantes/formularios';

function General (props) {
    // const [state, setState]= React.useState({esperar:false});
    
    // const cambiarState = (nuevostate)=>{
    //     setState({...state, ...nuevostate, cambio:true})
    // }
    
    
    // useEffect(()=>{
    //     Inicio()
    // }, props)
    // Table tabla de la base de datos
    // Titulo titulo de la tabla 
    // Form nombre del formulario
    //Titulos titulos de la tabla
    console.log(props)
    return (
        
            <TablaMultiple
                Config={props.Config}
                multiples_valores={true}
                Agregar_mas={false}
                Columnas={2} 
                Form_origen = {Form_todos(`${props.Form}`, props.Config)}
                Titulo_tabla={props.Titulo}
                Table = {`${props.Table}`}
                Eliminar_props={(dato)=>{
                    return `Desea eliminar`
                }}
                Titulo_dialogo ={(dato)=> {
                    if (props.Titulo_dialogo){
                        return props.Titulo_dialogo(dato)
                    }else{
                        return dato._id ? `Registro `: `Nuevo Carrera`
                    }    
                }}
                Titulos_tabla = {Titulos_todos(`${props.Titulos}`, props.Config)}
                cargaporparte = {props.cargaporparte ? props.cargaporparte: {condicion:{}}}
                sinpaginacion = {false}
                
            />
        
      
    )
}

export default General;