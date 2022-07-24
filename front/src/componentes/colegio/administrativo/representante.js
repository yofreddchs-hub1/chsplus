import React, {useState} from 'react';
import TablaMultiple from '../../herramientas/tabla/tabla_multiple';
import { Ver_Valores} from '../../../constantes';
import { Form_todos, Titulos_todos } from '../../../constantes/formularios';
import {Condicion_Estudiante, Condicion_Representante} from '../funciones'

function Representante () {
    
    const [state, setState]= useState({esperar:false});
    
    const cambiarState = (nuevostate)=>{
        setState({...state, ...nuevostate, cambio:true})
    }
    
    const Condiciones = async(campo, datos) =>{
        let {valores}= datos
        switch (campo) {
            case 'colegio_estudiante':{
                valores= await Condicion_Estudiante(datos);
                return valores
            }
            case 'colegio_representante':{
                valores = await Condicion_Representante(datos);
                return valores
            }
            default:
                return valores;
        }
    
    }
    
    return (
        
        <TablaMultiple
            Config={Ver_Valores().config}
            multiples_valores={true}
            Agregar_mas={false}
            Condiciones={Condiciones}
            Columnas={2} 
            Form_origen = {Form_todos(`Form_Representante`)}
            Titulo_tabla={'Representantes'}
            Table = {'colegio_representante'}
            Eliminar_props={(dato)=>{
                return `Desea eliminar`
            }}
            Titulo_dialogo ={(dato)=> dato._id ? `Registro `: `Nuevo Registro `}
            Titulos_tabla = {Titulos_todos(`Titulos_Representante`)}
            cargaporparte = {true}
            sinpaginacion
            
        />
        
      
    )
}

export default Representante;