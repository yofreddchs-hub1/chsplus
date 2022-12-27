{
    "Titulo": "POSTGRADO ",
    "Logo": "/api/imagen/logo.png",
    "Estilos": {
        "Logo": {
            "height": 60,
            "width": 60
        },
        "Input_label": {
            "color": "#000000",
            "textAlign": "left"
        },
        "Input_helper": {
            "color": "#F92C2C",
            "textAlign": "left"
        },
        "Input_fondo": {
            "backgroundColor": "rgba(6, 42, 137,1)"
        },
        "Input_input": {
            "color": "#ffffff"
        },
        "Input_input_disabled": {
            "color": "#CEBAB6"
        },
        "Input_icono": {
            "color": "#ffffff"
        },
        "Icon_lista": {
            "color": "rgba(6, 42, 137,1)"
        },
        "Barra_menu": {
            "backgroundColor": "rgba(200, 0, 0)",
            "color": "#ffffff",
            "backgroundImage": "linear-gradient(0deg, #524D4D 0, #ff0000 90% )"
        },
        "Lista_menu_fondo": {
            "bgcolor": "#FFF",
            "padding": 0.2,
            "height": "100%"
        },
        "Lista_menu_cuerpo": {
            "primary": {
                "main": "rgb(2, 157, 246)"
            },
            "background": {
                "paper": "rgb(5, 30, 52)"
            }
        },
        "Dialogo_cuerpo": {
            "backgroundColor": "rgb(255, 255, 255)"
        },
        "Tabla_titulo": {
            "color": "#ffffff"
        },
        "Tabla_cabezera": {
            "backgroundImage": "linear-gradient(0deg, #524D4D 0, #ff0000 90% )"
        },
        "Tabla_buscar_fondo": {
            "backgroundColor": "rgba(0, 0, 0,1)"
        },
        "Tabla_buscar_input": {
            "color": "#ffffff"
        },
        "Tabla_buscar_icono": {
            "color": "#ffffff"
        },
        "Tabla_titulos": {
            "backgroundColor": "rgba(0, 0, 0, 1)",
            "color": "#ffffff"
        },
        "Botones": {
            "Aceptar": {
                "backgroundImage": "linear-gradient(0deg, #19A203 0, #0E5003 50% )"
            },
            "Cancelar": {
                "backgroundImage": "linear-gradient(0deg, #524D4D 0, #080303 50% )"
            },
            "Eliminar": {
                "backgroundImage": "linear-gradient(0deg, #DB1007 0, #880904 50% )"
            }
        },
        "barra_menu": {
            "backgroundColor": "rgba(0, 19, 36)"
        }
    },
    "TipoMenu": "0",
    "Menu": [
        {
            "value": "Inicio",
            "primary": "Inicio",
            "icon": "home",
            "libre": "true"
        },
        {
            "value": "Materias",
            "primary": "Materias",
            "icon": "clear_all"
        },
        {
            "value": "Estudiantes",
            "primary": "Estudiantes",
            "icon": "groups"
        },
        {
            "value": "Notas",
            "primary": "Notas",
            "icon": "edit_note"
        }
    ],
    "Menu_iconos": [],
    "Formularios": {
        "Form_materia": {
            "columna": 2,
            "value": [
                {
                    "nombre": "codmateria",
                    "label": "Código de Materia",
                    "placeholder": "Código de Materia",
                    "title": "Código de Materia",
                    "required": true,
                    "mensaje_error": "Debe indicar Código de Materia",
                    "disabled": false,
                    "numberOfLines": "",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "key": "codmateria",
                    "name": "codmateria"
                },
                {
                    "nombre": "nombre",
                    "label": "Nombre",
                    "placeholder": "Nombre",
                    "title": "Nombre de Materia",
                    "required": true,
                    "mensaje_error": "Debe indicar Nombre de Materia",
                    "disabled": false,
                    "numberOfLines": "",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "key": "nombre",
                    "name": "nombre"
                },
                {
                    "nombre": "unidadcredito",
                    "tipo": "number",
                    "label": "Unidades de Crédito",
                    "placeholder": "Unidades de Crédito",
                    "title": "Unidades de Crédito",
                    "required": false,
                    "mensaje_error": "",
                    "disabled": false,
                    "numberOfLines": "",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "key": "unidadcredito",
                    "name": "unidadcredito",
                    "multiline": false
                },
                {
                    "nombre": "prelaciones",
                    "label": "Prelaciones",
                    "placeholder": "Prelaciones",
                    "title": "Prelaciones",
                    "mensaje_error": "",
                    "disabled": false,
                    "numberOfLines": "",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "key": "prelaciones",
                    "name": "prelaciones"
                },
                {
                    "nombre": "electivas",
                    "label": "Electivas",
                    "placeholder": "Electivas",
                    "title": "Electivas",
                    "mensaje_error": "",
                    "disabled": false,
                    "numberOfLines": "",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "key": "electivas",
                    "name": "electivas"
                },
                {
                    "nombre": "periodo",
                    "label": "Periodo",
                    "placeholder": "Periodo",
                    "title": "Periodo",
                    "mensaje_error": "",
                    "disabled": false,
                    "numberOfLines": "",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "key": "periodo",
                    "name": "periodo"
                },
                {
                    "nombre": "codprograma",
                    "label": "Código Programa",
                    "placeholder": "Código Programa",
                    "title": "Código Programa",
                    "required": false,
                    "mensaje_error": "",
                    "disabled": false,
                    "numberOfLines": "",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "key": "codprograma",
                    "name": "codprograma"
                },
                {
                    "nombre": "termino",
                    "label": "Termino",
                    "placeholder": "Termino",
                    "title": "Termino",
                    "required": false,
                    "mensaje_error": "",
                    "disabled": false,
                    "numberOfLines": "",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "key": "termino",
                    "name": "termino"
                }
            ]
        },
        "Form_unefaprosgrado_estudiante": {
            "columna": 2,
            "value": [
                {
                    "nombre": "cedula",
                    "label": "Cedula",
                    "placeholder": "Cedula",
                    "title": "Cedula",
                    "required": true,
                    "mensaje_error": "Debe indicar Cedula",
                    "disabled": false,
                    "numberOfLines": "",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "key": "cedula",
                    "name": "cedula"
                },
                {
                    "nombre": "nombres",
                    "label": "Nombres",
                    "placeholder": "Nombres",
                    "title": "Nombres",
                    "required": true,
                    "mensaje_error": "Debe indicar Nombres",
                    "disabled": false,
                    "numberOfLines": "",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "key": "nombres",
                    "name": "nombres"
                },
                {
                    "nombre": "apellidos",
                    "label": "Apellidos",
                    "placeholder": "Apellidos",
                    "title": "Apellidos",
                    "required": true,
                    "mensaje_error": "Debe indicar Apellidos",
                    "disabled": false,
                    "numberOfLines": "",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "key": "apellidos",
                    "name": "apellidos"
                },
                {
                    "nombre": "fecha_ingreso",
                    "tipo": "Fecha",
                    "label": "Fecha de Ingreso",
                    "placeholder": "Fecha de Ingreso",
                    "title": "Fecha de Ingreso",
                    "mensaje_error": "",
                    "disabled": false,
                    "numberOfLines": "",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "key": "fecha_ingreso",
                    "name": "fecha_ingreso",
                    "multiline": false
                },
                {
                    "nombre": "cohorte",
                    "label": "Cohorte",
                    "placeholder": "Cohorte",
                    "title": "Cohorte",
                    "mensaje_error": "",
                    "disabled": false,
                    "numberOfLines": "",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "key": "cohorte",
                    "name": "cohorte"
                },
                {
                    "nombre": "correo",
                    "label": "Correo",
                    "placeholder": "Correo",
                    "title": "Correo",
                    "mensaje_error": "",
                    "disabled": false,
                    "numberOfLines": "",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "key": "correo",
                    "name": "correo"
                },
                {
                    "nombre": "direccion",
                    "tipo": "multiline",
                    "label": "Dirección",
                    "placeholder": "Dirección",
                    "title": "Dirección",
                    "mensaje_error": "",
                    "disabled": false,
                    "numberOfLines": "3",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "key": "direccion",
                    "name": "direccion",
                    "multiline": true
                },
                {
                    "nombre": "status",
                    "tipo": "lista_multiuso",
                    "label": "Estatus",
                    "placeholder": "Estatus",
                    "title": "Estatus",
                    "mensaje_error": "",
                    "disabled": false,
                    "numberOfLines": "",
                    "lista": "lista_unefaprosgrado_status",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "agregar": false,
                    "key": "status",
                    "name": "status",
                    "multiline": false
                },
                {
                    "nombre": "codigoprograma",
                    "label": "Código Programa",
                    "placeholder": "Código Programa",
                    "title": "Código Programa",
                    "mensaje_error": "",
                    "disabled": false,
                    "numberOfLines": "",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "key": "codigoprograma",
                    "name": "codigoprograma"
                },
                {
                    "nombre": "seccion",
                    "label": "Sección",
                    "placeholder": "Sección",
                    "title": "Sección",
                    "mensaje_error": "",
                    "disabled": false,
                    "numberOfLines": "",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "key": "seccion",
                    "name": "seccion"
                },
                {
                    "nombre": "termino",
                    "label": "Termino",
                    "placeholder": "Termino",
                    "title": "Termino",
                    "mensaje_error": "",
                    "disabled": false,
                    "numberOfLines": "",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "key": "termino",
                    "name": "termino"
                },
                {
                    "nombre": "sexo",
                    "tipo": "lista_multiuso",
                    "label": "Sexo",
                    "placeholder": "Sexo",
                    "title": "Sexo",
                    "mensaje_error": "",
                    "disabled": false,
                    "numberOfLines": "",
                    "lista": "lista_unefaprosgrado_sexo",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "agregar": false,
                    "key": "sexo",
                    "name": "sexo",
                    "multiline": false
                },
                {
                    "nombre": "periodo",
                    "label": "Periodo Activo",
                    "placeholder": "Periodo Activo",
                    "title": "Periodo Activo",
                    "mensaje_error": "",
                    "disabled": false,
                    "numberOfLines": "",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "key": "periodo",
                    "name": "periodo"
                }
            ]
        },
        "Form_notas": {
            "columna": 1,
            "value": []
        }
    },
    "Listas": {
        "lista_unefapostgrado_categoria": [
            {
                "_id": 0,
                "titulo": "AdministradorCHS",
                "value": "administradorchs",
                "permisos": "*,**,*CHS",
                "id": 1,
                "otro": ""
            },
            {
                "_id": 1,
                "titulo": "Jefe",
                "value": "jefe",
                "permisos": "*",
                "id": 2,
                "otro": ""
            },
            {
                "_id": 2,
                "titulo": "Coordinador",
                "value": "coordinador",
                "permisos": "Periodos,Carreras,Asignaturas,Aulas,Secciones,Docentes,Horarios,Mis Datos,Horario",
                "id": 3,
                "otro": ""
            },
            {
                "_id": 3,
                "titulo": "Docente",
                "value": "docente",
                "permisos": "Mis Datos,Horario",
                "id": 4,
                "otro": ""
            }
        ],
        "lista_unefaprosgrado_status": [
            {
                "_id": 0,
                "titulo": "Activo",
                "value": "1",
                "permisos": ""
            },
            {
                "_id": 1,
                "titulo": "Inactivo",
                "value": "0",
                "permisos": ""
            }
        ],
        "lista_unefaprosgrado_sexo": [
            {
                "_id": 0,
                "titulo": "Masculino",
                "value": "masculino",
                "permisos": ""
            },
            {
                "_id": 1,
                "titulo": "Femenino",
                "value": "femenino",
                "permisos": ""
            }
        ]
    },
    "Titulos": {
        "Titulos_unefa_asignatura": [
            {
                "title": "Nombre",
                "field": "nombre",
                "tipo": "",
                "formato": "(dato)=> `${dato.valores.nombre}`",
                "default": "",
                "type": ""
            },
            {
                "title": "Termino",
                "field": "termino",
                "tipo": "",
                "formato": "(dato)=> `${dato.valores.termino}`",
                "default": "",
                "type": ""
            },
            {
                "title": "Unidades de Crédito",
                "field": "unidadcredito",
                "tipo": "",
                "formato": "(dato)=> `${dato.valores.unidadcredito}`",
                "default": "",
                "type": ""
            }
        ],
        "Titulos_unefa_estudiante": [
            {
                "title": "Cedula",
                "field": "cedula",
                "tipo": "",
                "formato": "(dato)=> `${dato.valores.cedula}`",
                "default": "",
                "type": ""
            },
            {
                "title": "Nombres",
                "field": "nombres",
                "tipo": "",
                "formato": "(dato)=> `${dato.valores.nombres}`",
                "default": "",
                "type": ""
            },
            {
                "title": "Apellidos",
                "field": "apellidos",
                "tipo": "",
                "formato": "(dato)=> `${dato.valores.apellidos}`",
                "default": "",
                "type": ""
            }
        ],
        "Titulos_unefapostgrado_notas": [
            {
                "title": "Cedula",
                "field": "cedula",
                "tipo": "",
                "formato": "(dato)=> `${dato.valores.cedula}`",
                "default": "",
                "type": ""
            },
            {
                "title": "Termino",
                "field": "termino",
                "tipo": "",
                "formato": "(dato)=> `${dato.valores.termino}`",
                "default": "",
                "type": ""
            },
            {
                "title": "Periodo",
                "field": "periaca",
                "tipo": "",
                "formato": "(dato)=> `${dato.valores.periaca}`",
                "default": "",
                "type": ""
            },
            {
                "title": "Nota Repitencia",
                "field": "notrep",
                "tipo": "",
                "formato": "(dato)=> `${dato.valores.notrep}`",
                "default": "",
                "type": ""
            },
            {
                "title": "Nota Defenitiva",
                "field": "notdef",
                "tipo": "",
                "formato": "(dato)=> `${dato.valores.notdef}`",
                "default": "",
                "type": ""
            }
        ]
    },
    "Funciones": {},
    "Subtotales": {}
}