import Inicio from './inicio';
import Registros from './registros';
import Pagar from './pagar';
import Administrativo from './administrativo';
import { colegio_administrativo_pantallas } from './administrativo/pantallas';
import Inscripcion from './inscripcion';

export const colegio_pantallas={
    Colegio: Inicio,
    Pagar,
    Registros,
    Administrativo:{...colegio_administrativo_pantallas},
    Inscripcion
}