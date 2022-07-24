import React, {useEffect, useState} from 'react';
import { styled, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Cuerpo from '../../herramientas/cuerpo';
import { genera_fromulario, crear_campos } from '../../../procesos/servicios';
import { Form_todos, Ver_Valores } from '../../../constantes';
import { conexiones } from '../../../procesos/servicios';
import Formulario from '../../herramientas/formulario';
import Dialogo from '../../herramientas/dialogo';
import Cargando from '../../esperar/cargar';
import Pagar from '../pagar';
import { Condicion_Estudiante, Condicion_Representante } from '../funciones';

//Iconos
import AddIcon from '@mui/icons-material/AddCircle';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import CancelIcon from '@mui/icons-material/Cancel';
import Icon from '@mui/material/Icon';


const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));


  
export default function Inscripcion() {
    const [state,setState] = useState({buscar:'', dialogo:{open:false}, esperar:false})

    const CambioState = (nuevo)=>{
        setState({...state, ...nuevo})
    }
    const Inicio = async()=>{
        let inscripcion =  await conexiones.Leer_C(['colegio_inscripcion'], {colegio_inscripcion:{}});
        if (inscripcion.Respuesta==='Ok'){
            inscripcion= inscripcion.datos.colegio_inscripcion.sort((a,b) => a.valores.periodo> b.valores.periodo ? -1 : 1).filter(f=> f.valores.estatus);
            if (inscripcion.length!==0){
                inscripcion= inscripcion[0].valores
                CambioState({inscripcion})
            }else{
                CambioState({inscripcion:{titulo:'El proceso de Inscripción no esta activo'}})
            }
            
        }
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
    const Guardar=(table, Form_origen) => async(valores, campos)=>{

        CambioState({esperar:true});
        campos = await crear_campos(campos, Form_origen)
        
        valores = await Condiciones(table, {campos, valores})    
        let nuevos;
        if (!valores.finalizado_condicion){
            
            nuevos= await conexiones.Guardar({campos, valores, multiples_valores:true},table);
        }else{
            nuevos=valores
        }
        Buscar();
    }

    const Agregar = async(dato)=>{
        let representante = {
            _id: dato._id, cedula:dato.cedula, nombres:dato.nombres, apellidos: dato.apellidos, parentesco:dato.parentesco ?  dato.parentesco.titulo : ''
        }
        let festudiante = await genera_fromulario({ valores:{representante}, campos: Form_todos('Form_Estudiante') });
        festudiante.titulos[7].value.estatus.disabled=true;
        festudiante.titulos[8].value.representante.disabled=true;
        festudiante.botones=[
            {
                name:'guardar', label:'Guardar', title:'Guardar datos de estudiante',
                variant:"contained", color:"success", icono:<CheckIcon/>,
                onClick: Guardar('colegio_estudiante', Form_todos('Form_Estudiante')), validar:'true', 
                sx:{...Ver_Valores().config.Estilos.Botones ? Ver_Valores().config.Estilos.Botones.Aceptar : {}},
            },
            {
                name:'cancelar', label:'Cancelar', title:'Cancelar',
                variant:"contained", color:"success", icono:<CancelIcon/>,
                onClick:()=>{
                    CambioState({dialogo:{open:false}})
                    Buscar()
                }, 
                sx:{...Ver_Valores().config.Estilos.Botones ? Ver_Valores().config.Estilos.Botones.Cancelar : {}},
            }
        ]
        let dialogo = {
            ...state.dialogo, 
            open: !state.dialogo.open,
            Titulo:'Agregar Estudiante',
            Cuerpo: <Formulario {...festudiante} />,
            Cerrar: ()=>{
                CambioState({dialogo:{open:false}})
                Buscar()
            },
        }
        CambioState({dialogo})
    }
    const Buscar = async()=>{
        if (state.buscar==='') return
        CambioState({esperar:true});
        let representante= await conexiones.Leer_C(['colegio_representante'],{colegio_representante:{$text: {$search: state.buscar, $caseSensitive: false}}})
        if (representante.Respuesta==='Ok'){
            representante= representante.datos.colegio_representante.filter(f=>f.valores.cedula===state.buscar);
            let Representante = {}
            if (representante.length!==0){
                Representante ={...representante[0]};
                representante = {...representante[0].valores, _id:representante[0]._id};
            }else{

                representante = {}
            }
            let frepresentante = await genera_fromulario({ valores:representante, campos: Form_todos('Form_Representante') })
            let Bloques={
                
            }
            if (representante.nombres){
                frepresentante.botones=[
                    {
                      name:'guardar', label:'Guardar', title:'Guardar ',
                      variant:"contained", color:"success", icono:<CheckIcon/>,
                      onClick: Guardar('colegio_representante', Form_todos('Form_Representante')), validar:'true', 
                      sx:{...Ver_Valores().config.Estilos.Botones ? Ver_Valores().config.Estilos.Botones.Aceptar : {}},
                    },
                    {
                        name:'agregar', label:'Agregar', title:'Agregar un nuevo estudiante',
                        variant:"contained", color:"success", icono:<AddIcon/>,
                        onClick:()=> Agregar(representante), validar:'true', 
                        sx:{...Ver_Valores().config.Estilos.Botones ? Ver_Valores().config.Estilos.Botones.Aceptar : {}},
                      },
                ]
                
                Bloques[`${representante.nombres} ${representante.apellidos}`]= <Formulario {...frepresentante} />
                let mens= await conexiones.Mensualidades({Representados:representante.representados});
                mens= mens.mensualidades;
                let pendientes=0;
                for (var i=0; i<representante.representados.length; i++){
                    let val = representante.representados[i];
                    const pos = mens.findIndex(f=> f.valores._id_estudiante===val._id && f.valores.periodo===state.inscripcion.periodo && f.valores.inscripcion)
                    if (pos!==-1){
                        pendientes+=1;
                    }
                    val = await conexiones.Leer_C(['colegio_estudiante'],{colegio_estudiante:{_id:val._id}});
                    val= {...val.datos.colegio_estudiante[0].valores, _id:val.datos.colegio_estudiante[0]._id};
                    let festudiante = await genera_fromulario({ valores:val, campos: Form_todos('Form_Estudiante') });
                    festudiante.titulos[7].value.estatus.disabled=true;
                    festudiante.botones=[
                        {
                          name:'guardar', label:'Guardar', title:'Guardar datos de estudiante',
                          variant:"contained", color:"success", icono:<CheckIcon/>,
                          onClick: Guardar('colegio_estudiante', Form_todos('Form_Estudiante')), validar:'true', 
                          sx:{...Ver_Valores().config.Estilos.Botones ? Ver_Valores().config.Estilos.Botones.Aceptar : {}},
                        }
                    ]
                    Bloques[`${val.nombres} ${val.apellidos}`]= 
                        <div>
                            {pos===-1 ? null : <Alert severity="success">{`El estudiante ${val.nombres} ${val.apellidos}, esta inscripto en el periodo ${state.inscripcion.periodo}`}</Alert>}
                            <Formulario {...festudiante} />
                        </div>
                        
                }
                Bloques['INSCRIPCION']= pendientes=== 0 
                    ?   <Pagar Representante={Representante} Inscripcion={state.inscripcion.periodo} Refrescar={Buscar}/>
                    :   <div>
                            <Alert severity="success">{`Sus representados estan inscripo en el periodo ${state.inscripcion.periodo}`}</Alert>
                        </div>
            }else{
                frepresentante.titulos[0].value.cedula.value=state.buscar
                frepresentante.datos.cedula= state.buscar;
                frepresentante.botones=[
                    {
                      name:'guardar', label:'Guardar', title:'Guardar ',
                      variant:"contained", color:"success", icono:<CheckIcon/>,
                      onClick: Guardar('colegio_representante', Form_todos('Form_Representante')), validar:'true', 
                      sx:{...Ver_Valores().config.Estilos.Botones ? Ver_Valores().config.Estilos.Botones.Aceptar : {}},
                    },
        
                ]
                Bloques[`Nuevo`]= <Formulario {...frepresentante} />
            }
            CambioState({Bloques, esperar:false})
        }
    }
    useEffect(()=>{
        Inicio()
    },[])

    return (
        <Box sx={{ flexGrow: 1, position:'relative' }}>
            <Grid container spacing={0.5}>
                <Grid item xs={12}>
                    <Item elevation={3} >
                        <Grid container spacing={0.5}>
                            <Grid item xs={4}>
                                <Paper
                                    
                                    sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: '100%' }}
                                >
                                    <InputBase
                                        sx={{ ml: 1, flex: 1 }}
                                        placeholder="Cedula de Representante"
                                        title={'Cedula del representante que desea inscribir estudiante'}
                                        onChange={(value)=>CambioState({buscar:value.target.value})}
                                        disabled={state.inscripcion ? !state.inscripcion.estatus : true}
                                        onKeyPress={(event) =>{
                                            if (event.key==='Enter')
                                              Buscar()
                                        }}
                                    />
                                    <IconButton sx={{ p: '10px' }} onClick={Buscar}
                                                disabled={state.inscripcion ? !state.inscripcion.estatus : true}
                                    >
                                        <SearchIcon />
                                    </IconButton>
                                </Paper>
                            </Grid> 
                            <Grid item xs={8}>
                                <Alert severity="info">{state.inscripcion ? state.inscripcion.titulo : '...'}</Alert>
                            </Grid>       
                        </Grid>
                    </Item>
                </Grid>
                <Grid item xs={12}>
                    <Item sx={{height:'75vh'}}>
                        <Cuerpo Bloques={state.Bloques ? state.Bloques : {}}/>

                    </Item>
                </Grid>
                
            </Grid>
            <Dialogo  {...state.dialogo} config={Ver_Valores().config}/>
            <Cargando open={state.esperar}/>
        </Box>
    )
}