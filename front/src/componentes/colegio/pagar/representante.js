import React, {useState, useEffect} from 'react';
import Esperar from '../../esperar/cargar';
import TablaMultiple from '../../herramientas/tabla/tabla_multiple';
import { Ver_Valores} from '../../../constantes';
import { Form_todos, Titulos_todos } from '../../../constantes/formularios';


function Representante_pagar (props) {
    
    const [state, setState]= useState({esperar:false});
    
    const cambiarState = (nuevostate)=>{
        setState({...state, ...nuevostate, cambio:true})
    }
    const Actualizar_data = (valores)=>{
        
        cambiarState({cantidad:valores.cantidad, datos:valores.nuevodatos})
    }
    
    const Refrescar = ()=>{
        cambiarState({cantidad:-1, datos:[]})
    }
    
    const Condiciones = (valores) =>{
        return valores
    }

    const Seleccion = (valores) =>{
        if (props.Cambio) props.Cambio({pantalla:'Pasos', datos:valores, Meses:{}, Mensualidades:{meses:[]}, 
                                            Formas:undefined, Formas_pago:undefined, 
                                            Subtotalvalor:{abono:valores.valores.abono, abonod:valores.valores.abonod}
                                        })
    }

    // const Inicio = async() =>{
    //     console.log('Por aqui')
    //     cambiarState({esperar:false})
    // }

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
                Form_origen = {Form_todos(`Form_Representante`)}
                Titulo_tabla={'Representantes'}
                Table = {'colegio_representante'}
                Eliminar_props={(dato)=>{
                    return `Desea eliminar`
                }}
                Titulo_dialogo ={(dato)=> dato._id ? `Registro `: `Nuevo Registro `}
                Titulos_tabla = {Titulos_todos(`Titulos_Representante`)}
                cargaporparte = {true}
                Acciones={
                    <div></div>
                }
                Seleccion={Seleccion}
                sinpaginacion = {true}
            />
        
      
    )
}

export default Representante_pagar;