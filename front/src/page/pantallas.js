import Horarios from '../componentes/horario';
import Home from './home';
import Aplicaciones from '../componentes/aplicaciones';
import { configuracion_pantallas } from '../componentes/configuracion/pantallas';
import { sistema_pantallas } from './sistema/pantallas';
export const pantallas={
    Home,
    Inicio:Home,
    Aplicaciones,
    Configuracion:{...configuracion_pantallas},
    
    Horario:Horarios,
    Sistema:{...sistema_pantallas}
}