import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import Cargando from '../../../componentes/esperar/cargar';
import { conexiones} from '../../../procesos/servicios';

export default function Empaques(props) {
    const [datos,setDatos]=React.useState([]);
    React.useEffect(()=>{
        const Inicio= async()=>{
            let resp = await conexiones.Leer_C(['empaque'],{empaque:{}});
            if (resp.Respuesta==='Ok'){
                let dat = resp.datos.empaque;
                const mayor = dat.filter(f=> (Number(f.valores.actual)>Number(f.valores.minimo) && f.valores.minimo!=='') || f.valores.actual===undefined);
                const menor = dat.filter(f=> Number(f.valores.actual)<=Number(f.valores.minimo) || f.valores.minimo==='');
                dat=[...menor,...mayor]
                setDatos(dat);
            }
        }
        Inicio()
    },[props])
    const alto=props.Alto ? props.Alto : window.innerHeight * 0.50;
    const error='#AA9309';
    const correcto='#138E04';
    return (
        <Box>
            <Box
                id="category-b"
                sx={{ fontSize: '20px', textTransform: 'uppercase', textAlign:'center', backgroundColor:'#000C89', borderTopLeftRadius:8, borderTopRightRadius:8 }}
            >
                Empaques
            </Box>
            <Box
                sx={(theme) => ({
                    display: 'flex',
                    flexDirection: 'column',
                    padding:0.5,
                    gap: 3,
                    height: alto,
                    textTransform: 'uppercase',
                    backgroundColor:'#000000',
                    '& > div': {
                        overflow: 'hidden auto',
                        '&::-webkit-scrollbar': { height: 10, width:10, WebkitAppearance: 'none' },
                        '&::-webkit-scrollbar-thumb': {
                            borderRadius: 8,
                            border: '2px solid',
                            borderColor: theme.palette.mode === 'dark' ? '' : '#E7EBF0',
                            backgroundColor: 'rgba(0 0 0 / 0.5)',
                        },
                    },
                })}
            >
                <div style={{height:'100%', paddingTop:10}}>
                    {datos
                        ?   datos.map(val=>
                                <Box key={val._id}
                                        sx={{
                                            backgroundColor:Number(val.valores.actual)> Number(val.valores.minimo) && val.valores.minimo!=='' ? correcto : error, 
                                            marginBottom:2, borderRadius:2, width:'100%', padding:1,
                                        }}
                                >
                                    <Grid container wrap="nowrap" spacing={0.5} alignItems="center">
                                        <Grid item xs={8} zeroMinWidth>
                                            <Typography noWrap textAlign={'left'}>{val.valores.descripcion}</Typography>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Grid container spacing={0.5}>
                                                <Grid item xs={12} textAlign={'right'}>
                                                    <Typography title={'Cantidad actual'}>
                                                        {(val.valores.actual && val.valores.actual!=='')  ? val.valores.actual : 'NA'} {val.valores.unidad && val.valores.unidad.value ? val.valores.unidad.value : ''}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={12} textAlign={'right'}>
                                                    <Typography title={'Cantidad minima'}>{val.valores.minimo} {val.valores.unidad && val.valores.unidad.value ? val.valores.unidad.value : ''}</Typography>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    
                                </Box>
                            )
                        :   <Cargando open={true}/>
                    }
                </div>
            </Box>
        </Box>
    );
}

