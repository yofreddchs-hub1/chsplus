{
    "Titulo": "SISTEMARAQ ",
    "Logo": "/api/imagen/logo.png",
    "TipoMenu": "1",
    "Estilos": {
        "Logo": {
            "height": 40,
            "width": 40
        },
        "Input_label": {
            "color": "#000",
            "textAlign": "left"
        },
        "Input_helper": {
            "color": "#F92C2C",
            "textAlign": "left"
        },
        "Input_fondo": {
            "backgroundColor": "rgba(0, 0, 0,1)"
        },
        "Input_input": {
            "color": "#ffffff"
        },
        "Input_input_disabled": {
            "color": "#CEBAB6"
        },
        "Input_icono": {
            "color": "#000000"
        },
        "Barra_menu": {
            "backgroundImage": "linear-gradient(180deg, #000000 0, #C1C7C2 16.67%, #C1C7C2 33.33%, #C1C7C2 50%, #C1C7C2 66.67%, #C1C7C2 83.33%, #000000 100%)",
            "color": "#ffffff"
        },
        "Lista_menu_fondo": {
            "bgcolor": "#7ABC32",
            "padding": 0.2,
            "height": "100%"
        },
        "Lista_menu_cuerpo": {
            "primary": {
                "main": "rgb(102, 157, 246)"
            },
            "background": {
                "paper": "rgb(5, 30, 52)"
            }
        },
        "Dialogo_cuerpo": {
            "backgroundColor": "rgb(164, 164, 164)"
        },
        "Tabla_titulo": {
            "color": "#ffffff"
        },
        "Tabla_cabezera": {
            "backgroundImage": "linear-gradient(180deg, #000000 0, #C1C7C2 16.67%, #C1C7C2 33.33%, #C1C7C2 50%, #C1C7C2 66.67%, #C1C7C2 83.33%, #000000 100%)"
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
            "backgroundImage": "linear-gradient(0deg, #A4A4A4 0, #616060 50% )"
        }
    },
    "Menu": [
        {
            "value": "Inicio",
            "primary": "Inicio",
            "icon": "home",
            "libre": "true"
        },
        {
            "value": "Registros",
            "primary": "Registos",
            "icon": "dataset"
        }
    ],
    "Menu_iconos": [],
    "Formularios": {
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
        }
    },
    "Listas": {
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