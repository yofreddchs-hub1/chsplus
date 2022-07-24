import React, {useState} from 'react';
import TablaMultiple from '../../componentes/herramientas/tabla/tabla_multiple';
import { Ver_Valores } from '../../constantes';
import { Form_todos, Titulos_todos } from '../../constantes/formularios';

function Carreras (props) {
    const [state, setState]= useState({esperar:false});
    
    const cambiarState = (nuevostate)=>{
        setState({...state, ...nuevostate, cambio:true})
    }
    
    
    // useEffect(()=>{
    //     Inicio()
    // }, props)
    
    return (
        
            <TablaMultiple
                Config={props.Config}
                multiples_valores={true}
                Agregar_mas={false}
                Columnas={2} 
                Form_origen = {Form_todos(`Form_unefa_carreras`)}
                Titulo_tabla={'Carreras'}
                Table = {'unefa_carrera'}
                Eliminar_props={(dato)=>{
                    return `Desea eliminar`
                }}
                Titulo_dialogo ={(dato)=> dato._id ? `Registro `: `Nuevo Carrera`}
                Titulos_tabla = {Titulos_todos(`Titulos_unefa_carreras`)}
                cargaporparte = {true}
                sinpaginacion = {true}
                
            />
        
      
    )
}

export default Carreras;