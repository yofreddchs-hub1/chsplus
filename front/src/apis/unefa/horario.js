import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Horarios from '../../componentes/horario';
import Formulario from '../../componentes/herramientas/formulario';
import { genera_fromulario, conexiones } from '../../procesos/servicios';
import { Form_todos } from '../../constantes';
import Logo from './imagenes/logo.png';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : 'rgb(5, 30, 52)',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  
}));

export default function Horario(props) {
    const [state, setState] = React.useState({});
    const cambio = (valores)=>{
        setState({...state,...valores})
    }

    const Seleccion_Horario = (formulario)=> async(valores)=>{
        const {name, resultados}= valores;
        formulario.titulos[0].value.lista.onChange= Seleccion_Horario(formulario);
        cambio({datos:{...resultados[name], periodo:resultados.periodo.periodo, tipo: resultados.tipo.value}, formulario})
    }
    const Seleccion = async(valores)=>{
        let {name, resultados}= valores;
        resultados.tipo={value: 'docente'};
        if(resultados.tipo && resultados.periodo ){
            
            let datos = await conexiones.MisDatos(props.User, props.Api)
            let misdatos={}
            if (datos.Respuesta==='Ok'){
                misdatos=datos.datos
                let forma = {...Form_todos('Form_unefa_horario')};
                forma.value= [forma.value[0]]
                let formulario = await genera_fromulario({ valores:{...resultados}, campos: forma });
                formulario.titulos[0].value.periodo.onChange = Seleccion;

                cambio({formulario, datos:{_id:misdatos._id, titulo:`${misdatos.nombres} ${misdatos.apellidos}`, periodo:resultados.periodo.periodo, tipo: resultados.tipo.value}})   
            }
            
        }    
        return valores
    }
    const Inicio = async()=>{
        // let resultado = await conexiones.MisDatos(props.User, props.Api)
        // let misdatos={}
        // if (resultado.Respuesta==='Ok'){
        //     misdatos=resultado.datos
        // }
        let forma = {...Form_todos('Form_unefa_horario')};
        forma.value= [forma.value[0]]
        let formulario = await genera_fromulario({ valores:{}, campos: forma });
        formulario.titulos[0].value.periodo.onChange = Seleccion;
        
        cambio({formulario})
    }
    // React.useEffect(()=>{
    //     Inicio()

    // },[])
    if (state.formulario===undefined){
        Inicio()
    }
    return state.formulario ? (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={0.5}>
                <Grid item xs={12}>
                <Item style={{height: 100}}><Formulario {...state.formulario}/></Item>
                </Grid>
                <Grid item xs={12} >
                    <Item style={{}}>
                        <Horarios {...props} Datos={state.datos} Table={'unefa_horario'} Logo={Logo}/>
                    </Item>
                </Grid>
            </Grid>
        </Box>
    ): null;
}
