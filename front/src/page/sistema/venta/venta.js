import React, {useState, useEffect} from 'react';
import Box from '@mui/material/Box';

import Cargando from '../../../componentes/esperar/cargar';
import { conexiones} from '../../../procesos/servicios';
import { genera_fromulario } from '../../../procesos/servicios';
import { Form_todos } from '../../../constantes';
import Formulario from '../../../componentes/herramientas/formulario';
import Scrollbars from '../../../componentes/herramientas/scrolbars';

export default function Venta(props) {
    const [formulario, setFormulario] = useState();
    const [cargando, setCargando] = useState(true);
    const Guardar= async(valores)=>{    
        if (props.Siguiente){
            props.Siguiente({valores, tipo:'Orden'});
        }   
        
        
        // const Resp = await conexiones.Ingresar_material(valores.mp);
        // setFormulario(formulario);
    }

    const Inicio= async()=>{
        setCargando(true)
        let {Config, orden_venta} = props;
        let resp =  await conexiones.Serial({tabla:'venta', id:'V', cantidad:6});
        let recibo='No recibido...';
        if (resp.Respuesta==='Ok'){
            recibo= resp.Recibo;
        }
        let nuevos = await genera_fromulario({valores:{...orden_venta}, campos: Form_todos('Form_venta') });
        nuevos.titulos[0].value.recibo.value=recibo;
        nuevos.titulos[1].value.producto.style={
            height:window.innerHeight * 0.63,
        }
        nuevos.botones=[
            {
              name:'siguiente', label:'Siguiente', title:'Siguiente',
              variant:"contained", color:"success", 
              onClick: Guardar, validar:'true', 
              sx:{...Config.Estilos.Botones ? Config.Estilos.Botones.Aceptar : {}},
            }
        ]
        setFormulario(nuevos);
        setCargando(false)
    }

    React.useEffect(()=>{
        
        Inicio()
    },[])
    
    return (
        <div style={{width:'100%', height:'100%',position: "relative"}}>
            <Scrollbars sx={{height:'100%',}}>
                {formulario 
                    ?   <Box>
                            <Formulario {...formulario}/> 
                            <div style={{marginBottom:-10}}/>
                        </Box>
                    : null}
                
            </Scrollbars>
            <Cargando open={cargando} Config={props.Config}/>
        </div>
    );
}

