import InicioUnefa from "./inicio";
import General from "./general";

export const unefa_pantallas={
    Inicio:InicioUnefa,
    Materias: (props) => <General {...props} Table={'unefapostgrado_materia'} Titulo={'Materias'} Form={'Form_materia'} 
                                    Titulos={'Titulos_unefa_asignatura'} cargaporparte={{condicion:{},sort:[["valores.semestre.value",1],["valores.nombre",1]]}}
                                    Titulo_dialogo = {(dato)=> dato._id ? `Materia ${dato.valores.nombre}` : 'Nueva Materia'}
                            />,
    Estudiantes: (props) => <General {...props} Table={'unefapostgrado_estudiante'} Titulo={'Estudiantes'} Form={'Form_unefaprosgrado_estudiante'} 
                                    Titulos={'Titulos_unefa_estudiante'} cargaporparte={{condicion:{},sort: {'valores.cedula':1}}}
                                    Titulo_dialogo = {(dato)=> dato._id ? `Estudiante ${dato.valores.nombres} ${dato.valores.apellidos}` : 'Nueva Estudiante'}
                            />,
    Notas: (props) => <General {...props} Table={'unefapostgrado_estudiante'} Titulo={'Notas'} Form={'Form_unefaprostgrado_notas'} 
                            Titulos={'Titulos_unefapostgrado_notas'} cargaporparte={{condicion:{},sort: {'valores.cedula':1}}}
                            Titulo_dialogo = {(dato)=> dato._id ? `Nota ${dato.valores.nombres} ${dato.valores.apellidos}` : 'Nueva Nota'}
                            />,
}
