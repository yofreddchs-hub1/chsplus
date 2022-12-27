import * as React from 'react';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import MobileStepper from '@mui/material/MobileStepper';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css';
import Orden from './venta';
import FormaPago from './formapagos';
import ConfirmarPago from './confirmar';
import { conexiones } from '../../../procesos/servicios';

const steps = [
  {
    label: 'Orden de Venta',
    description: (props)=> <Orden {...props}/>
  },
  {
    label: 'Forma de Pago',
    description:(props)=> <FormaPago {...props}/>
  },
  {
    label: 'Confirmar',
    description: (props)=> <ConfirmarPago {...props}/>,
  },
];

export default class Venta extends React.Component {
    constructor(props) {
        super(props);
  
        this.state = {
            cargando:true,
            props: this.props,
            Config:this.props.Config,
            activeStep:0,
            maxSteps : steps.length,
            orden_venta : null,
            formapago: null
            // theme : useTheme()
        }
    }
    Inicio = () =>{
      this.setState({
          activeStep:0,
          orden_venta : null,
          formapago: null
      })
    }
    async componentDidMount(){
        
    }
    
    static getDerivedStateFromProps(props, state) {
  
        if (props !== state.props) {
            
          return {
            props,
            Config:props.Config,
          };
        }
        // No state update necessary
        return null;
    }
    Siguiente = (datos)=>{
        if(datos.tipo && datos.tipo==='Orden'){
            this.setState({orden_venta:datos.valores});
        }else if(datos.tipo && datos.tipo==='FormaPago'){
            this.setState({formapago:datos.valores});
        }
        let {activeStep}=this.state;
        this.setState({activeStep: activeStep + 1});
    }
    Atras = ()=>{
        let {activeStep}=this.state;
        this.setState({activeStep: activeStep - 1});
    }
    Procesar = async()=>{
      const {orden_venta, formapago} = this.state;
      console.log('Procesar', formapago, orden_venta);
      confirmAlert({
        title: 'Confirmar operación',
        message: 'Desea realizar proceso de venta?',
        buttons: [
          {
            label: 'SI',
            onClick: async () => {
              const resp = await conexiones.Egreso_venta({formapago, orden_venta});
              console.log(resp);
              this.Inicio();
            }
          },
          {
            label: 'NO',
            onClick: async () => {
              
            }
          }
        ]
      });
    }
    render(){
        const {activeStep, maxSteps, props, orden_venta, formapago}= this.state;
        return (
            <Box sx={{ width: '100%', height: '97%', flexGrow: 1 }}>
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
              <Box sx={{ height: '85%', width: '100%', p: 2 }}>
                {steps[activeStep].description({...props, Siguiente:this.Siguiente, orden_venta, formapago, Atras:this.Atras, Procesar:this.Procesar})}
              </Box>
              <MobileStepper
                variant="text"
                steps={maxSteps}
                position="static"
                activeStep={activeStep}
                nextButton={
                  <Button
                    size="small"
                    onClick={activeStep === maxSteps - 1 ? this.Procesar : this.Siguiente}
                    disabled={(activeStep===0 && orden_venta===null) || (activeStep===1 && formapago===null)}
                  >
                    { activeStep === maxSteps - 1 ? 'Procesar' : 'Siguiente'}
                    
                    <KeyboardArrowRight />
                    
                  </Button>
                }
                backButton={
                  <Button size="small" onClick={this.Atras} disabled={activeStep === 0}>
                    
                      <KeyboardArrowLeft />
                    
                    Atras
                  </Button>
                }
              />
            </Box>
        );
    }
}
function TextMobileStepper() {
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = steps.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <Box sx={{ maxWidth: 400, flexGrow: 1 }}>
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
      <Box sx={{ height: 255, maxWidth: 400, width: '100%', p: 2 }}>
        {steps[activeStep].description}
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
            disabled={activeStep === maxSteps - 1}
          >
            Next
            {theme.direction === 'rtl' ? (
              <KeyboardArrowLeft />
            ) : (
              <KeyboardArrowRight />
            )}
          </Button>
        }
        backButton={
          <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
            {theme.direction === 'rtl' ? (
              <KeyboardArrowRight />
            ) : (
              <KeyboardArrowLeft />
            )}
            Back
          </Button>
        }
      />
    </Box>
  );
}
