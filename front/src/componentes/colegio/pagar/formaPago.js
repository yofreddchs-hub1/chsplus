import React,{useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Formulario from '../../herramientas/formulario';
import IconButton from '@mui/material/IconButton';
import Icon from '@mui/material/Icon';
import Stack from '@mui/material/Stack';
import { Form_todos, Ver_Valores } from '../../../constantes';
import { genera_fromulario } from '../../../procesos/servicios';

export default function Formapago(props) {
    const [state, setState] = useState();
    let Formas
    let Formas_pago
    
    const Formularios = async(item, props)=>{
        let campos = {...Form_todos('Form_Forma_Pago')};
        let inicio_valores = props.Formas_pago ? props.Formas_pago[item] : {fecha: new Date()};
        if (inicio_valores.formapago){
            let valor = inicio_valores.formapago;
            campos.value= campos.value.filter(f=> 
                valor._id===0 || valor._id===4//Transferencia, Pago Movil
                || (valor._id===1 && ['cedula','bancodestino'].indexOf(f.nombre)===-1) //Debito
                || (valor._id===2 && ['cedula','bancodestino','referencia','bancoorigen'].indexOf(f.nombre)===-1) // efectivo bolivar
                || (valor._id===3 && ['cedula','bancodestino','bancoorigen'].indexOf(f.nombre)===-1) // efectivo dolar
            )
            if (valor._id===1){
                campos.columna= 3
            }
        }
        let nuevo={}
        campos.value = campos.value.map( val=>{
            nuevo[val.name] = inicio_valores[val.name] ? inicio_valores[val.name] : undefined
            return {...val, onChange:Cambios(item, props)}
        })
        inicio_valores={...nuevo}
        let nuevos = await genera_fromulario({valores:inicio_valores, campos });
        nuevos.titulos[0].value.formapago.onChange = select_formapago(item, props);
        if (inicio_valores.formapago===undefined){
            inicio_valores.formapago=nuevos.titulos[0].value.formapago.lista[0];
        }
        return {Forma: nuevos, Forma_dato: inicio_valores}
    }

    const Inicio = async() =>{
        Formas= props.Formas ? props.Formas : [];
        // let nuevo = Form_todos('Form_Representados');
        Formas_pago= props.Formas_pago ? props.Formas_pago : []
        if (Formas.length===0){
            let nuevos = await Formularios(0,props)
            
            Formas = [...Formas, nuevos.Forma];
            
            props.Cambio({Formas, Formas_pago:[nuevos.Forma_dato]})
        }
        
        if (props.Formas && props.Formas_pago){
            Formas=[]
            for (var i=0 ; i<props.Formas_pago.length; i++ ){
                let nuevos = await Formularios(i,props)
                Formas = [...Formas, nuevos.Forma];
            }
        }
            
        setState({Formas, Formas_pago})
    }

    const Cambios = (item,props)=> (valores) =>{
        const {name, resultados}=valores;
        Formas_pago= props.Formas_pago ? props.Formas_pago : [];
        Formas_pago[item]={...Formas_pago[item],[name]:resultados[name]}
        props.Cambio({Formas_pago})
    }

    const select_formapago= (item,props) => async(valores)=>{    
        const {name} = valores
        const valor =valores.resultados[name]
        Formas= props.Formas ? props.Formas : [];
        Formas_pago= props.Formas_pago ? props.Formas_pago : [];
        Formas_pago[item] = {...Formas_pago[item], formapago: valor}
        let nuevos = await Formularios(item,{Formas, Formas_pago})
        Formas[item] = nuevos.Forma;
        Formas_pago[item] = nuevos.Forma_dato
        
        setState({Formas, Formas_pago})
        props.Cambio({Formas, Formas_pago})
    }
    
    const Agregar = async() =>{
        Formas= props.Formas ? props.Formas : [];
        Formas_pago= props.Formas_pago ? props.Formas_pago : [];

        let inicio_valores = {fecha: new Date()};
        Formas_pago = [...Formas_pago, inicio_valores]
        let nuevos = await Formularios(Formas_pago.length-1,{Formas, Formas_pago})
        Formas = [...Formas, nuevos.Forma];
        Formas_pago[Formas_pago.length-1]=nuevos.Forma_dato
        setState({Formas, Formas_pago})
        props.Cambio({Formas, Formas_pago})
    }
    const Quitar = () =>{
        Formas= props.Formas ? props.Formas : [];
        Formas = Formas.slice(0, Formas.length-1);
        Formas_pago= props.Formas_pago ? props.Formas_pago : [];
        Formas_pago = Formas_pago.slice(0, Formas_pago.length-1);
        setState({Formas, Formas_pago})
        props.Cambio({Formas, Formas_pago})
    }
    useEffect(()=>{
        Inicio();
    },[props])
    
    return (
        <Box sx={{ textAlign:'left' }}>
            <Grid container spacing={0.5} alignItems="center">
                <Grid item xs={6}>
                    <Typography variant="h5" gutterBottom component="div">
                        Total a Cancelar: {`$ ${props.Subtotalvalor.totald.toFixed(2)}  Bs. ${props.Subtotalvalor.total.toFixed(3)}`}
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <Alert severity={props.Totales && props.Totales.mensaje==='Puede continuar' ? "success" :"error"}>
                        {props.Totales 
                            ? props.Totales.mensaje
                            : 'El monto es menor al monto a cancelar, Debe indicar todos los datos' 
                        }
                    </Alert>
                </Grid>
            </Grid>
            <br/> 
            <Divider />
            
            
            {state && state.Formas
                ? state.Formas.map((val, i)=>
                    <div key={'Formulario-'+i}>
                        <Formulario {...val}/>
                        <Divider />
                    </div>
                )
                : null
            }

            {state && state.Formas
                ?   <Grid container spacing={1} alignItems="center" justifyContent="center" sx={{marginTop:1}}>
                        <Grid item xs={5}/>
                        <Grid item xs={1}>
                            <IconButton onClick={Agregar} aria-label="add" style={{...Ver_Valores().config.Estilos ? Ver_Valores().config.Estilos.Botones.Aceptar : {}}}>
                                <Icon color={'#fff'}>add</Icon>
                            </IconButton>
                        </Grid>
                        <Grid item xs={1}>
                            <IconButton onClick={Quitar} disabled={state.Formas.length===1} aria-label="add" style={{...Ver_Valores().config.Estilos ? Ver_Valores().config.Estilos.Botones.Eliminar : {}}}>
                                <Icon color={'#fff'}>remove</Icon>
                            </IconButton>
                        </Grid>
                        <Grid item xs={5}/>
                    </Grid>
                :   null
            }
            <div style={{marginTop:20}}>
                <Stack
                    direction={ 'row' }
                    spacing={3}
                    justifyContent="flex-end"
                    alignItems="center"
                >
                    <Typography variant="h5" >
                        Abono: $ {`${props.Totales ? props.Totales.abonod>=0 ? props.Totales.abonod.toFixed(2) : 0: 0 } Bs. ${props.Totales ? props.Totales.abono>=0 ? props.Totales.abono.toFixed(3) : 0 : 0}`}
                    </Typography>
                    <Typography variant="h5" gutterBottom component="div">
                        Total: $ {`${props.Totales ? props.Totales.dolar.toFixed(2) : 0 } Bs. ${props.Totales ? props.Totales.bolivar.toFixed(3) : 0}`}
                    </Typography>
                    <Typography variant="h5" gutterBottom component="div">
                        Restan: $ {`${props.Totales ? props.Totales.restand< 0 ? (-1 * props.Totales.restand).toFixed(2) : 0: 0 } Bs. ${props.Totales ? props.Totales.restan<0 ? (-1 * props.Totales.restan).toFixed(3) : 0 : 0}`}
                    </Typography>
                    <Typography variant="h5" gutterBottom component="div">
                        Cancelado: Bs. {`${props.Totales ? props.Totales.total.toFixed(3): 0 }`}
                    </Typography>
                </Stack>
            </div>
        </Box>
    );
}
