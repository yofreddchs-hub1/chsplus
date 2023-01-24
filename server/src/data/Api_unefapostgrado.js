{
    "Titulo": "POSTGRADO ",
    "Logo": "/api/imagen/logo.png",
    "Estilos": {
        "Logo": {
            "height": 40,
            "width": 40
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
        },
        {
            "value": "Registros",
            "primary": "Registos",
            "icon": "dataset"
        }
    ],
    "Menu_iconos": [],
    "Formularios": {
        "Form_materia": {
            "columna": 2,
            "value": [
                {
                    "nombre": "codmat",
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
                    "key": "codmat",
                    "name": "codmat"
                },
                {
                    "nombre": "codesp",
                    "label": "Código de Especialidad",
                    "placeholder": "Código de Especialidad",
                    "title": "Código de Especialidad",
                    "required": false,
                    "mensaje_error": "Debe indicar Código de Materia",
                    "disabled": false,
                    "numberOfLines": "",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "key": "codesp",
                    "name": "codesp"
                },
                {
                    "nombre": "codopcion",
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
                    "key": "codopcion",
                    "name": "codopcion"
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
                },
                {
                    "nombre": "credito",
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
                    "key": "credito",
                    "name": "credito",
                    "multiline": false
                },
                {
                    "nombre": "nommat",
                    "label": "Nombre Materia",
                    "placeholder": "Nombre Materia",
                    "title": "Nombre de Materia",
                    "required": true,
                    "mensaje_error": "Debe indicar Nombre de Materia",
                    "disabled": false,
                    "numberOfLines": "",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "key": "nommat",
                    "name": "nommat"
                },
                {
                    "nombre": "horteo",
                    "tipo": "number",
                    "label": "Hora Teorica",
                    "placeholder": "Hora Teorica",
                    "title": "Hora Teorica",
                    "required": false,
                    "mensaje_error": "",
                    "disabled": false,
                    "numberOfLines": "",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "key": "horteo",
                    "name": "horteo",
                    "multiline": false
                },
                {
                    "nombre": "horpra",
                    "tipo": "number",
                    "label": "Hora Practica",
                    "placeholder": "Hora Practica",
                    "title": "Hora Practica",
                    "required": false,
                    "mensaje_error": "",
                    "disabled": false,
                    "numberOfLines": "",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "key": "horpra",
                    "name": "horpra",
                    "multiline": false
                },
                {
                    "nombre": "horlab",
                    "tipo": "number",
                    "label": "Hora Laboratorio",
                    "placeholder": "Hora Laboratorio",
                    "title": "Hora Laboratorio",
                    "required": false,
                    "mensaje_error": "",
                    "disabled": false,
                    "numberOfLines": "",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "key": "horlab",
                    "name": "horlab",
                    "multiline": false
                },
                {
                    "nombre": "prela1",
                    "tipo": "number",
                    "label": "Prelación 1",
                    "placeholder": "Prelación 1",
                    "title": "Prelación 1",
                    "required": false,
                    "mensaje_error": "",
                    "disabled": false,
                    "numberOfLines": "",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "key": "prela1",
                    "name": "prela1",
                    "multiline": false
                },
                {
                    "nombre": "prela2",
                    "tipo": "number",
                    "label": "Prelación 2",
                    "placeholder": "Prelación 2",
                    "title": "Prelación 2",
                    "required": false,
                    "mensaje_error": "",
                    "disabled": false,
                    "numberOfLines": "",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "key": "prela2",
                    "name": "prela2",
                    "multiline": false
                },
                {
                    "nombre": "prela3",
                    "tipo": "number",
                    "label": "Prelación 3",
                    "placeholder": "Prelación 3",
                    "title": "Prelación 3",
                    "required": false,
                    "mensaje_error": "",
                    "disabled": false,
                    "numberOfLines": "",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "key": "prela3",
                    "name": "prela3",
                    "multiline": false
                },
                {
                    "nombre": "electiva",
                    "label": "Electiva",
                    "placeholder": "Electiva",
                    "title": "Electiva",
                    "mensaje_error": "",
                    "disabled": false,
                    "numberOfLines": "",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "key": "electiva",
                    "name": "electiva"
                },
                {
                    "nombre": "peraca",
                    "label": "Periodo Academico",
                    "placeholder": "Periodo Academico",
                    "title": "Periodo Academico",
                    "mensaje_error": "",
                    "disabled": false,
                    "numberOfLines": "",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "key": "peraca",
                    "name": "peraca"
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
                    "nombre": "codesp",
                    "label": "Codigó Especialidad",
                    "placeholder": "Codigó Especialidad",
                    "title": "Codigó Especialidad",
                    "required": true,
                    "mensaje_error": "Debe indicar Codigó Especialidad",
                    "disabled": false,
                    "numberOfLines": "",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "key": "codesp",
                    "name": "codesp"
                },
                {
                    "nombre": "codopcion",
                    "label": "Codigó Programa",
                    "placeholder": "Codigó Programa",
                    "title": "Codigó Programa",
                    "required": true,
                    "mensaje_error": "Debe indicar Codigó de programa",
                    "disabled": false,
                    "numberOfLines": "",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "key": "codopcion",
                    "name": "codopcion"
                },
                {
                    "nombre": "teract",
                    "label": "Termino Actual",
                    "placeholder": "Termino Actual",
                    "title": "Termino Actual",
                    "required": false,
                    "mensaje_error": "Debe indicar Termino actual",
                    "disabled": false,
                    "numberOfLines": "",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "key": "teract",
                    "name": "teract"
                },
                {
                    "nombre": "apelli",
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
                    "key": "apelli",
                    "name": "apelli"
                },
                {
                    "nombre": "nombre",
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
                    "key": "nombre",
                    "name": "nombre"
                },
                {
                    "nombre": "telefo",
                    "label": "Telefono",
                    "placeholder": "Telefono",
                    "title": "Telefono de contacto",
                    "mensaje_error": "",
                    "disabled": false,
                    "numberOfLines": "",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "key": "telefo",
                    "name": "telefo",
                    "multiline": false
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
                    "nombre": "adress",
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
                    "key": "adress",
                    "name": "adress",
                    "multiline": true
                },
                {
                    "nombre": "añoingreso",
                    "label": "Año de ingreso",
                    "placeholder": "Año de ingreso",
                    "title": "Dirección",
                    "mensaje_error": "",
                    "disabled": false,
                    "numberOfLines": "",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "key": "añoingreso",
                    "name": "añoingreso"
                },
                {
                    "nombre": "fecing",
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
                    "key": "fecing",
                    "name": "fecing",
                    "multiline": false
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
                    "nombre": "ativo",
                    "label": "Activo",
                    "placeholder": "Activo",
                    "title": "Activo",
                    "mensaje_error": "",
                    "disabled": false,
                    "numberOfLines": "",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "key": "activo",
                    "name": "activo"
                },
                {
                    "nombre": "gradu",
                    "label": "Graduado",
                    "placeholder": "Graduado",
                    "title": "Graduado",
                    "mensaje_error": "",
                    "disabled": false,
                    "numberOfLines": "",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "key": "gradu",
                    "name": "gradu"
                },
                {
                    "nombre": "observa",
                    "label": "Observación",
                    "placeholder": "Observación",
                    "title": "Observación",
                    "mensaje_error": "",
                    "disabled": false,
                    "numberOfLines": "",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "key": "observa",
                    "name": "observa"
                }
            ]
        },
        "Form_notas": {
            "columna": 1,
            "value": []
        },
        "Form_login": {
            "columna": 1,
            "value": [
                {
                    "key": "username",
                    "name": "username",
                    "placeholder": "Username",
                    "mensaje_error": "Indique username",
                    "required": true
                },
                {
                    "key": "password",
                    "name": "password",
                    "label": "Contraseña",
                    "tipo": "password",
                    "mensaje_error": "Indique contraseña",
                    "required": true
                }
            ]
        },
        "Form_User_api": {
            "columna": 2,
            "value": [
                {
                    "key": "foto",
                    "name": "foto",
                    "label": "Foto",
                    "tipo": "Avatar"
                },
                {
                    "key": "username",
                    "name": "username",
                    "placeholder": "Username",
                    "mensaje_error": "Indique username",
                    "required": true,
                    "no_modificar": true
                },
                {
                    "key": "categoria",
                    "name": "categoria",
                    "label": "Categoria Usuario",
                    "tipo": "lista_multiuso",
                    "lista": "lista_categoria",
                    "multiple": false,
                    "getOptionLabel": [
                        "titulo"
                    ]
                },
                {
                    "key": "password",
                    "name": "password",
                    "label": "Contraseña",
                    "tipo": "password",
                    "comparar": "true",
                    "con": "passwordc",
                    "mensaje_error": "Contraseñas no son iguales",
                    "no_mostrar": true
                },
                {
                    "key": "passwordc",
                    "name": "passwordc",
                    "label": "Contraseña Confirmar",
                    "tipo": "password",
                    "comparar": "true",
                    "con": "password",
                    "mensaje_error": "Contraseñas no son iguales"
                },
                {
                    "key": "nombre",
                    "name": "nombre",
                    "placeholder": "Nombre y Apellido"
                }
            ]
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
        ],
        "lista_categoria": [
            {
                "_id": 0,
                "titulo": "AdministradorCHS",
                "permisos": [
                    "*",
                    "**",
                    "*CHS"
                ]
            },
            {
                "_id": 1,
                "titulo": "Administrador",
                "permisos": [
                    "*"
                ]
            },
            {
                "_id": 2,
                "titulo": "personal",
                "permisos": []
            },
            {
                "_id": 3,
                "titulo": "usuario",
                "permisos": []
            },
            {
                "_id": 4,
                "titulo": "Operador",
                "permisos": []
            },
            {
                "_id": 5,
                "titulo": "Personal indirecto",
                "permisos": []
            }
        ]
    },
    "Titulos": {
        "Titulos_unefa_asignatura": [
            {
                "title": "Código Programa",
                "field": "codopcion",
                "tipo": "",
                "formato": "(dato)=> `${dato.valores.codopcion}`",
                "default": "",
                "type": ""
            },
            {
                "title": "Código",
                "field": "codmat",
                "tipo": "",
                "formato": "(dato)=> `${dato.valores.codmat}`",
                "default": "",
                "type": ""
            },
            {
                "title": "Nombre",
                "field": "nommat",
                "tipo": "",
                "formato": "(dato)=> `${dato.valores.nommat}`",
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
                "field": "credito",
                "tipo": "",
                "formato": "(dato)=> `${dato.valores.credito}`",
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
        ],
        "Titulos_User_api": [
            {
                "title": "Foto",
                "field": "foto",
                "tipo": "foto"
            },
            {
                "title": "Username",
                "field": "username",
                "tipo": "",
                "formato": "(dato)=> {\nreturn `${dato.valores.username}`\n}",
                "default": "",
                "type": ""
            },
            {
                "title": "Categoria",
                "field": "categoria",
                "tipo": "lista_categoria"
            },
            {
                "title": "Nombres",
                "field": "nombres",
                "tipo": "",
                "formato": "(dato)=> {\nreturn `${dato.valores.nombre}`\n}",
                "default": "",
                "type": ""
            }
        ]
    },
    "Funciones": {},
    "Subtotales": {}
}