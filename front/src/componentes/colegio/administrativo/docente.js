import React, {useState, useEffect} from 'react';
import TablaMultiple from '../../herramientas/tabla/tabla_multiple';
import { Ver_Valores} from '../../../constantes';
import { Form_todos, Titulos_todos } from '../../../constantes/formularios';


function Docente () {
    
    const [state, setState]= useState({esperar:false});
    
    const cambiarState = (nuevostate)=>{
        setState({...state, ...nuevostate, cambio:true})
    }
    
    const Condiciones = (valores) =>{
        return valores
    }

    const Inicio = async() =>{
        console.log('Por aqui')
        cambiarState({esperar:false})
    }

    // useEffect(()=>{
    //     Inicio()
    // }, props)
    
    return (
        
            <TablaMultiple
                Config={Ver_Valores().config}
                multiples_valores={true}
                Agregar_mas={false}
                Condiciones={Condiciones}
                Columnas={2} 
                Form_origen = {Form_todos(`Form_Docente`)}
                Titulo_tabla={'Docentes'}
                Table = {'colegio_docente'}
                Eliminar_props={(dato)=>{
                    return `Desea eliminar`
                }}
                Titulo_dialogo ={(dato)=> dato._id ? `Registro `: `Nuevo Registro `}
                Titulos_tabla = {Titulos_todos(`Titulos_Docente`)}
                cargaporparte = {true}
               
                
            />
        
      
    )
}

export default Docente;