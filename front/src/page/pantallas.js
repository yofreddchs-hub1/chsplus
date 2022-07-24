import Horarios from '../componentes/horario';
import Home from './home';
import { colegio_pantallas } from '../componentes/colegio/pantallas';
import { configuracion_pantallas } from '../componentes/configuracion/pantallas';

export const pantallas={
    Home,
    Inicio:Home,
    Configuracion:{...configuracion_pantallas},
    
    Horario:Horarios,
    Colegio: {...colegio_pantallas}
}