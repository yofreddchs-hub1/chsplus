import React, {useState, useEffect} from 'react';
import { makeStyles} from '@mui/styles';
import Tabla from '../../herramientas/tabla';
import { Ver_Valores} from '../../../constantes';
import { Form_todos, Titulos_todos } from '../../../constantes/formularios';
import {conexiones, genera_fromulario, Permiso} from '../../../procesos/servicios';
import Dialogo from '../../herramientas/dialogo';
import IconButton from '@mui/material/IconButton';
import Esperar from '../../esperar/cargar';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import moment from 'moment';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Recibopdf from '../pagar/pdf/recibo';
//Iconos
import AutorenewIcon from '@mui/icons-material/Autorenew';
import Icon from '@mui/material/Icon';


import Formulario from '../../herramientas/formulario';


const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

function Estilos(Estilos){
    const useStyles = makeStyles((theme) => ({
        root: {
            height:window.innerHeight* 0.78,
            
            position: "relative",
            ...Estilos.root
        },
        tabs: {
            borderRight: `1px solid ${'|'}`,
            ...Estilos.tabs
        },
        boton:{
            ...Estilos.boton
        },
        avatar: {
            width: 70,
            height: 70,
            marginRight:10
          },
    }))
    return useStyles()
}

function Recibo (props) {
    const estilos=Ver_Valores().config.Estilos.Usuarios ? Ver_Valores().config.Estilos.Usuarios : {} //props.config.Estilos.Usuarios ? props.config.Estilos.Usurios : {}
    const classes= Estilos(estilos);
    const Form_origen = Form_todos(`Form_Recibo`)
    const [state, setState]= useState({esperar:false});
    const [dialogo, setDialogo]= useState({
        open:false,  
    });
    
    let Formularios;
    let FInicio;
    let FFin;
    const Refrescar = ()=>{
        let formulario = state.formulario ? state.formulario : Formularios;
        FInicio= formulario.titulos[0].value.inicio.value;
        FFin = formulario.titulos[0].value.fin.value;
        Ver_data(FInicio, FFin, formulario)
    }
    
    const Condiciones = (valores) =>{
        return valores
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
        const {mensualidades, Formas_pago, recibo, subtotalvalor, totales}=valores.valores
        let Fmensualidad = await genera_fromulario({valores:mensualidades, campos: Form_todos('Form_Mensualidades') })
        Fmensualidad.titulos.meses.noeliminar=true;
        Fmensualidad.titulos.meses.nopaginar=true;
        Fmensualidad.titulos.meses.label='Pagos a Realizados';
        Fmensualidad.titulos.meses.style={height:350};
        let nuevos = Formas_pago.map((val, i)=>{
            return {...val,
                id:i+1, 
                formapago: val.formapago.titulo, bancoorigen: val.bancoorigen ? val.bancoorigen.titulo : '', 
                bancodestino: val.bancodestino ? val.bancodestino.banco.titulo : '',
                fecha: moment(val.fecha).format('DD-MM-YYYY')
            }
        })

        let Formapago = await genera_fromulario({valores:{formaspago:nuevos}, campos: Form_todos('Form_FormasPago') })
        Formapago.titulos.formaspago.noeliminar=true;
        Formapago.titulos.formaspago.nopaginar=true;
        Formapago.titulos.formaspago.style={height:250}; 

        let Cuerpo =
        <Box sx={{ textAlign:'left' }}>
            <div style={{marginTop:-30}}/>
            
            <Formulario {...Fmensualidad}/>
            <div style={{marginTop:-60}}/>
            
            <Formulario {...Formapago}/>
                
            <div style={{marginTop:-120, paddingRight:10}}>
                <Stack
                    direction={ 'column' }
                    spacing={1}
                    justifyContent="center"
                    alignItems="flex-end"
                >
                    <Typography variant="h5" gutterBottom component="div">
                        Total : Bs. {`${subtotalvalor.total.toFixed(3) }`}
                    </Typography>
                    <Typography variant="h5" gutterBottom component="div">
                        Total Cancelado: Bs. {`${totales.total.toFixed(3)}`}
                    </Typography>
                    <Typography variant="h5" >
                        Abono: {`Bs. ${totales.abono.toFixed(3)}`}
                    </Typography>
                
                    
                </Stack>
            </div>
        </Box>

        let Titulo = 
                <Stack
                    direction={ 'row' }
                    spacing={1}
                    justifyContent="center" alignItems="center"
                >
                    Recibo: {recibo}
                    <IconButton size="large" color="inherit" title={'Mostra recibo'} onClick={()=>Abrir_recibo(valores)}>
                        <Icon >text_snippet</Icon>
                    </IconButton>
                </Stack>
        
        setDialogo({
            ...dialogo, 
            open: !dialogo.open,
            Titulo,
            Cuerpo: Cuerpo,
            Cerrar: ()=>setDialogo({...dialogo,open:false}),
        })
    }
    
    const Ver_data = async(inicio= new Date(), fin= new Date(), formulario=null)=>{
        cambiarState({esperar:true})
        inicio.setHours(0,0,0,0);
        fin.setHours(23,59,59,999);
        // inicio=moment(inicio).format('YYYY-MM-DD');
        // fin=moment(fin).format('YYYY-MM-DD');
        let respuesta= await conexiones.Leer_C(['colegio_recibo'], 
            {
                'colegio_recibo':{createdAt: {$gte: inicio, $lte: fin}}
            }
    
        );
        if (respuesta.Respuesta==='Ok'){
            let datos =respuesta.datos.colegio_recibo.sort((a,b) => a.recibo> b.recibo ? 1 : -1);
            let totales = {total:0, pagomovil:0, transferencia:0, efectivo:0, dolar:0, debito:0};
            datos.map(val=>{
                totales.total+=val.valores.totales.total;
                val.valores.Formas_pago.map(pa=>{
                    if (pa.formapago.value==='transferencia'){
                        totales.transferencia+=Number(pa.monto)
                    }else if (pa.formapago.value==='debito'){
                        totales.debito+=Number(pa.monto)
                    }else if (pa.formapago.value==='pagomovil'){
                        totales.pagomovil+=Number(pa.monto)
                    }else if (pa.formapago.value==='efectivobolivar'){
                        totales.efectivo+=Number(pa.monto)
                    }else if (pa.formapago.value==='efectivodolar'){
                        totales.dolar+=Number(pa.monto)
                    }
                    return pa
                })
                return val
            })
            if (formulario!==null){
                cambiarState({datos, esperar:false, formulario, totales})
                Formularios= formulario
            }else{
                cambiarState({datos, esperar:false, totales})
            }
        }

    }
    const Cambio_fecha = async (valores)=>{
        const {inicio, fin}=valores.resultados;
        let formulario = state.formulario ? state.formulario : Formularios;
        if (inicio<=fin){
            FFin= fin;
            FInicio = inicio;
            formulario.titulos[0].value.inicio.onChange= Cambio_fecha;
            formulario.titulos[0].value.fin.onChange= Cambio_fecha;
            formulario.titulos[0].value.inicio.value= inicio;
            formulario.titulos[0].value.fin.value= fin;
            Ver_data(inicio, fin, formulario)
            
        }else{
            cambiarState({formulario})
        }
        
        
    }
    const Inicio = async() =>{
        FInicio= new Date();
        FFin = FInicio;
        let formulario = await genera_fromulario({valores:{inicio: FInicio, fin: FFin}, campos: Form_todos('Form_fecha_recibo') })
        formulario.titulos[0].value.inicio.onChange= Cambio_fecha;
        formulario.titulos[0].value.fin.onChange= Cambio_fecha;
        cambiarState({formulario})
        
        Ver_data(FInicio, FFin, formulario)
        // Ver_data()
    }

    useEffect(()=>{
        Inicio()
    }, [props])
    
    const color =  Ver_Valores().config.Estilos.Input_icono ? Ver_Valores().config.Estilos.Input_icono : {};
    return (
        <div className={classes.root}>
            <Tabla  Titulo={"Recibos"}
                    Config={Ver_Valores().config}
                    titulos={Titulos_todos(`Titulos_Recibo`)}
                    table={'colegio_recibo'}
                    cantidad={state.cantidad ? state.cantidad : null}
                    cargacompleta={Actualizar_data}
                    datos={state.datos}
                    Accion={Abrir}
                    cargaporparte={true}
                    sinpaginacion
                    acciones={
                        <Stack direction="row" spacing={1}>
                            <IconButton color={'primary'} title={'Refrescar valores de Recibos'} onClick={Refrescar}>
                                <AutorenewIcon style={color}/>
                            </IconButton>
                            {state.formulario ? <Formulario {...state.formulario} /> : null}
                        </Stack>
                    }
                    acciones1={ 
                        <Stack
                            direction="row"
                            divider={<Divider orientation="vertical" flexItem />}
                            spacing={1}
                            justifyContent="flex-end"
                            alignItems="center"
                        >
                            <Item title={`Total obtenido por efectivo en dolar en fecha indicada`}>Total Dolar: $ {state.totales ? state.totales.dolar.toFixed(2) : 0 }</Item>
                            <Item title={`Total obtenido por efectivo en Bolivares en fecha indicada`}>Total Efectivo: Bs. {state.totales ? state.totales.efectivo.toFixed(2) : 0 }</Item>
                            <Item title={`Total obtenido por debito en fecha indicada`}>Total Debito: Bs. {state.totales ? state.totales.debito.toFixed(2) : 0 } </Item>
                            <Item title={`Total obtenido por transferencia en fecha indicada`}>Total Transferencia: Bs. {state.totales ? state.totales.transferencia.toFixed(2) : 0 }</Item>
                            <Item title={`Total obtenido por pago movil en fecha indicada`}>Total Pago Movil: Bs. {state.totales ? state.totales.pagomovil.toFixed(2) : 0 }</Item>
                            <Item title={`Total facturado en fecha indicada`}>Total Facturado: Bs. {state.totales ? state.totales.total.toFixed(2) : 0 }</Item>
                        </Stack>
                    }
            />
            <Dialogo  {...dialogo} config={Ver_Valores().config}/>
            <Esperar open={state.esperar}/>
        
        </div>
    )
}

export default Recibo;