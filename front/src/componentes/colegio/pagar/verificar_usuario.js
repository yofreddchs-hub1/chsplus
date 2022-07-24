import React,{useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Formulario from '../../herramientas/formulario';
import { Form_todos } from '../../../constantes';
import { genera_fromulario } from '../../../procesos/servicios';

export default function Verificar(props) {
    const [formulario, setFormulario] = useState();
    const Inicio = async() =>{
        let {datos} = props
        // let nuevo = Form_todos('Form_Representados');
        let nuevos = await genera_fromulario({valores:datos.valores, campos: Form_todos('Form_Representados') })
        nuevos.titulos.representados.nopaginar=true;
        nuevos.titulos.representados.noeliminar=true;
        nuevos.titulos.representados.style={height:250};
        setFormulario(nuevos)
    }
    useEffect(()=>{
        Inicio();
    },[props])
    return (
        <Box sx={{ textAlign:'left' }}>
        <Typography variant="h5" gutterBottom component="div">
            DATOS DEL REPRESENTANTE
        </Typography>
        <Divider />
        <br/>
        <Typography variant="h5" gutterBottom component="div">
            Cedula: {props.datos.valores.cedula}
        </Typography>
        <Typography variant="h5" gutterBottom component="div">
            Nombres y Apellidos : {props.datos.valores.nombres} {props.datos.valores.apellidos}
        </Typography>
        <Typography variant="h5" gutterBottom component="div">
            Direccion : {props.datos.valores.direccion}
        </Typography>
        
        {formulario
            ? <Formulario {...formulario}/>
            : null
        }
        </Box>
    );
}
