import React,{useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Formulario from '../../../componentes/herramientas/formulario';
import { Form_todos } from '../../../constantes';
import { genera_fromulario } from '../../../procesos/servicios';
import moment from 'moment';

export default function Confirmar(props) {
    const [formulario, setFormulario] = useState();
    const Inicio = async() =>{
        
        let mensualidades=props.Mensualidades ? props.Mensualidades : {meses:[]}
        console.log(props)
        if (props.Totales && (props.Totales.abono>0 || props.Totales.abonod>0)){
            mensualidades.meses= [...mensualidades.meses,
                {
                    id:mensualidades.meses.length+1,
                    periodo:mensualidades.meses[mensualidades.meses.length-1].periodo, value:'abono', 
                    _id:`Abono-${mensualidades.meses.length}`, cedula:'Abono',
                    nombres:'Abono', apellidos:'Queda',
                    descripcion:`Abono`,
                    montod: props.Totales.abonod, 
                    monto: props.Totales.abono
                }
            ]
        }
        let Fmensualidad = await genera_fromulario({valores:mensualidades, campos: Form_todos('Form_Mensualidades', Config) })
        Fmensualidad.titulos.meses.noeliminar=true;
        Fmensualidad.titulos.meses.nopaginar=true;
        Fmensualidad.titulos.meses.label='Pagos a Realizar';
        Fmensualidad.titulos.meses.style={height:350};

        let nuevos = props.Formas_pago.map((val, i)=>{
            return {...val,
                id:i+1, 
                formapago: val.formapago.titulo, bancoorigen: val.bancoorigen ? val.bancoorigen.titulo : '', 
                bancodestino: val.bancodestino ? val.bancodestino.banco.titulo : '',
                fecha: moment(val.fecha).format('DD-MM-YYYY')
            }
        })

        let Formapago = await genera_fromulario({valores:{formaspago:nuevos}, campos: Form_todos('Form_FormasPago', Config) })
        Formapago.titulos.formaspago.noeliminar=true;
        Formapago.titulos.formaspago.nopaginar=true;
        Formapago.titulos.formaspago.style={height:250};
        setFormulario({Mensualidad: Fmensualidad, Formapago})

    }
    useEffect(()=>{
        Inicio();
    },[props])
    const {Config} = props;
    
    return (
        <Box sx={{ textAlign:'left' }}>
            <div style={{marginTop:-30}}/>
            {formulario && formulario.Mensualidad
                ? <Formulario {...formulario.Mensualidad} config={props.Config}/>
                : null
            }
            <div style={{marginTop:-60}}/>
            {formulario && formulario.Formapago
                ? <Formulario {...formulario.Formapago} config={props.Config}/>
                : null
            }
            <div style={{marginTop:-120, paddingRight:10}}>
                <Stack
                    direction={ 'column' }
                    spacing={1}
                    justifyContent="center"
                    alignItems="flex-end"
                >
                    <Typography variant="h5" gutterBottom component="div" sx={{...Config ? {color:Config.Estilos.Input_label}: {}}}>
                        Total : Bs. {`${props.Subtotalvalor ? props.Subtotalvalor.total.toFixed(3): '0.000' }`}
                    </Typography>
                    <Typography variant="h5" gutterBottom component="div" sx={{...Config ? {color:Config.Estilos.Input_label}: {}}}>
                        Total Cancelado: Bs. {`${props.Totales ? props.Totales.total.toFixed(3): '0.000' }`}
                    </Typography>
                    <Typography variant="h5" sx={{...Config ? {color:Config.Estilos.Input_label}: {}}}>
                        Abono: {`Bs. ${props.Totales ? props.Totales.abono>=0 ? props.Totales.abono.toFixed(3) : 0 : '0.000'}`}
                    </Typography>
                
                    
                </Stack>
            </div>
        </Box>
    );
}