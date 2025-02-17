import React, {useState} from 'react';
import Box from '@mui/material/Box';

import { conexiones} from '../../../procesos/servicios';
import { genera_fromulario } from '../../../procesos/servicios';
import { Form_todos } from '../../../constantes';
import Formulario from '../../../componentes/herramientas/formulario';

export default function IMP(props) {
    const [formulario, setFormulario] = useState();
    
    const Guardar= async(valores)=>{
        
        await conexiones.Ingresar_material(valores.mp);
        // setFormulario(formulario);
        Inicio()
    }

    const Inicio= async()=>{
        let {Config} = props;
        let nuevos = await genera_fromulario({valores:{}, campos: Form_todos('Form_ingreso_materia_prima') });
        nuevos.titulos.mp.style={
            height:window.innerHeight * 0.63,
        }
        nuevos.botones=[
            {
              name:'ingresar', label:'Ingresar', title:'Ingresar materiales al sistema ',
              variant:"contained", color:"success", 
              onClick: Guardar, validar:'true', 
              sx:{...Config.Estilos.Botones ? Config.Estilos.Botones.Aceptar : {}},
            }
        ]
        setFormulario(nuevos)
    }

    React.useEffect(()=>{
        
        Inicio()
    },[])
    
    return (
        <Box sx={(theme) => ({ flexGrow: 1, 
            height:'100%',
            overflow: 'hidden auto',
            '&::-webkit-scrollbar': { height: 10, width:10, WebkitAppearance: 'none' },
            '&::-webkit-scrollbar-thumb': {
                borderRadius: 8,
                border: '2px solid',
                borderColor: theme.palette.mode === 'dark' ? '' : '#E7EBF0',
                backgroundColor: 'rgba(0 0 0 / 0.5)',
            },
        })}
        >
            {formulario 
                ?   <Box>
                        <Formulario {...formulario}/> 
                        <div style={{marginBottom:-10}}/>
                    </Box>
                : null}
            
        </Box>
    );
}

