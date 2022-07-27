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
import Cargando from '../../componentes/esperar/cargar';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : 'rgb(5, 30, 52)',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  
}));

export default function Horarios_unefa(props) {
    const [state, setState] = React.useState({cargando:true});
    const [cargando, setCargando] = React.useState(true);
    const cambio = (valores)=>{
        setState({...state,...valores})
    }

    const Seleccion_Horario = (formulario)=> async(valores)=>{
        const {name, resultados}= valores;
        formulario.titulos[0].value.lista.onChange= Seleccion_Horario(formulario);
        cambio({datos:{...resultados[name], periodo:resultados.periodo.periodo, tipo: resultados.tipo.value}, formulario})
    }

    const Seleccion = async(valores)=>{
        const {resultados}= valores;
        if(resultados.tipo && resultados.periodo && resultados.carrera){
            setCargando(valores)
        }
        
        return valores
    }
    
    
    React.useEffect(()=>{
        let active = true;

        if (!cargando) {
        return undefined;
        }

        if (cargando && state.formulario===undefined){
            //Inicio
            (async () => {
                let formulario = await genera_fromulario({ valores:{}, campos: Form_todos('Form_unefa_horario') });
                formulario.titulos[0].value.carrera.onChange = Seleccion;
                formulario.titulos[0].value.periodo.onChange = Seleccion;
                formulario.titulos[0].value.tipo.onChange = Seleccion;
                if (active) {
                    cambio({formulario});
                    setCargando(false)
                }
            })();
            return
        }
        (async () => {
            //Buscar los datos
            const {resultados}= cargando;
            let datos= await conexiones.Leer_C([`unefa_${resultados.tipo.value}`, ...resultados.tipo.value==='seccion' ? ['unefa_asignatura','unefa_docente'] :[]], 
                {
                    [`unefa_${resultados.tipo.value}`]:{},//{$text: {$search: resultados.carrera.nombres, $caseSensitive: false}},
                    ...resultados.tipo.value==='seccion' ? {unefa_asignatura:{"valores.carrera._id":resultados.carrera._id}, unefa_docente:{}} :{}
                }
            );
            if (datos.Respuesta==='Ok'){
                let asignaturas = datos.datos[`unefa_asignatura`]
                let docentes = datos.datos[`unefa_docente`]
                datos= datos.datos[`unefa_${resultados.tipo.value}`]
                if (resultados.tipo.value==='seccion'){
                    datos = datos.filter(f=>{
                        return f.valores.carrera.nombres===resultados.carrera.nombres
                    }).map(val=>{return {...val.valores, titulo:val.valores.seccion, _id:val._id}})
                    asignaturas = asignaturas.filter(f=>{
                        return f.valores.carrera.nombres===resultados.carrera.nombres
                    }).map(val=>{return {...val.valores, titulo:`${val.valores.nombre}`, _id:val._id}});
                    docentes = docentes.filter(f=>{
                        const o = f.valores.carreras ? f.valores.carreras.filter(f1=>f1.nombres===resultados.carrera.nombres):[];
                        return o.length!==0
                    }).map(val=>{return {...val.valores, titulo:`${val.valores.nombres} ${val.valores.apellidos}`, _id:val._id}});

                    datos= datos.map(val=>{
                        let asig= asignaturas.filter(f=> f.semestre && f.semestre.value===val.semestre.value)
                        let docen = docentes.filter(f=>{
                            const o = f.asignaturas.filter(f1=>f1.semestre.value===val.semestre.value);
                            return o.length!==0
                        })
                        return {...val, asignaturas:asig, docentes:docen}
                    })

                }else if(resultados.tipo.value==='docente'){
                    datos = datos.filter(f=>{
                        const o = f.valores.carreras ? f.valores.carreras.filter(f1=>f1.nombres===resultados.carrera.nombres) : [];
                        return o.length!==0
                    }).map(val=>{
                        const asignaturas = val.valores.asignaturas.map(v=>{return {...v, titulo:v.nombre}})
                        return {...val.valores, titulo:`${val.valores.nombres} ${val.valores.apellidos}`, asignaturas, _id:val._id}
                    })
                }else{
                    datos=datos.map(val=>{return {...val.valores, titulo:val.valores.nombre, _id:val._id}})
                }
            
                let formulario = await genera_fromulario({ valores:{...resultados}, campos: Form_todos('Form_unefa_horario') });
                formulario.titulos[0].value.carrera.onChange = Seleccion;
                formulario.titulos[0].value.periodo.onChange = Seleccion;
                formulario.titulos[0].value.tipo.onChange = Seleccion;
                formulario.titulos[0].value.lista.disabled= false;
                formulario.titulos[0].value.lista.lista= datos;
                formulario.titulos[0].value.lista.value= null;
                formulario.titulos[0].value.lista.onChange= Seleccion_Horario(formulario);
                if (active) {
                    cambio({formulario})   
                }
                
            }

            setCargando(false)
        })();

        return () => {
        active = false;
        };

    },[cargando])




    // if (state.formulario===undefined){
    //     Inicio()
        
    // }
    return state.formulario ? (
        <Box sx={{ flexGrow: 1, position: "relative"}}>
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
            <Cargando open={cargando} Logo={Logo} Fondo={'#ffffff'}/>
        </Box>
    ): null;
}
