import React, {useState} from 'react';
import TablaMultiple from '../../componentes/herramientas/tabla/tabla_multiple';
import { conexiones, MaysPrimera, genera_fromulario } from '../../procesos/servicios';
import { Form_todos, Titulos_todos } from '../../constantes/formularios';
import Formulario from '../../componentes/herramientas/formulario';
import Dialogo from '../../componentes/herramientas/dialogo';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import CancelIcon from '@mui/icons-material/Cancel';

function Docentes (props) {
    const [state, setState]= useState({esperar:false, Dialogo:{open:false}});
    
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
    
    const Eliminar = async(valores)=>{
        console.log(valores);
    }

    const Cambio = (valores) =>{
        console.log('Por aqui', valores.resultados)
        Seleccion_1(valores.resultados);
    }

    const Seleccion = (valores)=>{
        if (valores.valores){
            valores={...valores.valores, _id:valores._id}
        }
        Seleccion_1(valores);
    }
    const Seleccion_1= async(valores)=>{
        let forma= Form_todos(`Form_unefa_docente`);
        const pos = forma.value.findIndex(f=> f.nombre==='asignaturas');
        if (pos!==-1){
            let condicion = valores.carreras.map(v=>{
                return {"valores.carrera._id": v._id}
            })
            condicion={$or:condicion}
            forma.value[pos].condicion=condicion;
        }
        const pos1 = forma.value.findIndex(f=> f.nombre==='carreras');
        if (pos1!==-1){
            forma.value[pos1].onChange= Cambio;
        }
        const nuevos = valores._id!==undefined
                                    ? await genera_fromulario({valores, campos: forma })
                                    : await genera_fromulario({valores:{},  campos: forma})
        
        // let resultado= await conexiones.Leer_C(['unefa_asignatura'],{unefa_asignatura:condicion})
        // console.log(resultado)
        let dato=nuevos.datos;
        const pguardar= true//await Permiso('guardar');
        const peliminar= true//await Permiso('eliminar')
        const formulario ={
            ...nuevos,
            // datos:valores,
            // titulos:genera_fromulario(valores).titulos,
            forma,
            botones:[
                {
                  name:'guardar', label:'Guardar', title:'Guardar ',
                  variant:"contained", color:"success", icono:<CheckIcon/>,
                  onClick: Condiciones, validar:'true', 
                  sx:{...props.Config.Estilos.Botones ? props.Config.Estilos.Botones.Aceptar : {}},
                  disabled: !pguardar,
                },
                ...dato._id!==undefined  && peliminar
                    ?
                        [{
                        name:'eliminar', label:'Eliminar', title:'Eliminar ',
                        variant:"contained", color:"secondary", icono:<DeleteIcon/>,
                        sx:{...props.Config.Estilos.Botones ? props.Config.Estilos.Botones.Eliminar : {}},
                        confirmar:'true', confirmar_mensaje:'Desea eliminar',confirmar_campo:props.Eliminar ? props.Eliminar : '_id',
                        onClick: Eliminar,
                        }]
                    :[],
                {
                  name:'cancelar', label:'Cancelar', title:'Cancelar',
                  variant:"contained",  icono:<CancelIcon/>,
                  sx:{...props.Config.Estilos.Botones ? props.Config.Estilos.Botones.Cancelar : {}},
                  onClick: ()=>cambiarState({Dialogo:{open:false}})
                },
            ]
        }
        cambiarState({Dialogo:{
            open:true,
            Titulo:()=> dato._id ? `Registro de ${dato.nombres} ${dato.apellidos}`: `Nuevo Docente`,
            Cuerpo:<Formulario {...formulario} config={props.Config}/>,
            Cerrar:()=>cambiarState({Dialogo:{open:false}})
        }})
    }
    // useEffect(()=>{
    //     Inicio()
    // }, props)
    // Table tabla de la base de datos
    // Titulo titulo de la tabla 
    // Form nombre del formulario
    //Titulos titulos de la tabla
    return (
        <div>
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
                cargaporparte = {{condicion:{}, sort:{"valores.cedula":1}}}
                sinpaginacion = {false}
                Seleccion={Seleccion}
            />
            <Dialogo {...state.Dialogo} config={props.Config}/>
        </div>
      
    )
}

export default Docentes;