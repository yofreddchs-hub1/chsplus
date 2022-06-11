import * as React from 'react';
import { styled } from '@mui/system';
import Tabs, { tabsClasses } from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import Grid from '@mui/material/Grid';
import Box from "@mui/material/Box";
import Container from '@mui/material/Container';


const blue = {
  50: '#7ABC32',
  100: '#C2E0FF',
  200: '#80BFFF',
  300: '#66B2FF',
  400: '#3399FF',
  500: 'rgb(5, 30, 52)', //Color de fondo de la barra completa
  600: '#ffffff',
  700: '#0059B2',
  800: '#004C99',
  900: '#003A75',
};

const StyledTab = styled((props) => <Tab disableRipple {...props} />)(
  ({ theme }) => ({
    textTransform: 'none',
    // fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.pxToRem(15),
    marginRight: theme.spacing(1),
    
    fontFamily: 'IBM Plex Sans, sans-serif',
    // color: 'white',
    cursor: 'pointer',
    // fontSize: '0.875rem',
    fontWeight: 'bold',
    backgroundColor: 'transparent',
    
    padding: '12px 16px',
    margin: '6px 6px',
    border: 'none',
    borderRadius: '5px',
    display: 'flex',
    justifyContent: 'center',

    color: 'rgba(255, 255, 255, 0.7)',
    '&:hover': {
      backgroundColor: blue[400]
    },
    '&.Mui-selected': {
      color: '#fff',
      backgroundColor:blue[50],
      
    },
    '&.Mui-focusVisible': {
      backgroundColor: 'rgba(100, 95, 228, 0.32)',
    },
  }),
);

export default function UnstyledTabsCustomized(props) {
  const {Bloques }=props;
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  
  return (
    <Container fixed disableGutters>
      <Grid container spacing={0}  >
        <Grid item xs={12}>
          <Box sx={{width: '100%',}}>
              <Tabs
                value={value}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  [`& .${tabsClasses.scrollButtons}`]: {
                    '&.Mui-disabled': { opacity: 0.3 },
                  },
                  backgroundColor: blue[500],
                  borderRadius: '8px',
                  width:'100%'
                }}
              >
                {Bloques 
                    ?
                        Object.keys(Bloques).map((valor,i)=>
                            <StyledTab key={valor+ i} label={valor}>
                                {valor}
                            </StyledTab>
                        )
                    :
                        <StyledTab>
                          <Skeleton animation="wave" height={20} width="80%" />
                        </StyledTab>
                }
                
              </Tabs>
          </Box>
        </Grid>

        <Grid item xs={12}>
          {Bloques
            ?
                Object.keys(Bloques).map((valor,i)=>
                  value===i  && (
                    
                        <Paper key={i+'-'+valor} elevation={3} sx={{  marginTop: 0, height:'82vh', bgcolor:'#000000', color:'#ffffff', overflowX:'auto'}}>
                            {Bloques[valor]}
                        </Paper>
                    
                  
                  )
                )
            :
                
                    <Paper elevation={3} sx={{  height:'82vh', bgcolor:'#000000', color:'#ffffff', padding:2}}>
                      <Skeleton sx={{ height: '80vh' }} animation="wave" variant="rectangular" />
                    </Paper>
                
          }
        </Grid> 
      </Grid>
    </Container> 
  );
}
