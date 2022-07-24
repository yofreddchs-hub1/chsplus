import React, {useState} from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Logo from '../../../imagenes/enconstruccion.png'
import Representante from './representante';
import Pasos from './pasos';
import { conexiones } from '../../../procesos/servicios';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  height:window.innerHeight * 0.8,

}));

export default function Pagar(props) {
  const [state, setState]= useState({
    pantalla:props.Representante ? 'Pasos' : 'Representante', 
    datos: props.Representante ? props.Representante : [],
    monstrar_representante: !props.Representante,
    inscripcion: props.Inscripcion,
    Refrescar: props.Refrescar
  });
  
  const Cambio = (valor) =>{
    valor={...state, ...valor}
    if (valor.Formas_pago){
      valor = Calcular(valor)
    }
    setState({...valor})
  }
  
  const Calcular = (valores) =>{
    let {Formas_pago}= valores;
    const {valorCambio}= state;
    let bolivar=0;
    let dolar=0;
    let abono=0;
    let abonod=0;
    let aprobar = true;
    Formas_pago.map(val=>{
      if ([0,1,2,4].indexOf(val.formapago._id)!==-1){
        bolivar+= val.monto ? Number(val.monto) : 0;
      }else{
        dolar+= val.monto ? Number(val.monto) : 0;
      }
      Object.keys(val).map(n=>{
        if ([undefined, null, ''].indexOf(val[n])!==-1){
          aprobar=false;
        }
        return n
      })
      return val
    })
    const total= bolivar + (dolar * valorCambio);
    const totald= dolar + (bolivar / valorCambio);
    abono = bolivar!==0 ? total - state.Subtotalvalor.total : 0;
    abonod = dolar!==0 && bolivar===0 ? totald - state.Subtotalvalor.totald : 0;
    let restan = total - state.Subtotalvalor.total;
    let restand = totald - state.Subtotalvalor.totald;
    let mensaje = '';
    if (restan.toFixed(3)<0){
      mensaje= 'El monto es menor al monto a cancelar, ';
    }
    if (!aprobar){
      mensaje = mensaje + 'Debe indicar todos los datos';
    }
    if (mensaje==='') mensaje = 'Puede continuar'
    return {...valores, Totales:{bolivar, total, abono, restan, dolar, totald, abonod, restand, mensaje}}
  }

  const Enviar = async() =>{
    const {datos, Formas_pago, Mensualidades, Subtotalvalor, Totales, valorCambio} = state
    const resultado = await conexiones.Enviar_pago({Representante:datos._id, Formas_pago, Mensualidades, Subtotalvalor, Totales, valorCambio})
    if (resultado.Respuesta==='Ok'){
      setState({...state, Recibo: resultado.dato})
    }
    return resultado.Respuesta
  }
  return state.pantalla==='Representante'
    ? <Representante  Cambio={Cambio}/>
    : state.pantalla==='Pasos'
    ? <Pasos {...state} Cambio={Cambio} Enviar={Enviar}/>
    : (
        <Box sx={{ flexGrow: 1 }}>
        
        </Box>
      );
}