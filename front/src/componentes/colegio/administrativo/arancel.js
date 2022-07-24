import React, {useState} from 'react';
import TablaMultiple from '../../herramientas/tabla/tabla_multiple';
import { Ver_Valores} from '../../../constantes';
import { Form_todos, Titulos_todos } from '../../../constantes/formularios';

function RAranceles () {
    
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
    
    return (
        
            <TablaMultiple
                Config={Ver_Valores().config}
                multiples_valores={true}
                Agregar_mas={false}
                Columnas={2} 
                Form_origen = {Form_todos(`Form_Arancel`)}
                Titulo_tabla={'Registro de Aranceles'}
                Table = {'colegio_arancel'}
                Eliminar_props={(dato)=>{
                    return `Desea eliminar`
                }}
                Titulo_dialogo ={(dato)=> dato._id ? `Registro `: `Nuevo Arancel`}
                Titulos_tabla = {Titulos_todos(`Titulos_Arancel`)}
                cargaporparte = {true}
                sinpaginacion = {true}
                
            />
        
      
    )
}

export default RAranceles;