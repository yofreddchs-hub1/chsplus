import * as React from 'react';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import MobileStepper from '@mui/material/MobileStepper';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import Verificar from './verificar_usuario';
import Mensualidad from './mensualidades';
import Formapago from './formaPago';
import Confirmar from './confirmar';
import Enviado from './enviado';

const steps = [
  {
    label: 'Verificar Datos',
    description: (props) => <Verificar {...props}/>,
  },
  {
    label: 'Mensualidades',
    description: (props) => <Mensualidad {...props}/>,
  },
  {
    label: 'Forma de Pago',
    description: (props) => <Formapago {...props}/>,
  },
  {
    label: 'Confirmar',
    description: (props) => <Confirmar {...props}/>,
  },
  {
    label: 'Datos Enviados',
    description: (props) => <Enviado {...props}/>,
  },
];

export default function Pasos(props) {
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = steps.length;

  const handleNext = async() => {
    if (activeStep === maxSteps - 1){
      if (props.Refrescar){
        props.Refrescar()
      }else{
        props.Cambio({pantalla:'Representante'});
      }
      
    }else if (activeStep === maxSteps - 2){
      const respuesta= await props.Enviar()
      
      if (respuesta==='Ok'){
        setActiveStep((prevActiveStep) => prevActiveStep + 1);  
      }
    }else{
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
    
  };

  const handleBack = () => {
    if (activeStep === 0) props.Cambio({pantalla:'Representante'})
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const siguiente = (activeStep === 0 && props.datos && props.datos.valores.representados.length===0)
                    || (activeStep === 1 && props.Mensualidades && props.Mensualidades.meses.length===0)
  
  const anterior = (activeStep === 0 && !props.monstrar_representante) || props.Recibo ? true : false;
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Paper
        square
        elevation={0}
        sx={{
          display: 'flex',
          alignItems: 'center',
          height: 50,
          pl: 2,
          bgcolor: 'background.default',
        }}
      >
        <Typography>{steps[activeStep].label}</Typography>
      </Paper>
      <Box sx={{ height: '74vh', p: 2, overflowY:'auto', overflowX:'hidden' }}>
        {steps[activeStep].description(props)}
      </Box>
      <MobileStepper
        variant="text"
        steps={maxSteps}
        position="static"
        activeStep={activeStep}
        nextButton={
          <Button
            size="small"
            onClick={handleNext}
            disabled={siguiente}
            style={{color:siguiente ? '#B0AFAF' : '#fff'}}
          >
            { activeStep === maxSteps - 2
              ? 'Enviar'
              : activeStep === maxSteps - 1
              ? 'Continuar'
              : 'Siguiente'
            }
            {theme.direction === 'rtl' ? (
              <KeyboardArrowLeft />
            ) : (
              <KeyboardArrowRight />
            )}
          </Button>
        }
        backButton={
           
                <Button size="small" onClick={handleBack} style={{color:anterior ? '#B0AFAF' : '#fff'}} disabled={anterior}>
                    {theme.direction === 'rtl' ? (
                      <KeyboardArrowRight />
                    ) : (
                      <KeyboardArrowLeft />
                    )}
                    Anterior
                </Button>
        }
      />
    </Box>
  );
}
