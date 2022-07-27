import InicioUnefa from "./inicio";
import General from "./general";
import Horarios from "./horarios";
import MisDatos from './misdatos';
import Docentes from "./docentes";
import Usuarios from "./usuarios";
import Horario from "./horario";
export const unefa_pantallas={
    Inicio:InicioUnefa,
    'Mis Datos': (props) => <MisDatos {...props} />,
    Horario,
    Periodos: (props) => <General {...props} Table={'unefa_periodo'} Titulo={'Periodos'} Form={'Form_unefa_periodo'} Titulos={'Titulos_unefa_periodo'} cargaporparte={{condicion:{},sort:{"valores.periodo":-1}}}/>,
    Carreras: (props) => <General {...props} Table={'unefa_carrera'} Titulo={'Periodos'} Form={'Form_unefa_carreras'} Titulos={'Titulos_unefa_carreras'}/>,
    Asignaturas: (props) => <General {...props} Table={'unefa_asignatura'} Titulo={'Asignaturas'} Form={'Form_unefa_asignatura'} Titulos={'Titulos_unefa_asignatura'} cargaporparte={{condicion:{},sort:[["valores.semestre.value",1],["valores.nombre",1]]}}/>,
    Aulas: (props) => <General {...props} Table={'unefa_aula'} Titulo={'Aulas'} Form={'Form_unefa_aula'} Titulos={'Titulos_unefa_aula'} cargaporparte={{condicion:{},sort: {'valores.nombre':1}}}/>,
    Secciones: (props) => <General {...props} Table={'unefa_seccion'} Titulo={'Secciones'} Form={'Form_unefa_seccion'} Titulos={'Titulos_unefa_seccion'} cargaporparte={{condicion:{},sort:[["valores.carrera.nombres",1],["valores.semestre.value",1]]}}/>,
    Docentes,
    Horarios,
    Usuarios,
}
