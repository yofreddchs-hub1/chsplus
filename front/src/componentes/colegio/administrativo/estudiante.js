import React, {useState, useEffect} from 'react';
import Stack from '@mui/material/Stack';
import { Box } from '@mui/material';
import Dialogo from '../../herramientas/dialogo';
import IconButton from '@mui/material/IconButton';
import Icon from '@mui/material/Icon';
import TablaMultiple from '../../herramientas/tabla/tabla_multiple';
import Tabla from '../../herramientas/tabla';
import { Ver_Valores} from '../../../constantes';
import { Form_todos, Titulos_todos } from '../../../constantes/formularios';
import {Condicion_Estudiante, Condicion_Representante} from '../funciones';
import { conexiones } from '../../../procesos/servicios';


function Estudiante () {
    
    const [state, setState]= useState({esperar:false, Dialogo:{open:false}});
    
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
        

    const Inicio = async() =>{
        console.log('Por aqui')
        cambiarState({esperar:false})
    }

    // useEffect(()=>{
    //     Inicio()
    // }, props)
    const Resumen = async(dato)=>{
        console.log(dato)
        const resultado = await conexiones.Resumen(dato);
        console.log(resultado)
        let {recibos, mensualidad} = resultado;
        const Cuerpo= 
            <div>
                <Tabla  Titulo={"Solvencias"}
                        Config={Ver_Valores().config}
                        titulos={Titulos_todos(`Titulos_Solvencias`)}
                        table={'colegio_mensualidad'}
                        cantidad={mensualidad ? mensualidad.length : 0}
                        datos={mensualidad ? mensualidad : []}
                        cargaporparte={true }
                        sinpaginacion
                        
                />
                <Tabla  Titulo={"Recibos"}
                    Config={Ver_Valores().config}
                    titulos={Titulos_todos(`Titulos_Recibo`)}
                    table={'colegio_recibo'}
                    cantidad={recibos ? recibos.length : 0}
                    datos={recibos ? recibos : []}
                    // Accion={Abrir}
                    cargaporparte={true}
                    sinpaginacion         
                />
            </div>
        cambiarState({
            Dialogo:{
                open: !state.Dialogo.open,
            Titulo: `Resumen: ${dato.nombres} ${dato.apellidos}`,
            Cuerpo: Cuerpo,
            Cerrar: ()=>cambiarState({Dialogo: {open:false}}),
            }
        })
    }
    const Titulo = (dato)=>{

        console.log(dato);
        const texto = dato._id ? `Registro de ${dato.nombres} ${dato.apellidos}`: `Nuevo Registro `
        return <Stack
                    direction={ 'row' }
                    spacing={1}
                    justifyContent="center" alignItems="center"
                >
                    {texto}
                    <IconButton size="large" color="inherit" title={'Resumen'} onClick={()=>Resumen(dato)}>
                        <Icon >assignment</Icon>
                    </IconButton>
                </Stack>

    }
    return (
        <Box>
            <TablaMultiple
                Config={Ver_Valores().config}
                multiples_valores={true}
                Agregar_mas={false}
                Condiciones={Condiciones}
                Columnas={2} 
                Form_origen = {Form_todos(`Form_Estudiante`)}
                Titulo_tabla={'Estudiantes'}
                Table = {'colegio_estudiante'}
                Eliminar_props={(dato)=>{
                    return `Desea eliminar`
                }}
                Titulo_dialogo ={Titulo}
                Titulos_tabla = {Titulos_todos(`Titulos_Estudiante`)}
                cargaporparte = {true}
                sinpaginacion = {true}
                
            />
            <Dialogo {...state.Dialogo} config={Ver_Valores().config}/>
        </Box>
    )
}

export default Estudiante;