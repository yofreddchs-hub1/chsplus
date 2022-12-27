import React, {useState, useEffect} from 'react';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import Cargando from '../../../componentes/esperar/cargar';
import { genera_fromulario } from '../../../procesos/servicios';
import { Form_todos } from '../../../constantes';
import Formulario from '../../../componentes/herramientas/formulario';
import Scrollbars from '../../../componentes/herramientas/scrolbars';
import TablaMostrar from '../../../componentes/herramientas/tablamostrar';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.subtitle1,
    padding: theme.spacing(1),
    textAlign: 'left',
    color: theme.palette.text.secondary,
    textTransform:'uppercase'
}));

export default function ConfirmarPago(props) {
    const [formulario, setFormulario] = useState();
    const [cargando, setCargando] = useState(true);
    let {Config, formapago, orden_venta} = props;
    const Guardar= async(valores)=>{    
        if (props.Procesar){
            props.Procesar({valores, tipo:'FormaPago'});
        }   
    }

    const Inicio= async()=>{
        setCargando(true)
        let {formapago, orden_venta} = props;
        let nuevos = await genera_fromulario({valores:{...orden_venta}, campos: Form_todos('Form_venta') });
        nuevos.titulos=[nuevos.titulos[1]];
        nuevos.titulos[0].value.producto.Form = undefined;
        nuevos.titulos[0].value.producto.style={height:200, marginBottom:5};
        let totales={...orden_venta['producto-subtotal']}
        let nuevos1 = await genera_fromulario({valores:{...formapago, totales}, campos: Form_todos('Form_FormasPago') });
        nuevos1.titulos.formapago.Form = undefined;
        nuevos1.titulos.formapago.style={height:180, marginBottom:5};
        let botones = {
            datos:{},
            titulos:{},
            botones:[
                ... props.Atras 
                    ? [{
                        name:'atras', label:'Atras', title:'Atras',
                        variant:"contained", color:"success", 
                        onClick: props.Atras, 
                        sx:{...Config.Estilos.Botones ? Config.Estilos.Botones.Aceptar : {}},
                    }]
                    : [] ,
                {
                name:'procesar', label:'Procesar', title:'Procesar',
                variant:"contained", color:"success", 
                onClick: Guardar,
                sx:{...Config.Estilos.Botones ? Config.Estilos.Botones.Aceptar : {}},
                confirmar:'true', confirmar_mensaje:'Desea realizar proceso de venta?'
                }
            ]
        }
        
        setFormulario({orden: nuevos, formapago:nuevos1, botones});
        setCargando(false)
    }

    React.useEffect(()=>{
        
        Inicio()
    },[])
    
    return (
        <div style={{width:'100%', height:'100%',position: "relative"}}>
            <Scrollbars sx={{height:'100%',}}>
            
                <Grid container spacing={1}>
                    <Grid xs={4}>
                        <Item elevation={6}>Control: {orden_venta && orden_venta.recibo ? orden_venta.recibo : 'np'}</Item>
                    </Grid>
                    <Grid xs={8}>
                        <Item elevation={6}>Cliente: {orden_venta && orden_venta.cliente ? orden_venta.cliente.nombre : ''}</Item>
                    </Grid>
                    <Grid xs={12}>
                        <Item elevation={6}>
                            {formulario ? 
                                <TablaMostrar datos={orden_venta && orden_venta.producto ? {movimiento:orden_venta.producto} : {movimiento:[]}}  {...formulario && formulario.orden.titulos ? formulario.orden.titulos[0].value.producto : {}}/>     
                                : null
                            }
                        </Item>
                    </Grid>
                    <Grid xs={12}>
                        <Item elevation={6}>
                            {formulario ? 
                                <TablaMostrar datos={formapago && formapago.formapago ? {movimiento:formapago.formapago} : {movimiento:[]}}  {...formulario && formulario.formapago.titulos ? formulario.formapago.titulos.formapago : {}}/>     
                                : null
                            }
                        </Item>
                    </Grid>
                    <Grid
                        xs={12}
                        container
                        justifyContent="space-between"
                        alignItems="center"
                        flexDirection={{ xs: 'column', sm: 'row' }}
                        sx={{ fontSize: '12px' }}
                        >
                        <Grid sx={{ order: { xs: 2, sm: 1 } }}/>
                            
                        <Grid container columnSpacing={1} sx={{ order: { xs: 1, sm: 2 } }}>
                            <Grid>
                                <Item elevation={6}>Tasa {formapago && formapago.totales ? formapago.totales.Tasa : 0 }</Item>
                            </Grid>
                            <Grid>
                                <Item elevation={6}>Total</Item>
                            </Grid>
                            <Grid>
                                <Item sx={{width:100, textAlign:'right'}} elevation={6}>$ {formapago && formapago.totales ? formapago.totales.total : 0}</Item>
                            </Grid>
                            <Grid>
                                <Item sx={{width:130, textAlign:'right'}} elevation={6}>Bs {formapago && formapago.totales ? formapago.totales.totalb : 0}</Item>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid
                        xs={12}
                        container
                        justifyContent="space-between"
                        alignItems="center"
                        flexDirection={{ xs: 'column', sm: 'row' }}
                        sx={{ fontSize: '12px' }}
                        >
                        <Grid sx={{ order: { xs: 2, sm: 1 } }}/>
                            
                        <Grid container columnSpacing={1} sx={{ order: { xs: 1, sm: 2 } }}>
                            <Grid>
                                <Item elevation={6}>Cancelado</Item>
                            </Grid>
                            <Grid>
                                <Item sx={{width:100, textAlign:'right'}} elevation={6}>
                                    $ {formapago && formapago['formapago-subtotal'] 
                                        ? formapago['formapago-subtotal'].total.toFixed(2) 
                                        : Number(0).toFixed(2) 
                                        }
                                </Item>
                            </Grid>
                            <Grid>
                                <Item sx={{width:130, textAlign:'right'}} elevation={6}>
                                    Bs {formapago && formapago['formapago-subtotal'] 
                                            ? formapago['formapago-subtotal'].totalb.toFixed(2) 
                                            : Number(0).toFixed(2) 
                                        }
                                </Item>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid
                        xs={12}
                        container
                        justifyContent="space-between"
                        alignItems="center"
                        flexDirection={{ xs: 'column', sm: 'row' }}
                        sx={{ fontSize: '12px' }}
                        >
                        <Grid sx={{ order: { xs: 2, sm: 1 } }}/>
                            
                        <Grid container columnSpacing={1} sx={{ order: { xs: 1, sm: 2 } }}>
                            <Grid>
                                <Item elevation={6}>Restante</Item>
                            </Grid>
                            <Grid>
                                <Item sx={{width:100, textAlign:'right'}} elevation={6}>
                                    $  {formapago && formapago['formapago-subtotal'] && formapago['formapago-subtotal'].restan 
                                            ? formapago['formapago-subtotal'].restan.toFixed(2) 
                                            : Number(0).toFixed(2) 
                                        }
                                </Item>
                            </Grid>
                            <Grid>
                                <Item sx={{width:130, textAlign:'right'}} elevation={6}>
                                    Bs {formapago && formapago['formapago-subtotal'] && formapago['formapago-subtotal'].restanb 
                                            ? formapago['formapago-subtotal'].restanb.toFixed(2) 
                                            : Number(0).toFixed(2) 
                                        }
                                </Item>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid xs={12}>
                        
                        <Stack sx={{ width: '100%', marginTop:1, padding:1 }} spacing={2}>
                            {formapago['formapago-subtotal'] && formapago['formapago-subtotal'].restan
                                ?   <Alert severity="error">Pendiente $ {formapago['formapago-subtotal'].restan.toFixed(2)}</Alert>
                                :   null
                                // :   <Alert severity="success"></Alert>
                            
                            }
                        </Stack>
                        
                    </Grid>
                    <Grid xs={12}>
                        <div style={{marginTop:-10}}>
                            {formulario 
                                ?   <Formulario {...formulario.botones}/>
                                :   null
                            }
                        </div>
                    </Grid>
                </Grid>
                
            </Scrollbars>
            <Cargando open={cargando} Config={props.Config}/>
        </div>
    );
}

