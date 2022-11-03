import React, {useState} from 'react';
import TablaMultiple from '../../../componentes/herramientas/tabla/tabla_multiple';
import { Ver_Valores} from '../../../constantes';
import { Form_todos, Titulos_todos } from '../../../constantes/formularios';
import {Condicion_Estudiante, Condicion_Representante} from '../funciones'

function RInscripcion (props) {
    
    const [state, setState]= useState({esperar:false});
    
    const cambiarState = (nuevostate)=>{
        setState({...state, ...nuevostate, cambio:true})
    }
    
    const Inicio = async() =>{
        console.log('Por aqui')
        cambiarState({esperar:false})
    }

    // useEffect(()=>{
    //     Inicio()
    // }, props)
    const {Config}= props;
    return (
        
            <TablaMultiple
                Config={Config ? Config : Ver_Valores().config}
                multiples_valores={true}
                Agregar_mas={false}
                Columnas={2} 
                Form_origen = {Form_todos(`Form_Inscripcion`, Config)}
                Titulo_tabla={'Registro Inscripciones'}
                Table = {'colegio_inscripcion'}
                Eliminar_props={(dato)=>{
                    return `Desea eliminar`
                }}
                Titulo_dialogo ={(dato)=> dato._id ? `Registro `: `Nueva Inscripcion `}
                Titulos_tabla = {Titulos_todos(`Titulos_Inscripcion`, Config)}
                cargaporparte = {true}
                sinpaginacion = {true}
                
            />
        
      
    )
}

export default RInscripcion;