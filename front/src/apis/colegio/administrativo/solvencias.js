import React, {useState, useEffect} from 'react';
import { makeStyles} from '@mui/styles';
import Tabla from '../../../componentes/herramientas/tabla';
import { Ver_Valores} from '../../../constantes';
import { Form_todos, Titulos_todos } from '../../../constantes/formularios';
import {conexiones, genera_fromulario} from '../../../procesos/servicios';
import Dialogo from '../../../componentes/herramientas/dialogo';
import IconButton from '@mui/material/IconButton';
import Esperar from '../../../componentes/esperar/cargar';
import Stack from '@mui/material/Stack';
import moment from 'moment';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Recibopdf from '../pagar/pdf/recibo';
//Iconos
import AutorenewIcon from '@mui/icons-material/Autorenew';
import Icon from '@mui/material/Icon';
import Formulario from '../../../componentes/herramientas/formulario';


function Estilos(Estilos){
    const useStyles = makeStyles((theme) => ({
        root: {
            height:window.innerHeight* 0.78,
            
            position: "relative",
            ...Estilos.root
        },
    }))
    return useStyles()
}

function Solvencia (props) {
    const {Config} = props;
    const estilos= Config && Config.Estilos.Usuarios ? Config.Estilos.Usuarios :Ver_Valores().config.Estilos.Usuarios ? Ver_Valores().config.Estilos.Usuarios : {} //props.config.Estilos.Usuarios ? props.config.Estilos.Usurios : {}
    const classes= Estilos(estilos);
    const [state, setState]= useState({esperar:false});
    const [dialogo, setDialogo]= useState({
        open:false,  
    });
    
    let Formularios;
    const Refrescar = ()=>{
        let formulario = state.formulario ? state.formulario : Formularios;
        let periodo= formulario.titulos[0].value.periodo.value;
        let grado = formulario.titulos[0].value.grado.value;
        Ver_data(periodo, grado, formulario)
    }
    

    const cambiarState = (nuevostate)=>{
        setState({...state, ...nuevostate, cambio:true})
    }
    const Actualizar_data = (valores)=>{
        cambiarState({cantidad:valores.cantidad, datos:valores.nuevodatos})
    }
    
    const Abrir_recibo = async(valores)=>{
        const {recibo}=valores.valores
        const resultado = Recibopdf(valores);
        let Cuerpo= <embed src={`${resultado}#view=Fit&toolbar=1&navpanes=1&scrollbar=1`} type="application/pdf" width="100%" height={window.innerHeight * 0.75} />
        setDialogo({
            ...dialogo, 
            open: !dialogo.open,
            Titulo: `Recibo: ${recibo}`,
            Cuerpo: Cuerpo,
            Cerrar: ()=>setDialogo({...dialogo,open:false}),
        })

    }
    const Abrir = async(valores) =>{
        console.log(valores)
        // const {mensualidades, Formas_pago, recibo, subtotalvalor, totales}=valores.valores
        // let Fmensualidad = await genera_fromulario({valores:mensualidades, campos: Form_todos('Form_Mensualidades') })
        // Fmensualidad.titulos.meses.noeliminar=true;
        // Fmensualidad.titulos.meses.nopaginar=true;
        // Fmensualidad.titulos.meses.label='Pagos a Realizados';
        // Fmensualidad.titulos.meses.style={height:350};
        // let nuevos = Formas_pago.map((val, i)=>{
        //     return {...val,
        //         id:i+1, 
        //         formapago: val.formapago.titulo, bancoorigen: val.bancoorigen ? val.bancoorigen.titulo : '', 
        //         bancodestino: val.bancodestino ? val.bancodestino.banco.titulo : '',
        //         fecha: moment(val.fecha).format('DD-MM-YYYY')
        //     }
        // })

        // let Formapago = await genera_fromulario({valores:{formaspago:nuevos}, campos: Form_todos('Form_FormasPago') })
        // Formapago.titulos.formaspago.noeliminar=true;
        // Formapago.titulos.formaspago.nopaginar=true;
        // Formapago.titulos.formaspago.style={height:250}; 

        // let Cuerpo =
        // <Box sx={{ textAlign:'left' }}>
        //     <div style={{marginTop:-30}}/>
            
        //     <Formulario {...Fmensualidad}/>
        //     <div style={{marginTop:-60}}/>
            
        //     <Formulario {...Formapago}/>
                
        //     <div style={{marginTop:-120, paddingRight:10}}>
        //         <Stack
        //             direction={ 'column' }
        //             spacing={1}
        //             justifyContent="center"
        //             alignItems="flex-end"
        //         >
        //             <Typography variant="h5" gutterBottom component="div">
        //                 Total : Bs. {`${subtotalvalor.total.toFixed(3) }`}
        //             </Typography>
        //             <Typography variant="h5" gutterBottom component="div">
        //                 Total Cancelado: Bs. {`${totales.total.toFixed(3)}`}
        //             </Typography>
        //             <Typography variant="h5" >
        //                 Abono: {`Bs. ${totales.abono.toFixed(3)}`}
        //             </Typography>
                
                    
        //         </Stack>
        //     </div>
        // </Box>

        // let Titulo = 
        //         <Stack
        //             direction={ 'row' }
        //             spacing={1}
        //             justifyContent="center" alignItems="center"
        //         >
        //             Recibo: {recibo}
        //             <IconButton size="large" color="inherit" title={'Mostra recibo'} onClick={()=>Abrir_recibo(valores)}>
        //                 <Icon >text_snippet</Icon>
        //             </IconButton>
        //         </Stack>
        
        // setDialogo({
        //     ...dialogo, 
        //     open: !dialogo.open,
        //     Titulo,
        //     Cuerpo: Cuerpo,
        //     Cerrar: ()=>setDialogo({...dialogo,open:false}),
        // })
    }
    
    const Ver_data = async(periodo, grado, formulario=null)=>{
        cambiarState({esperar:true});
        periodo=periodo.periodo;
        const seccion = grado.seccion;
        grado=grado.grado 
        const resultado = await conexiones.Solvencias({periodo,grado,seccion});
        Formularios= formulario!==null ? formulario : Formularios;
        if (resultado.Respuesta==='Ok'){
            cambiarState({datos:resultado.mensualidades, formulario, esperar:false})
        }else{
            cambiarState({esperar:false});
        }

    }
    const Cambio_dato = async (valores)=>{
        const {periodo, grado}=valores.resultados;
        if (periodo===null || grado===null) return
        let formulario = state.formulario ? state.formulario : Formularios;
        formulario.titulos[0].value.grado.value=grado
        formulario.titulos[0].value.periodo.value=periodo
        Formularios= formulario
        Ver_data(periodo, grado, formulario)
        
    }
    const Inicio = async() =>{
        // cambiarState({esperar:true});
        let formulario = await genera_fromulario({valores:{}, campos: Form_todos('Form_filtro_solvencias') })
        const periodos =formulario.titulos[0].value.periodo.lista.sort((a,b) => a.periodo> b.periodo ? 1 : -1)
        formulario.titulos[0].value.periodo.value= periodos[0];
        formulario.titulos[0].value.periodo.lista= periodos;
        formulario.titulos[0].value.periodo.onChange= Cambio_dato;
        let grados =  Ver_Valores().config.Listas.lista_colegio_grado;
        let seccion = Ver_Valores().config.Listas.lista_colegio_seccion;
        let ngrados=[]
        grados.map(val=>{
            let dato= seccion.map(sec=>{
                return {...val, titulo:`${val.titulo} ${sec.titulo}`, grado:val.titulo, seccion: sec.titulo}
            })
            ngrados=[...ngrados, ...dato]
            return dato
        })

        formulario.titulos[0].value.grado.value= ngrados[0];
        formulario.titulos[0].value.grado.lista=ngrados
        formulario.titulos[0].value.grado.onChange= Cambio_dato;
        cambiarState({formulario})
        Formularios= formulario;
        Ver_data(periodos[0], ngrados[0], formulario)
        // Ver_data()
    }

    useEffect(()=>{
        Inicio()
    }, [])
    
    const color =  Ver_Valores().config.Estilos.Input_icono ? Ver_Valores().config.Estilos.Input_icono : {};
    return (
        <div className={classes.root}>
            {/* <div style={{width:'100%', overflowX:'auto', backgroundColor:'#0f0',   }}> */}
                <Tabla  Titulo={"Solvencias"}
                        Config={Config ? Config : Ver_Valores().config}
                        titulos={Titulos_todos(`Titulos_Solvencias`, Config)}
                        table={'colegio_mensualidad'}
                        cantidad={state.cantidad ? state.cantidad : null}
                        cargacompleta={Actualizar_data}
                        datos={state.datos}
                        Accion={Abrir}
                        cargaporparte={true }
                        sinpaginacion
                        acciones={
                            <Stack direction="row" spacing={0.5}>
                                <IconButton color={'primary'} title={'Refrescar valores de Solvencias'} onClick={Refrescar}>
                                    <AutorenewIcon style={color}/>
                                </IconButton>
                                <div style={{width:window.innerWidth * 0.35}}>
                                    {state.formulario ? <Formulario {...state.formulario} /> : null}
                                </div>
                            </Stack>
                        }
                        
                />
                
                <Dialogo  {...dialogo} config={Ver_Valores().config}/>
                <Esperar open={state.esperar}/>
                
            {/* </div> */}
        </div>
    )
}

export default Solvencia;