import Inicio from './inicio';
import Inscripcion from './inscripcion';
import Pagar from './pagar';
import Registros from './registros';
import { colegio_administrativo_pantallas } from './administrativo/pantallas';
export const colegio_pantallas={
    Inicio,
    Inscripcion,
    Pagar,
    Administrativo:{...colegio_administrativo_pantallas},
    Registros
}