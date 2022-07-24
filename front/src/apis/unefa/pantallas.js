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
    Periodos: (props) => <General {...props} Table={'unefa_periodo'} Titulo={'Periodos'} Form={'Form_unefa_periodo'} Titulos={'Titulos_unefa_periodo'}/>,
    Carreras: (props) => <General {...props} Table={'unefa_carrera'} Titulo={'Periodos'} Form={'Form_unefa_carreras'} Titulos={'Titulos_unefa_carreras'}/>,
    Asignaturas: (props) => <General {...props} Table={'unefa_asignatura'} Titulo={'Asignaturas'} Form={'Form_unefa_asignatura'} Titulos={'Titulos_unefa_asignatura'}/>,
    Aulas: (props) => <General {...props} Table={'unefa_aula'} Titulo={'Aulas'} Form={'Form_unefa_aula'} Titulos={'Titulos_unefa_aula'}/>,
    Secciones: (props) => <General {...props} Table={'unefa_seccion'} Titulo={'Secciones'} Form={'Form_unefa_seccion'} Titulos={'Titulos_unefa_seccion'}/>,
    Docentes,
    Horarios,
    Usuarios,
}
