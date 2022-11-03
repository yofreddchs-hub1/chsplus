{
    "Titulo": "COLEGIO",
    "Logo": "/api/imagen/logo.png",
    "TipoMenu": "1",
    "Estilos": {
        "Logo": {
            "height": 60,
            "width": 60
        },
        "Fondo_pantalla": {
            "backgroundColor": "rgba(255, 255, 255,1)"
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
            "backgroundColor": "rgba(218, 201, 197,1)"
        },
        "Input_input": {
            "color": "#000"
        },
        "Input_input_disabled": {
            "color": "#CEBAB6"
        },
        "Input_icono": {
            "color": "#000"
        },
        "Icon_lista": {
            "color": "#000"
        },
        "Barra_menu": {
            "backgroundImage": "linear-gradient(180deg, #00ffff 0, #00e5ff 12.5%, #10a6f8 25%, #10a6fa 37.5%, #1e6ca3 50%, #1e6ca5 62.5%, #153959 75%, #15395b 87.5%, #000000 100%)",
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
            "backgroundColor": "rgb(255, 255, 250)"
        },
        "Tabla_titulo": {
            "color": "#ffffff"
        },
        "Tabla_cabezera": {
            "backgroundImage": "linear-gradient(180deg, #00ffff 0, #00e5ff 12.5%, #10a6f8 25%, #10a6fa 37.5%, #1e6ca3 50%, #1e6ca5 62.5%, #153959 75%, #15395b 87.5%, #000000 100%)"
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
        "Tabla_subtotal": {
            "backgroundColor": "rgba(251, 252, 252, 1)"
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
            "backgroundImage": "linear-gradient(180deg, #00ffff 0, #00e5ff 12.5%, #10a6f8 25%, #10a6fa 37.5%, #1e6ca3 50%, #1e6ca5 62.5%, #153959 75%, #15395b 87.5%, #000000 100%)"
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
            "value": "Inscripcion",
            "primary": "Inscripción",
            "icon": "drive_file_rename_outline"
        },
        {
            "value": "Pagar",
            "primary": "Pagar",
            "icon": "payments"
        },
        {
            "value": "Administrativo",
            "primary": "Administrativo",
            "icon": "drag_indicator",
            "childen": [
                {
                    "value": "Inscripciones",
                    "primary": "Inscripciones",
                    "icon": "drive_file_rename_outline"
                },
                {
                    "value": "Aranceles",
                    "primary": "Aranceles",
                    "icon": "calculate"
                },
                {
                    "value": "Representantes",
                    "primary": "Representantes",
                    "icon": "groups"
                },
                {
                    "value": "Estudiantes",
                    "primary": "Estudiantes",
                    "icon": "group"
                },
                {
                    "value": "Docentes",
                    "primary": "Docentes",
                    "icon": "diversity_3"
                },
                {
                    "value": "Recibos",
                    "primary": "Recibos",
                    "icon": "text_snippet"
                },
                {
                    "value": "Solvencias",
                    "primary": "Solvencias",
                    "icon": "fact_check"
                }
            ]
        },
        {
            "value": "Horario",
            "primary": "Horario",
            "icon": "calendar_month"
        },
        {
            "value": "Registros",
            "primary": "Registos",
            "icon": "dataset"
        }
    ],
    "Menu_iconos": [],
    "Formularios": {
        "Form_Arancel": {
            "columna": 4,
            "value": [
                {
                    "nombre": "periodo",
                    "name": "periodo",
                    "label": "Periodo",
                    "placeholder": "Periodo Académico",
                    "title": "Periodo Académico",
                    "required": "false",
                    "disabled": false,
                    "tipo": "lista_multiuso",
                    "lista": "colegio_inscripcion",
                    "multiple": false,
                    "agregar": true,
                    "getOptionLabel": [
                        "periodo"
                    ],
                    "form": "Form_Inscripcion",
                    "table": "colegio_inscripcion"
                },
                {
                    "nombre": "mes_inicio",
                    "tipo": "Lista",
                    "label": "Mes de inicio",
                    "placeholder": "Mes de inicio",
                    "title": "",
                    "required": true,
                    "disabled": false,
                    "lista": [
                        {
                            "_id": 0,
                            "titulo": "Inscripción",
                            "value": "inscripcion",
                            "permisos": ""
                        },
                        {
                            "_id": 1,
                            "titulo": "Septiembre",
                            "value": "septiembre",
                            "permisos": ""
                        },
                        {
                            "_id": 2,
                            "titulo": "Octubre",
                            "value": "octubre",
                            "permisos": ""
                        },
                        {
                            "_id": 3,
                            "titulo": "Noviembre",
                            "value": "noviembre",
                            "permisos": ""
                        },
                        {
                            "_id": 4,
                            "titulo": "Diciembre",
                            "value": "diciembre",
                            "permisos": ""
                        },
                        {
                            "_id": 5,
                            "titulo": "Enero",
                            "value": "enero",
                            "permisos": ""
                        },
                        {
                            "_id": 6,
                            "titulo": "Febrero",
                            "value": "febrero",
                            "permisos": ""
                        },
                        {
                            "_id": 7,
                            "titulo": "Marzo",
                            "value": "marzo",
                            "permisos": ""
                        },
                        {
                            "_id": 8,
                            "titulo": "Abril",
                            "value": "abril",
                            "permisos": ""
                        },
                        {
                            "_id": 9,
                            "titulo": "Mayo",
                            "value": "mayo",
                            "permisos": ""
                        },
                        {
                            "_id": 10,
                            "titulo": "Junio",
                            "value": "junio",
                            "permisos": ""
                        },
                        {
                            "_id": 11,
                            "titulo": "Julio",
                            "value": "julio",
                            "permisos": ""
                        },
                        {
                            "_id": 12,
                            "titulo": "Agosto",
                            "value": "agosto",
                            "permisos": ""
                        }
                    ],
                    "agregar": false,
                    "form": "",
                    "titulos": "",
                    "Subtotal": "",
                    "name": "mes_inicio",
                    "multiline": false,
                    "table": [
                        {
                            "_id": 0,
                            "titulo": "Inscripción",
                            "value": "inscripcion",
                            "permisos": ""
                        },
                        {
                            "_id": 1,
                            "titulo": "Septiembre",
                            "value": "septiembre",
                            "permisos": ""
                        },
                        {
                            "_id": 2,
                            "titulo": "Octubre",
                            "value": "octubre",
                            "permisos": ""
                        },
                        {
                            "_id": 3,
                            "titulo": "Noviembre",
                            "value": "noviembre",
                            "permisos": ""
                        },
                        {
                            "_id": 4,
                            "titulo": "Diciembre",
                            "value": "diciembre",
                            "permisos": ""
                        },
                        {
                            "_id": 5,
                            "titulo": "Enero",
                            "value": "enero",
                            "permisos": ""
                        },
                        {
                            "_id": 6,
                            "titulo": "Febrero",
                            "value": "febrero",
                            "permisos": ""
                        },
                        {
                            "_id": 7,
                            "titulo": "Marzo",
                            "value": "marzo",
                            "permisos": ""
                        },
                        {
                            "_id": 8,
                            "titulo": "Abril",
                            "value": "abril",
                            "permisos": ""
                        },
                        {
                            "_id": 9,
                            "titulo": "Mayo",
                            "value": "mayo",
                            "permisos": ""
                        },
                        {
                            "_id": 10,
                            "titulo": "Junio",
                            "value": "junio",
                            "permisos": ""
                        },
                        {
                            "_id": 11,
                            "titulo": "Julio",
                            "value": "julio",
                            "permisos": ""
                        },
                        {
                            "_id": 12,
                            "titulo": "Agosto",
                            "value": "agosto",
                            "permisos": ""
                        }
                    ]
                },
                {
                    "nombre": "mes_final",
                    "tipo": "Lista",
                    "label": "Mes de Finaliza",
                    "placeholder": "Mes de Finaliza",
                    "title": "Mes de Finaliza",
                    "required": true,
                    "disabled": false,
                    "lista": [
                        {
                            "_id": 0,
                            "titulo": "Inscripción",
                            "value": "inscripcion",
                            "permisos": ""
                        },
                        {
                            "_id": 1,
                            "titulo": "Septiembre",
                            "value": "septiembre",
                            "permisos": ""
                        },
                        {
                            "_id": 2,
                            "titulo": "Octubre",
                            "value": "octubre",
                            "permisos": ""
                        },
                        {
                            "_id": 3,
                            "titulo": "Noviembre",
                            "value": "noviembre",
                            "permisos": ""
                        },
                        {
                            "_id": 4,
                            "titulo": "Diciembre",
                            "value": "diciembre",
                            "permisos": ""
                        },
                        {
                            "_id": 5,
                            "titulo": "Enero",
                            "value": "enero",
                            "permisos": ""
                        },
                        {
                            "_id": 6,
                            "titulo": "Febrero",
                            "value": "febrero",
                            "permisos": ""
                        },
                        {
                            "_id": 7,
                            "titulo": "Marzo",
                            "value": "marzo",
                            "permisos": ""
                        },
                        {
                            "_id": 8,
                            "titulo": "Abril",
                            "value": "abril",
                            "permisos": ""
                        },
                        {
                            "_id": 9,
                            "titulo": "Mayo",
                            "value": "mayo",
                            "permisos": ""
                        },
                        {
                            "_id": 10,
                            "titulo": "Junio",
                            "value": "junio",
                            "permisos": ""
                        },
                        {
                            "_id": 11,
                            "titulo": "Julio",
                            "value": "julio",
                            "permisos": ""
                        },
                        {
                            "_id": 12,
                            "titulo": "Agosto",
                            "value": "agosto",
                            "permisos": ""
                        }
                    ],
                    "agregar": false,
                    "form": "",
                    "titulos": "",
                    "Subtotal": "",
                    "name": "mes_final",
                    "multiline": false,
                    "table": [
                        {
                            "_id": 0,
                            "titulo": "Inscripción",
                            "value": "inscripcion",
                            "permisos": ""
                        },
                        {
                            "_id": 1,
                            "titulo": "Septiembre",
                            "value": "septiembre",
                            "permisos": ""
                        },
                        {
                            "_id": 2,
                            "titulo": "Octubre",
                            "value": "octubre",
                            "permisos": ""
                        },
                        {
                            "_id": 3,
                            "titulo": "Noviembre",
                            "value": "noviembre",
                            "permisos": ""
                        },
                        {
                            "_id": 4,
                            "titulo": "Diciembre",
                            "value": "diciembre",
                            "permisos": ""
                        },
                        {
                            "_id": 5,
                            "titulo": "Enero",
                            "value": "enero",
                            "permisos": ""
                        },
                        {
                            "_id": 6,
                            "titulo": "Febrero",
                            "value": "febrero",
                            "permisos": ""
                        },
                        {
                            "_id": 7,
                            "titulo": "Marzo",
                            "value": "marzo",
                            "permisos": ""
                        },
                        {
                            "_id": 8,
                            "titulo": "Abril",
                            "value": "abril",
                            "permisos": ""
                        },
                        {
                            "_id": 9,
                            "titulo": "Mayo",
                            "value": "mayo",
                            "permisos": ""
                        },
                        {
                            "_id": 10,
                            "titulo": "Junio",
                            "value": "junio",
                            "permisos": ""
                        },
                        {
                            "_id": 11,
                            "titulo": "Julio",
                            "value": "julio",
                            "permisos": ""
                        },
                        {
                            "_id": 12,
                            "titulo": "Agosto",
                            "value": "agosto",
                            "permisos": ""
                        }
                    ]
                },
                {
                    "nombre": "monto",
                    "tipo": "number",
                    "label": "Monto",
                    "placeholder": "Monto",
                    "title": "Monto",
                    "required": "false",
                    "disabled": false,
                    "lista": "",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "agregar": "false",
                    "form": "",
                    "titulos": "",
                    "Subtotal": "",
                    "name": "monto",
                    "multiline": false
                }
            ]
        },
        "Form_Inscripcion": {
            "columna": 3,
            "value": [
                {
                    "nombre": "periodo",
                    "tipo": "input",
                    "label": "Periodo",
                    "placeholder": "Periodo Académico",
                    "title": "Periodo Academico",
                    "required": true,
                    "mensaje_error": "Debe indicar el periodo académico",
                    "disabled": false,
                    "lista": "",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "agregar": false,
                    "form": "",
                    "titulos": "",
                    "Subtotal": "",
                    "name": "periodo"
                },
                {
                    "nombre": "titulo",
                    "tipo": "input",
                    "label": "Titulo de inscripción",
                    "placeholder": "Titulo de inscripción",
                    "title": "Titulo de inscripción",
                    "required": true,
                    "mensaje_error": "Debe indicar titulo de la inscripción",
                    "disabled": false,
                    "lista": "",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "agregar": false,
                    "form": "",
                    "titulos": "",
                    "Subtotal": "",
                    "name": "titulo"
                },
                {
                    "nombre": "estatus",
                    "tipo": "Checkbox",
                    "label": "Activo/No activo",
                    "placeholder": "Activo/No activo",
                    "title": "",
                    "required": "false",
                    "disabled": false,
                    "lista": "",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "agregar": "false",
                    "form": "",
                    "titulos": "",
                    "Subtotal": "",
                    "name": "estatus",
                    "multiline": false
                }
            ]
        },
        "Form_Cuenta": {
            "columna": 2,
            "value": [
                {
                    "nombre": "titular",
                    "tipo": "input",
                    "label": "Titular de cuenta",
                    "placeholder": "Titular de cuenta",
                    "title": "Titular de cuenta",
                    "required": true,
                    "mensaje_error": "debe colocar titular de cuenta",
                    "disabled": false,
                    "lista": "",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "agregar": "false",
                    "form": "",
                    "titulos": "",
                    "Subtotal": "",
                    "name": "titular"
                },
                {
                    "nombre": "numero",
                    "tipo": "input",
                    "label": "Numero de cuenta",
                    "placeholder": "Numero de cuenta",
                    "title": "Numero de cuenta",
                    "required": true,
                    "mensaje_error": "Indique el numero de cuenta",
                    "disabled": false,
                    "lista": "",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "agregar": "false",
                    "form": "",
                    "titulos": "",
                    "Subtotal": "",
                    "name": "numero"
                },
                {
                    "nombre": "banco",
                    "tipo": "Lista",
                    "label": "Banco",
                    "placeholder": "Banco",
                    "title": "Banco",
                    "required": true,
                    "disabled": false,
                    "lista": [
                        {
                            "_id": "0175",
                            "titulo": "BANCO BICENTENARIO",
                            "value": "0175",
                            "permisos": "",
                            "id": 1,
                            "otro": "VED"
                        },
                        {
                            "_id": "0128",
                            "titulo": "BANCO CARONI, C.A. BANCO UNIVERSAL",
                            "value": "0128",
                            "permisos": "",
                            "id": 2,
                            "otro": "VED"
                        },
                        {
                            "_id": "0102",
                            "titulo": "BANCO DE VENEZUELA",
                            "value": "0102",
                            "id": 3,
                            "permisos": "",
                            "otro": "VED"
                        },
                        {
                            "_id": "0114",
                            "titulo": "BANCO DEL CARIBE",
                            "value": "0114",
                            "id": 4,
                            "permisos": "",
                            "otro": "VED"
                        },
                        {
                            "_id": "0163",
                            "titulo": "BANCO DEL TESORO",
                            "value": "0163",
                            "id": 5,
                            "permisos": "",
                            "otro": "VED"
                        },
                        {
                            "_id": "0105",
                            "titulo": "BANCO MERCANTIL",
                            "value": "0105",
                            "id": 6,
                            "permisos": "",
                            "otro": "VED"
                        },
                        {
                            "_id": "0191",
                            "titulo": "BANCO NACIONAL DE CREDITO",
                            "value": "0191",
                            "id": 7,
                            "permisos": "",
                            "otro": "VED"
                        },
                        {
                            "_id": "0116",
                            "titulo": "BANCO OCCIDENTAL DE DESCUENTO.",
                            "value": "0116",
                            "id": 8,
                            "permisos": "",
                            "otro": "VED"
                        },
                        {
                            "_id": "0108",
                            "titulo": "BANCO PROVINCIAL BBVA",
                            "value": "0108",
                            "id": 9,
                            "permisos": "",
                            "otro": "VED"
                        },
                        {
                            "_id": "0134",
                            "titulo": "BANESCO BANCO UNIVERSAL",
                            "value": "0134",
                            "id": 10,
                            "permisos": "",
                            "otro": "VED"
                        },
                        {
                            "_id": "0177",
                            "titulo": "BANFANB",
                            "value": "0177"
                        },
                        {
                            "_id": "0190",
                            "titulo": "CITIBANK.",
                            "value": "0190",
                            "id": 12,
                            "permisos": "",
                            "otro": "VED"
                        },
                        {
                            "_id": "0121",
                            "titulo": "CORP BANCA.",
                            "value": "0121",
                            "id": 13,
                            "permisos": "",
                            "otro": "VED"
                        },
                        {
                            "_id": "0157",
                            "titulo": "DELSUR BANCO UNIVERSAL",
                            "value": "0157",
                            "id": 14,
                            "permisos": "",
                            "otro": "VED"
                        },
                        {
                            "_id": "0151",
                            "titulo": "FONDO COMUN",
                            "value": "0151",
                            "id": 15,
                            "permisos": "",
                            "otro": "VED"
                        },
                        {
                            "_id": "BOA",
                            "titulo": "BANK OF AMERICA",
                            "value": "BOA",
                            "permisos": "",
                            "id": 16,
                            "otro": "USD"
                        }
                    ],
                    "agregar": false,
                    "form": "",
                    "titulos": "",
                    "Subtotal": "",
                    "name": "banco",
                    "multiline": false,
                    "table": [
                        {
                            "_id": "0175",
                            "titulo": "BANCO BICENTENARIO",
                            "value": "0175",
                            "permisos": "",
                            "id": 1,
                            "otro": "VED"
                        },
                        {
                            "_id": "0128",
                            "titulo": "BANCO CARONI, C.A. BANCO UNIVERSAL",
                            "value": "0128",
                            "permisos": "",
                            "id": 2,
                            "otro": "VED"
                        },
                        {
                            "_id": "0102",
                            "titulo": "BANCO DE VENEZUELA",
                            "value": "0102",
                            "id": 3,
                            "permisos": "",
                            "otro": "VED"
                        },
                        {
                            "_id": "0114",
                            "titulo": "BANCO DEL CARIBE",
                            "value": "0114",
                            "id": 4,
                            "permisos": "",
                            "otro": "VED"
                        },
                        {
                            "_id": "0163",
                            "titulo": "BANCO DEL TESORO",
                            "value": "0163",
                            "id": 5,
                            "permisos": "",
                            "otro": "VED"
                        },
                        {
                            "_id": "0105",
                            "titulo": "BANCO MERCANTIL",
                            "value": "0105",
                            "id": 6,
                            "permisos": "",
                            "otro": "VED"
                        },
                        {
                            "_id": "0191",
                            "titulo": "BANCO NACIONAL DE CREDITO",
                            "value": "0191",
                            "id": 7,
                            "permisos": "",
                            "otro": "VED"
                        },
                        {
                            "_id": "0116",
                            "titulo": "BANCO OCCIDENTAL DE DESCUENTO.",
                            "value": "0116",
                            "id": 8,
                            "permisos": "",
                            "otro": "VED"
                        },
                        {
                            "_id": "0108",
                            "titulo": "BANCO PROVINCIAL BBVA",
                            "value": "0108",
                            "id": 9,
                            "permisos": "",
                            "otro": "VED"
                        },
                        {
                            "_id": "0134",
                            "titulo": "BANESCO BANCO UNIVERSAL",
                            "value": "0134",
                            "id": 10,
                            "permisos": "",
                            "otro": "VED"
                        },
                        {
                            "_id": "0177",
                            "titulo": "BANFANB",
                            "value": "0177"
                        },
                        {
                            "_id": "0190",
                            "titulo": "CITIBANK.",
                            "value": "0190",
                            "id": 12,
                            "permisos": "",
                            "otro": "VED"
                        },
                        {
                            "_id": "0121",
                            "titulo": "CORP BANCA.",
                            "value": "0121",
                            "id": 13,
                            "permisos": "",
                            "otro": "VED"
                        },
                        {
                            "_id": "0157",
                            "titulo": "DELSUR BANCO UNIVERSAL",
                            "value": "0157",
                            "id": 14,
                            "permisos": "",
                            "otro": "VED"
                        },
                        {
                            "_id": "0151",
                            "titulo": "FONDO COMUN",
                            "value": "0151",
                            "id": 15,
                            "permisos": "",
                            "otro": "VED"
                        },
                        {
                            "_id": "BOA",
                            "titulo": "BANK OF AMERICA",
                            "value": "BOA",
                            "permisos": "",
                            "id": 16,
                            "otro": "USD"
                        }
                    ]
                },
                {
                    "nombre": "tipo",
                    "tipo": "input",
                    "label": "Tipo de cuenta",
                    "placeholder": "Tipo de cuenta",
                    "title": "Tipo de cuenta",
                    "required": true,
                    "mensaje_error": "Indique el tipo de cuenta",
                    "disabled": false,
                    "lista": "",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "agregar": "false",
                    "form": "",
                    "titulos": "",
                    "Subtotal": "",
                    "name": "tipo"
                }
            ]
        },
        "Form_Estudiante": {
            "columna": 4,
            "value": [
                {
                    "nombre": "cedula",
                    "tipo": "input",
                    "label": "Cedula",
                    "placeholder": "Cedula",
                    "title": "Cedula de identidad",
                    "required": true,
                    "mensaje_error": "Indique cedula de identidad",
                    "disabled": false,
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "agregar": false,
                    "name": "cedula"
                },
                {
                    "nombre": "cedula_estudiantil",
                    "tipo": "input",
                    "label": "Cedula Estudiantil",
                    "placeholder": "Cedula Estudiantil",
                    "title": "Cedula Estudiantil",
                    "required": false,
                    "disabled": false,
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "agregar": false,
                    "name": "cedula_estudiantil"
                },
                {
                    "nombre": "nombres",
                    "tipo": "input",
                    "label": "Nombres",
                    "placeholder": "Nombres",
                    "title": "Nombres del estudiante",
                    "required": true,
                    "mensaje_error": "indique nombre del estudiante",
                    "disabled": false,
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "agregar": false,
                    "name": "nombres"
                },
                {
                    "nombre": "apellidos",
                    "tipo": "input",
                    "label": "Apellidos",
                    "placeholder": "Apellidos",
                    "title": "Apellidos del estudiante",
                    "required": true,
                    "disabled": false,
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "agregar": false,
                    "name": "apellidos"
                },
                {
                    "nombre": "sexo",
                    "tipo": "lista_multiuso",
                    "label": "Sexo",
                    "placeholder": "Sexo",
                    "title": "Sexo del estudiante",
                    "required": false,
                    "mensaje_error": "",
                    "disabled": false,
                    "numberOfLines": "",
                    "lista": "lista_colegio_sexo",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "agregar": false,
                    "key": "sexo",
                    "name": "sexo"
                },
                {
                    "nombre": "lugar_nacimiento",
                    "tipo": "input",
                    "label": "Lugar de Nacimiento",
                    "placeholder": "Lugar de Nacimiento",
                    "title": "Lugar de Nacimiento",
                    "disabled": false,
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "agregar": false,
                    "name": "lugar_nacimiento"
                },
                {
                    "nombre": "fecha_nacimiento",
                    "tipo": "Fecha",
                    "label": "Fecha de Nacimiento",
                    "placeholder": "Fecha de Nacimiento",
                    "title": "Fecha de Nacimiento",
                    "disabled": false,
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "agregar": false,
                    "name": "fecha_nacimiento",
                    "type": "date"
                },
                {
                    "nombre": "correo",
                    "tipo": "input",
                    "label": "Correo Electrónico",
                    "placeholder": "Correo Electrónico",
                    "title": "Correo Electrónico",
                    "disabled": false,
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "agregar": false,
                    "name": "correo"
                },
                {
                    "nombre": "telefono_movil",
                    "tipo": "input",
                    "label": "Teléfono Móvil",
                    "placeholder": "Teléfono Móvil",
                    "title": "Teléfono Móvil",
                    "disabled": false,
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "agregar": false,
                    "name": "telefono_movil"
                },
                {
                    "nombre": "telefono_fijo",
                    "tipo": "input",
                    "label": "Teléfono Fijo",
                    "placeholder": "Teléfono Fijo",
                    "title": "Teléfono Fijo",
                    "disabled": false,
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "agregar": false,
                    "name": "telefono_fijo"
                },
                {
                    "nombre": "municipio",
                    "tipo": "input",
                    "label": "Municipio",
                    "placeholder": "Municipio",
                    "title": "Municipio",
                    "disabled": false,
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "name": "municipio"
                },
                {
                    "nombre": "parroquia",
                    "tipo": "input",
                    "label": "Parroquia",
                    "placeholder": "Parroquia",
                    "title": "Parroquia",
                    "disabled": false,
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "name": "parroquia"
                },
                {
                    "nombre": "direccion",
                    "tipo": "multiline",
                    "label": "Dirección",
                    "placeholder": "Dirección",
                    "title": "Dirección",
                    "disabled": false,
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "agregar": false,
                    "name": "direccion",
                    "multiline": true,
                    "maxRows": "3"
                },
                {
                    "nombre": "sector",
                    "tipo": "input",
                    "label": "Sector",
                    "placeholder": "Sector",
                    "title": "Sector",
                    "disabled": false,
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "name": "sector"
                },
                {
                    "nombre": "tipo_sangre",
                    "tipo": "input",
                    "label": "Tipo de Sangre",
                    "placeholder": "Tipo de Sangre",
                    "title": "Tipo de Sangre",
                    "disabled": false,
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "name": "tipo_sangre"
                },
                {
                    "nombre": "estatura",
                    "tipo": "number",
                    "label": "Estatura",
                    "placeholder": "Estatura",
                    "title": "Estatura",
                    "disabled": false,
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "name": "estatura",
                    "multiline": false
                },
                {
                    "nombre": "peso",
                    "tipo": "number",
                    "label": "Peso",
                    "placeholder": "Peso",
                    "title": "Peso",
                    "disabled": false,
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "name": "peso",
                    "multiline": false
                },
                {
                    "nombre": "alergias",
                    "tipo": "input",
                    "label": "Alergia(s)",
                    "placeholder": "Alergia(s)",
                    "title": "Alergias",
                    "disabled": false,
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "agregar": false,
                    "name": "alergias"
                },
                {
                    "nombre": "impedimentos",
                    "tipo": "input",
                    "label": "Impedimento(s)",
                    "placeholder": "Impedimento(s)",
                    "title": "Impedimento(s)",
                    "disabled": false,
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "name": "impedimentos"
                },
                {
                    "nombre": "medico",
                    "tipo": "input",
                    "label": "Medico",
                    "placeholder": "Medico",
                    "title": "Medico",
                    "disabled": false,
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "name": "medico"
                },
                {
                    "nombre": "actividad_extra",
                    "tipo": "input",
                    "label": "Actividades Extras",
                    "placeholder": "Actividades Extras",
                    "title": "Actividades Extras",
                    "disabled": false,
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "name": "actividad_extra"
                },
                {
                    "nombre": "traslado",
                    "tipo": "input",
                    "label": "Traslado",
                    "placeholder": "Traslado",
                    "title": "",
                    "disabled": false,
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "name": "traslado"
                },
                {
                    "nombre": "persona_autorizada",
                    "tipo": "input",
                    "label": "Persona Autorizada",
                    "placeholder": "Persona Autorizada",
                    "title": "Persona Autorizada para el traslado",
                    "disabled": false,
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "name": "persona_autorizada"
                },
                {
                    "nombre": "cedula_persona_autorizada",
                    "tipo": "input",
                    "label": "Cedula de Persona Autorizada",
                    "placeholder": "Cedula de Persona Autorizada",
                    "title": "Cedula de Persona Autorizada para traslado",
                    "disabled": false,
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "name": "cedula_persona_autorizada"
                },
                {
                    "nombre": "afinidad_persona_autorizada",
                    "tipo": "input",
                    "label": "Afinidad Persona Autorizada",
                    "placeholder": "Afinidad Persona Autorizada",
                    "title": "Afinidad Persona Autorizada para el traslado",
                    "disabled": false,
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "name": "afinidad_persona_autorizada"
                },
                {
                    "nombre": "grado",
                    "tipo": "lista_multiuso",
                    "label": "Grado",
                    "placeholder": "Grado",
                    "title": "Grado",
                    "required": false,
                    "mensaje_error": "",
                    "disabled": false,
                    "numberOfLines": "",
                    "lista": "lista_colegio_grado",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "agregar": false,
                    "key": "grado",
                    "name": "grado"
                },
                {
                    "nombre": "seccion",
                    "tipo": "lista_multiuso",
                    "label": "Sección",
                    "placeholder": "Sección",
                    "title": "Sección",
                    "required": false,
                    "mensaje_error": "",
                    "disabled": false,
                    "numberOfLines": "",
                    "lista": "lista_colegio_seccion",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "agregar": false,
                    "key": "seccion",
                    "name": "seccion"
                },
                {
                    "nombre": "beca",
                    "tipo": "number",
                    "label": "% de Beca",
                    "placeholder": "% de Beca",
                    "title": "% de Beca",
                    "disabled": false,
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "name": "beca",
                    "multiline": false
                },
                {
                    "nombre": "estatus",
                    "tipo": "lista_multiuso",
                    "label": "Estado del Estudiante",
                    "placeholder": "Estado del Estudiante",
                    "title": "Estado del Estudiante",
                    "required": false,
                    "mensaje_error": "",
                    "disabled": false,
                    "numberOfLines": "",
                    "lista": "lista_colegio_status_estudiante",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "agregar": false,
                    "key": "estatus",
                    "name": "estatus"
                },
                {
                    "nombre": "representante",
                    "tipo": "lista_multiuso",
                    "label": "Representante",
                    "placeholder": "Representante",
                    "title": "Representante",
                    "required": false,
                    "mensaje_error": "",
                    "disabled": false,
                    "numberOfLines": "",
                    "lista": "colegio_representante",
                    "getOptionLabel": [
                        "cedula",
                        "nombres",
                        "apellidos"
                    ],
                    "key": "representante",
                    "name": "representante"
                }
            ]
        },
        "Form_Asignatura": {
            "columna": 2,
            "value": [
                {
                    "nombre": "grado",
                    "tipo": "lista_multiuso",
                    "label": "Grado",
                    "placeholder": "Grado",
                    "title": "Grado",
                    "mensaje_error": "",
                    "disabled": false,
                    "numberOfLines": "",
                    "lista": "lista_colegio_grado",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "key": "grado",
                    "name": "grado",
                    "multiline": false
                },
                {
                    "nombre": "asignatura",
                    "tipo": "input",
                    "label": "Asignatura",
                    "placeholder": "Asignatura",
                    "title": "Asignatura",
                    "mensaje_error": "",
                    "disabled": false,
                    "numberOfLines": "",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "key": "asignatura",
                    "name": "asignatura"
                }
            ]
        },
        "Form_Representante": {
            "columna": 4,
            "value": [
                {
                    "nombre": "cedula",
                    "tipo": "input",
                    "label": "Cedula",
                    "placeholder": "Cedula",
                    "title": "Cedula de identidad",
                    "required": true,
                    "mensaje_error": "Debe indicar cedula de identidad",
                    "disabled": false,
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "name": "cedula"
                },
                {
                    "nombre": "nombres",
                    "tipo": "input",
                    "label": "Nombres",
                    "placeholder": "Nombres",
                    "title": "Nombres del representante",
                    "required": true,
                    "mensaje_error": "Debe indicar nombres del representante",
                    "disabled": false,
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "name": "nombres"
                },
                {
                    "nombre": "apellidos",
                    "tipo": "input",
                    "label": "Apellidos",
                    "placeholder": "Apellidos",
                    "title": "Apellidos del representante",
                    "required": true,
                    "mensaje_error": "Debe indicar apellidos del representante",
                    "disabled": false,
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "name": "apellidos"
                },
                {
                    "nombre": "parentesco",
                    "tipo": "lista_multiuso",
                    "label": "Parentesco",
                    "placeholder": "Parentesco",
                    "title": "Parentesco ",
                    "required": true,
                    "mensaje_error": "",
                    "disabled": false,
                    "numberOfLines": "",
                    "lista": "lista_colegio_parentesco",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "agregar": false,
                    "key": "parentesco",
                    "name": "parentesco",
                    "multiline": false
                },
                {
                    "nombre": "lugar_nacimiento",
                    "tipo": "input",
                    "label": "Lugar de Nacimiento",
                    "placeholder": "Lugar de Nacimiento",
                    "title": "Lugar de Nacimiento",
                    "required": false,
                    "disabled": false,
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "name": "lugar_nacimiento"
                },
                {
                    "nombre": "fecha_nacimiento",
                    "tipo": "Fecha",
                    "label": "Fecha de Nacimiento",
                    "placeholder": "Fecha de Nacimiento",
                    "title": "Fecha de Nacimiento",
                    "required": false,
                    "disabled": false,
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "name": "fecha_nacimiento",
                    "multiline": false,
                    "type": "date"
                },
                {
                    "nombre": "correo",
                    "tipo": "input",
                    "label": "Correo",
                    "placeholder": "Correo",
                    "title": "Correo",
                    "required": false,
                    "disabled": false,
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "name": "correo",
                    "multiline": false
                },
                {
                    "nombre": "telefono_movil",
                    "tipo": "input",
                    "label": "Telefono Movil",
                    "placeholder": "Telefono Movil",
                    "title": "Telefono Movil",
                    "required": false,
                    "disabled": false,
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "name": "telefono_movil",
                    "multiline": false
                },
                {
                    "nombre": "telefono_fijo",
                    "tipo": "input",
                    "label": "Teléfono Fijo",
                    "placeholder": "Teléfono Fijo",
                    "title": "Teléfono Fijo",
                    "required": false,
                    "disabled": false,
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "name": "telefono_fijo",
                    "multiline": false
                },
                {
                    "nombre": "municipio",
                    "tipo": "input",
                    "label": "Municipio",
                    "placeholder": "Municipio",
                    "title": "Municipio",
                    "required": false,
                    "disabled": false,
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "name": "municipio",
                    "multiline": false
                },
                {
                    "nombre": "parroquia",
                    "tipo": "input",
                    "label": "Parroquia",
                    "placeholder": "Parroquia",
                    "title": "Parroquia",
                    "required": false,
                    "disabled": false,
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "name": "parroquia",
                    "multiline": false
                },
                {
                    "nombre": "sector",
                    "tipo": "input",
                    "label": "Sector",
                    "placeholder": "Sector",
                    "title": "Sector",
                    "required": false,
                    "disabled": false,
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "name": "sector",
                    "multiline": false
                },
                {
                    "nombre": "direccion",
                    "tipo": "multiline",
                    "label": "Dirección",
                    "placeholder": "Dirección",
                    "title": "Dirección",
                    "required": false,
                    "disabled": false,
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "name": "direccion",
                    "multiline": true,
                    "maxRows": 4
                },
                {
                    "nombre": "profesion",
                    "tipo": "input",
                    "label": "Profesión",
                    "placeholder": "Profesión",
                    "title": "Profesión",
                    "required": false,
                    "disabled": false,
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "name": "profesion",
                    "multiline": false
                },
                {
                    "nombre": "lugar_trabajo",
                    "tipo": "input",
                    "label": "Lugar Trabajo",
                    "placeholder": "Lugar Trabajo",
                    "title": "Lugar Trabajo",
                    "required": false,
                    "disabled": false,
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "name": "lugar_trabajo",
                    "multiline": false
                },
                {
                    "nombre": "telefono_trabajo",
                    "tipo": "input",
                    "label": "Teléfono de Trabajo",
                    "placeholder": "Teléfono de Trabajo",
                    "title": "Teléfono de Trabajo",
                    "required": false,
                    "disabled": false,
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "name": "telefono_trabajo",
                    "multiline": false
                },
                {
                    "nombre": "direccion_trabajo",
                    "tipo": "multiline",
                    "label": "Dirección de Trabajo",
                    "placeholder": "Dirección de Trabajo",
                    "title": "Dirección de Trabajo",
                    "required": false,
                    "disabled": false,
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "name": "direccion_trabajo",
                    "multiline": true,
                    "maxRows": 4
                },
                {
                    "nombre": "representados",
                    "tipo": "lista_representados",
                    "activar": true,
                    "lista": "colegio_estudiante",
                    "filtro": "(datos)=>datos.filter(f=>{console.log(f); return f.representante===null || f.representante==='null' || f.representante===''})",
                    "label": "Representado(s)",
                    "placeholder": "Representado(s)",
                    "title": "Representado(s)",
                    "disabled": false,
                    "name": "representados",
                    "multiline": false,
                    "getOptionLabel": [
                        "cedula",
                        "nombres",
                        "apellidos"
                    ]
                }
            ]
        },
        "Form_Docente": {
            "columna": 4,
            "value": [
                {
                    "nombre": "foto",
                    "tipo": "Avatar",
                    "label": "Foto",
                    "placeholder": "Foto",
                    "title": "Foto",
                    "mensaje_error": "",
                    "disabled": true,
                    "numberOfLines": "",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "key": "foto",
                    "name": "foto",
                    "multiline": false
                },
                {
                    "nombre": "cedula",
                    "tipo": "input",
                    "label": "Cedula",
                    "placeholder": "Cedula",
                    "title": "Cedula",
                    "required": true,
                    "mensaje_error": "Debe indicar la cedula del docente",
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
                    "tipo": "input",
                    "label": "Nombres",
                    "placeholder": "Nombres",
                    "title": "Nombres",
                    "required": true,
                    "mensaje_error": "Debe indicar nombre del docente",
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
                    "tipo": "input",
                    "label": "Apellidos",
                    "placeholder": "Apellidos",
                    "title": "Apellidos",
                    "required": true,
                    "mensaje_error": "Debe indicar apellido del docente",
                    "disabled": false,
                    "numberOfLines": "",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "key": "apellidos",
                    "name": "apellidos"
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
                    "lista": "lista_colegio_sexo",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "key": "sexo",
                    "name": "sexo",
                    "multiline": false
                },
                {
                    "nombre": "correo",
                    "tipo": "input",
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
                    "nombre": "telefono_movil",
                    "tipo": "input",
                    "label": "Teléfono Móvil",
                    "placeholder": "Teléfono Móvil",
                    "title": "Teléfono Móvil",
                    "mensaje_error": "",
                    "disabled": false,
                    "numberOfLines": "",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "key": "telefono_movil",
                    "name": "telefono_movil"
                },
                {
                    "nombre": "telefono_fijo",
                    "tipo": "input",
                    "label": "Teléfono Fijo",
                    "placeholder": "Teléfono Fijo",
                    "title": "Teléfono Fijo",
                    "mensaje_error": "",
                    "disabled": false,
                    "numberOfLines": "",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "key": "telefono_fijo",
                    "name": "telefono_fijo"
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
                    "nombre": "municipio",
                    "tipo": "input",
                    "label": "Municipio",
                    "placeholder": "Municipio",
                    "title": "Municipio",
                    "mensaje_error": "",
                    "disabled": false,
                    "numberOfLines": "",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "key": "municipio",
                    "name": "municipio"
                },
                {
                    "nombre": "parroquia",
                    "tipo": "input",
                    "label": "Parroquia",
                    "placeholder": "Parroquia",
                    "title": "Parroquia",
                    "mensaje_error": "",
                    "disabled": false,
                    "numberOfLines": "",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "key": "parroquia",
                    "name": "parroquia"
                },
                {
                    "nombre": "sector",
                    "tipo": "input",
                    "label": "Sector",
                    "placeholder": "Sector",
                    "title": "Sector",
                    "mensaje_error": "",
                    "disabled": false,
                    "numberOfLines": "",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "key": "sector",
                    "name": "sector"
                },
                {
                    "nombre": "profesion",
                    "tipo": "input",
                    "label": "Profesión",
                    "placeholder": "Profesión",
                    "title": "Profesión",
                    "mensaje_error": "",
                    "disabled": false,
                    "numberOfLines": "",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "key": "profesion",
                    "name": "profesion"
                },
                {
                    "nombre": "asignaturas",
                    "tipo": "lista_multiuso",
                    "label": "Asignatura(s)",
                    "placeholder": "Asignatura(s)",
                    "title": "Asignatura(s)",
                    "mensaje_error": "",
                    "disabled": false,
                    "numberOfLines": "",
                    "lista": "colegio_asignatura",
                    "getOptionLabel": [
                        "asignatura"
                    ],
                    "key": "asignaturas",
                    "name": "asignaturas",
                    "multiline": false,
                    "multiple": true
                },
                {
                    "nombre": "grados",
                    "tipo": "lista_multiuso",
                    "label": "Grado(s)",
                    "placeholder": "Grado(s)",
                    "title": "Grado(s)",
                    "mensaje_error": "",
                    "disabled": false,
                    "numberOfLines": "",
                    "lista": "lista_colegio_grado",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "key": "grados",
                    "name": "grados",
                    "multiline": false,
                    "multiple": true
                }
            ]
        },
        "Form_Representados": {
            "columna": 1,
            "value": [
                {
                    "nombre": "representados",
                    "tipo": "Tabla",
                    "label": "Representados",
                    "placeholder": "Representados",
                    "title": "Representados",
                    "mensaje_error": "",
                    "disabled": false,
                    "numberOfLines": "",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "key": "representados",
                    "name": "representados",
                    "multiline": false,
                    "titulos": "Titulos_EstudianteR"
                }
            ]
        },
        "Form_Mensualidades": {
            "columna": 1,
            "value": [
                {
                    "nombre": "meses",
                    "tipo": "Tabla",
                    "label": "Mensualidad(es)",
                    "placeholder": "Mensualidad(es)",
                    "title": "Mensualidad(es)",
                    "mensaje_error": "",
                    "disabled": false,
                    "numberOfLines": "",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "key": "meses",
                    "name": "meses",
                    "multiline": false,
                    "titulos": "Titulos_Mensualidad",
                    "Subtotal": "Subtotal_mensualidad"
                }
            ]
        },
        "Form_FormasPago": {
            "columna": 1,
            "value": [
                {
                    "nombre": "formaspago",
                    "tipo": "Tabla",
                    "label": "Forma(s) de Pago",
                    "placeholder": "Forma(s) de Pago",
                    "title": "Forma(s) de Pago",
                    "mensaje_error": "",
                    "disabled": false,
                    "numberOfLines": "",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "key": "formaspago",
                    "name": "formaspago",
                    "multiline": false,
                    "titulos": "Titulos_Formaspago"
                }
            ]
        },
        "Form_fecha_recibo": {
            "columna": 2,
            "value": [
                {
                    "nombre": "inicio",
                    "tipo": "Fecha",
                    "label": "Fecha Inicio",
                    "placeholder": "Fecha Inicio",
                    "title": "Fecha Inicio",
                    "mensaje_error": "",
                    "disabled": false,
                    "numberOfLines": "",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "key": "inicio",
                    "name": "inicio",
                    "multiline": false
                },
                {
                    "nombre": "fin",
                    "tipo": "Fecha",
                    "label": "Fecha Fin",
                    "placeholder": "Fecha Fin",
                    "title": "Fecha Fin",
                    "mensaje_error": "",
                    "disabled": false,
                    "numberOfLines": "",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "key": "fin",
                    "name": "fin",
                    "multiline": false
                }
            ]
        },
        "Form_filtro_solvencias": {
            "columna": 3,
            "value": [
                {
                    "nombre": "periodo",
                    "tipo": "lista_multiuso",
                    "label": "Periodo",
                    "placeholder": "Periodo",
                    "title": "Periodo",
                    "mensaje_error": "",
                    "disabled": false,
                    "numberOfLines": "",
                    "lista": "colegio_inscripcion",
                    "getOptionLabel": [
                        "periodo"
                    ],
                    "key": "periodo",
                    "name": "periodo",
                    "multiline": false
                },
                {
                    "nombre": "grado",
                    "tipo": "lista_multiuso",
                    "label": "Grado",
                    "placeholder": "Grado",
                    "title": "Grado",
                    "mensaje_error": "",
                    "disabled": false,
                    "numberOfLines": "",
                    "lista": "lista_colegio_grado",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "key": "grado",
                    "name": "grado",
                    "multiline": false
                }
            ]
        },
        "Form_Cambio": {
            "columna": 1,
            "value": [
                {
                    "nombre": "cambio",
                    "tipo": "number",
                    "label": "Tasa de cambio",
                    "placeholder": "Tasa de cambio",
                    "title": "Tasa de cambio",
                    "mensaje_error": "",
                    "disabled": false,
                    "numberOfLines": "",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "key": "cambio",
                    "name": "cambio",
                    "multiline": false
                }
            ]
        },
        "Form_Mensualidad": {
            "columna": 1,
            "value": [
                {
                    "nombre": "Meses-JAVIER-CHIRINO",
                    "tipo": "lista_multiuso",
                    "label": "Mensualidad(es)",
                    "placeholder": "Mensualidad(es)",
                    "title": "Mensualidad(es)",
                    "mensaje_error": "",
                    "disabled": false,
                    "numberOfLines": "",
                    "lista": "lista_Meses",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "key": "meses-",
                    "name": "Meses-JAVIER-CHIRINO",
                    "multiline": false,
                    "multiple": true
                }
            ]
        },
        "Form_Forma_Pago": {
            "columna": 4,
            "value": [
                {
                    "nombre": "formapago",
                    "tipo": "lista_multiuso",
                    "label": "Forma de Pago",
                    "placeholder": "Forma de Pago",
                    "title": "Forma de Pago",
                    "mensaje_error": "",
                    "disabled": false,
                    "numberOfLines": "",
                    "lista": "lista_Forma_Pago",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "key": "formapago",
                    "name": "formapago"
                },
                {
                    "nombre": "fecha",
                    "tipo": "Fecha",
                    "label": "Fecha",
                    "placeholder": "Fecha",
                    "title": "Fecha",
                    "mensaje_error": "",
                    "disabled": false,
                    "numberOfLines": "",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "key": "fecha",
                    "name": "fecha",
                    "multiline": false
                },
                {
                    "nombre": "bancoorigen",
                    "tipo": "lista_multiuso",
                    "label": "Banco Origen",
                    "placeholder": "Banco Origen",
                    "title": "Banco Origen",
                    "required": true,
                    "mensaje_error": "Debe indicar banco de origen",
                    "disabled": false,
                    "numberOfLines": "",
                    "lista": "lista_egew_cuentas_banco",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "key": "bancoorigen",
                    "name": "bancoorigen"
                },
                {
                    "nombre": "bancodestino",
                    "tipo": "lista_multiuso",
                    "label": "Banco Destino",
                    "placeholder": "Banco Destino",
                    "title": "Banco Destino",
                    "required": true,
                    "mensaje_error": "Debe indicar banco destino",
                    "disabled": false,
                    "numberOfLines": "",
                    "lista": "colegio_cuenta",
                    "getOptionLabel": [
                        "numero",
                        "banco.titulo"
                    ],
                    "key": "bancodestino",
                    "name": "bancodestino"
                },
                {
                    "nombre": "referencia",
                    "tipo": "input",
                    "label": "Referencia",
                    "placeholder": "Referencia",
                    "title": "Referencia",
                    "required": true,
                    "mensaje_error": "Debe indicar cedula de identidad",
                    "disabled": false,
                    "numberOfLines": "",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "key": "referencia",
                    "name": "referencia",
                    "multiline": false
                },
                {
                    "nombre": "cedula",
                    "tipo": "input",
                    "label": "Cedula",
                    "placeholder": "Cedula",
                    "title": "Cedula",
                    "required": true,
                    "mensaje_error": "Debe indicar cedula de identidad",
                    "disabled": false,
                    "numberOfLines": "",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "key": "cedula",
                    "name": "cedula",
                    "multiline": false
                },
                {
                    "nombre": "monto",
                    "tipo": "number",
                    "label": "Monto",
                    "placeholder": "Monto",
                    "title": "Monto",
                    "required": true,
                    "mensaje_error": "",
                    "disabled": false,
                    "numberOfLines": "",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "key": "monto",
                    "name": "monto",
                    "multiline": false
                }
            ]
        }
    },
    "Listas": {
        "lista_Meses": [
            {
                "_id": 0,
                "titulo": "Inscripción",
                "value": "inscripcion",
                "permisos": ""
            },
            {
                "_id": 1,
                "titulo": "Septiembre",
                "value": "septiembre",
                "permisos": ""
            },
            {
                "_id": 2,
                "titulo": "Octubre",
                "value": "octubre",
                "permisos": ""
            },
            {
                "_id": 3,
                "titulo": "Noviembre",
                "value": "noviembre",
                "permisos": ""
            },
            {
                "_id": 4,
                "titulo": "Diciembre",
                "value": "diciembre",
                "permisos": ""
            },
            {
                "_id": 5,
                "titulo": "Enero",
                "value": "enero",
                "permisos": ""
            },
            {
                "_id": 6,
                "titulo": "Febrero",
                "value": "febrero",
                "permisos": ""
            },
            {
                "_id": 7,
                "titulo": "Marzo",
                "value": "marzo",
                "permisos": ""
            },
            {
                "_id": 8,
                "titulo": "Abril",
                "value": "abril",
                "permisos": ""
            },
            {
                "_id": 9,
                "titulo": "Mayo",
                "value": "mayo",
                "permisos": ""
            },
            {
                "_id": 10,
                "titulo": "Junio",
                "value": "junio",
                "permisos": ""
            },
            {
                "_id": 11,
                "titulo": "Julio",
                "value": "julio",
                "permisos": ""
            },
            {
                "_id": 12,
                "titulo": "Agosto",
                "value": "agosto",
                "permisos": ""
            }
        ],
        "lista_colegio_status_estudiante": [
            {
                "_id": 0,
                "titulo": "Pre-Inscrito",
                "value": "preinscrito",
                "permisos": "",
                "id": 1,
                "otro": ""
            },
            {
                "_id": 1,
                "titulo": "Inscrito",
                "value": "inscrito",
                "permisos": ""
            },
            {
                "_id": 2,
                "titulo": "Graduado",
                "value": "graduado",
                "permisos": ""
            },
            {
                "_id": 3,
                "titulo": "Retirado",
                "value": "retirado",
                "permisos": ""
            },
            {
                "_id": 4,
                "titulo": "Otro caso",
                "value": "otro",
                "permisos": ""
            }
        ],
        "lista_colegio_sexo": [
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
        "lista_colegio_grado": [
            {
                "_id": 0,
                "titulo": "1er año",
                "value": "1er",
                "permisos": ""
            },
            {
                "_id": 1,
                "titulo": "2do año",
                "value": "2do",
                "permisos": ""
            },
            {
                "_id": 2,
                "titulo": "3er año",
                "value": "3er",
                "permisos": ""
            },
            {
                "_id": 3,
                "titulo": "4to año",
                "value": "4to",
                "permisos": ""
            },
            {
                "_id": 4,
                "titulo": "5to año",
                "value": "5to",
                "permisos": ""
            }
        ],
        "lista_colegio_seccion": [
            {
                "_id": 0,
                "titulo": "A",
                "value": "A",
                "permisos": ""
            },
            {
                "_id": 1,
                "titulo": "B",
                "value": "B",
                "permisos": ""
            },
            {
                "_id": 2,
                "titulo": "C",
                "value": "C",
                "permisos": ""
            }
        ],
        "lista_colegio_parentesco": [
            {
                "_id": 0,
                "titulo": "Mamá",
                "value": "mama",
                "permisos": ""
            },
            {
                "_id": 1,
                "titulo": "Papá",
                "value": "papa",
                "permisos": ""
            },
            {
                "_id": 2,
                "titulo": "Abuela",
                "value": "abuela",
                "permisos": ""
            },
            {
                "_id": 3,
                "titulo": "Abuelo",
                "value": "abuelo",
                "permisos": ""
            },
            {
                "_id": 4,
                "titulo": "Tía",
                "value": "tia",
                "permisos": ""
            },
            {
                "_id": 5,
                "titulo": "Tío",
                "value": "tio",
                "permisos": ""
            },
            {
                "_id": 6,
                "titulo": "Otro",
                "value": "otro",
                "permisos": ""
            }
        ],
        "lista_Forma_Pago": [
            {
                "_id": 0,
                "titulo": "Transferencia",
                "value": "transferencia",
                "permisos": ""
            },
            {
                "_id": 1,
                "titulo": "Debito",
                "value": "debito",
                "permisos": ""
            },
            {
                "_id": 2,
                "titulo": "Efectivo Bolívar",
                "value": "efectivobolivar",
                "permisos": ""
            },
            {
                "_id": 3,
                "titulo": "Efectivo Dolar",
                "value": "efectivodolar",
                "permisos": "",
                "id": 4,
                "otro": ""
            },
            {
                "_id": 4,
                "titulo": "Pago Móvil",
                "value": "pagomovil",
                "permisos": ""
            },
            {
                "_id": 5,
                "titulo": "Otro",
                "value": "otro",
                "permisos": ""
            }
        ]
    },
    "Titulos": {
        "Titulos_Inscripcion": [
            {
                "title": "Periodo",
                "field": "periodo",
                "tipo": "",
                "formato": "(dato)=> `${dato.valores.periodo}`",
                "default": "",
                "type": ""
            },
            {
                "title": "Titulo",
                "field": "titulo",
                "tipo": "",
                "formato": "(dato)=> `${dato.valores.titulo}`",
                "default": "",
                "type": ""
            },
            {
                "title": "Activo",
                "field": "activo",
                "tipo": "",
                "formato": "(dato)=> `${dato.valores.estatus ? 'SI' : 'NO'}`",
                "default": "",
                "type": ""
            }
        ],
        "Titulos_Arancel": [
            {
                "title": "Periodo",
                "field": "periodo",
                "tipo": "",
                "formato": "(dato)=> `${typeof  dato.valores.periodo==='object' ? dato.valores.periodo.periodo : dato.valores.periodo}`",
                "default": "",
                "type": ""
            },
            {
                "title": "Mes de Inicio",
                "field": "mes_inicio",
                "tipo": "",
                "formato": "(dato)=> `${typeof  dato.valores.mes_inicio==='object' ? dato.valores.mes_inicio.titulo : dato.valores.mes_inicio}`",
                "default": "",
                "type": ""
            },
            {
                "title": "Mes que finaliza",
                "field": "mes_final",
                "tipo": "",
                "formato": "(dato)=> `${typeof  dato.valores.mes_final==='object' ? dato.valores.mes_final.titulo : dato.valores.mes_final}`",
                "default": "",
                "type": ""
            },
            {
                "title": "Monto",
                "field": "monto",
                "tipo": "",
                "formato": "(dato)=> `${dato.valores.monto}`",
                "default": "",
                "type": "number"
            }
        ],
        "Titulos_Cuenta": [
            {
                "title": "Numero de Cuenta",
                "field": "numero",
                "tipo": "",
                "formato": "(dato)=> `${dato.valores.numero}`",
                "default": "",
                "type": ""
            },
            {
                "title": "Banco",
                "field": "banco",
                "tipo": "",
                "formato": "(dato)=> `${typeof  dato.valores.banco==='object' ? dato.valores.banco.titulo : dato.valores.banco}`",
                "default": "",
                "type": ""
            },
            {
                "title": "Tipo",
                "field": "tipo",
                "tipo": "",
                "formato": "(dato)=> `${dato.valores.tipo}`",
                "default": "",
                "type": ""
            },
            {
                "title": "Titular",
                "field": "titular",
                "tipo": "",
                "formato": "(dato)=> `${dato.valores.titular}`",
                "default": "",
                "type": ""
            }
        ],
        "Titulos_Estudiante": [
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
            },
            {
                "title": "Grado",
                "field": "grado",
                "tipo": "",
                "formato": "(dato)=> `${ typeof dato.valores.grado === 'object' ? dato.valores.grado.titulo : dato.valores.grado ? dato.valores.grado : ''}`",
                "default": "",
                "type": ""
            },
            {
                "title": "Sección",
                "field": "seccion",
                "tipo": "",
                "formato": "(dato)=> `${ typeof dato.valores.seccion === 'object' ? dato.valores.seccion.titulo : dato.valores.seccion ? dato.valores.seccion : ''}`",
                "default": "",
                "type": ""
            },
            {
                "title": "Representante",
                "field": "representante",
                "tipo": "",
                "formato": "(dato)=> `${ typeof dato.valores.representante === 'object' && dato.valores.representante!==null ? `${dato.valores.representante.cedula} ${dato.valores.representante.nombres} ${dato.valores.representante.apellidos}`: dato.valores.representante ? dato.valores.representante : ''}`",
                "default": "",
                "type": ""
            }
        ],
        "Titulos_Representante": [
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
            },
            {
                "title": "Representado(s)",
                "field": "representados",
                "tipo": "representados",
                "formato": "(dato)=> dato.valores.representados",
                "default": "",
                "type": ""
            }
        ],
        "Titulos_Asignatura": [
            {
                "title": "Grado",
                "field": "grado",
                "tipo": "",
                "formato": "(dato)=> `${ typeof dato.valores.grado === 'object' ? dato.valores.grado.titulo : dato.valores.grado ? dato.valores.grado : ''}`",
                "default": "",
                "type": ""
            },
            {
                "title": "Asignatura",
                "field": "asignatura",
                "tipo": "",
                "formato": "(dato)=> `${dato.valores.asignatura}`",
                "default": "",
                "type": ""
            }
        ],
        "Titulos_Docente": [
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
        "Titulos_EstudianteR": [
            {
                "title": "Cedula",
                "field": "cedula",
                "tipo": "",
                "formato": "",
                "default": "",
                "type": ""
            },
            {
                "title": "Nombres",
                "field": "nombres",
                "tipo": "",
                "formato": "",
                "default": "",
                "type": ""
            },
            {
                "title": "Apellidos",
                "field": "apellidos",
                "tipo": "",
                "formato": "",
                "default": "",
                "type": ""
            },
            {
                "title": "Grado",
                "field": "grado",
                "tipo": "",
                "formato": "(dato)=> `${ typeof dato.grado === 'object' ? dato.grado.titulo : dato.grado ? dato.grado : ''}`",
                "default": "",
                "type": ""
            },
            {
                "title": "Sección",
                "field": "seccion",
                "tipo": "",
                "formato": "(dato)=> `${ typeof dato.seccion === 'object' ? dato.seccion.titulo : dato.seccion ? dato.seccion : ''}`",
                "default": "",
                "type": ""
            }
        ],
        "Titulos_Mensualidad": [
            {
                "title": "Id",
                "field": "id",
                "tipo": "",
                "formato": "",
                "default": "",
                "type": "",
                "width": 60,
                "flex": 0.2
            },
            {
                "title": "Descripción",
                "field": "descripcion",
                "tipo": "",
                "formato": "",
                "default": "",
                "type": "",
                "width": 470,
                "flex": 1
            },
            {
                "title": "Monto $",
                "field": "montod",
                "tipo": "",
                "formato": "",
                "default": "",
                "type": "number"
            },
            {
                "title": "Monto Bs.",
                "field": "monto",
                "tipo": "",
                "formato": "",
                "default": "",
                "type": "number"
            }
        ],
        "Titulos_Formaspago": [
            {
                "title": "Id",
                "field": "id",
                "tipo": "",
                "formato": "",
                "default": "",
                "type": "",
                "width": 60,
                "flex": 0.2
            },
            {
                "title": "Forma de Pago",
                "field": "formapago",
                "tipo": "",
                "formato": "",
                "default": "",
                "type": "",
                "width": 200,
                "flex": 1
            },
            {
                "title": "Banco Origen",
                "field": "bancoorigen",
                "tipo": "",
                "formato": "",
                "default": "",
                "type": "",
                "width": 200,
                "flex": 1
            },
            {
                "title": "Banco Destino",
                "field": "bancodestino",
                "tipo": "",
                "formato": "",
                "default": "",
                "type": "",
                "width": 200,
                "flex": 1
            },
            {
                "title": "Referencia",
                "field": "referencia",
                "tipo": "",
                "formato": "",
                "default": "",
                "type": "",
                "width": 200,
                "flex": 1
            },
            {
                "title": "Cedula del Titular",
                "field": "cedula",
                "tipo": "",
                "formato": "",
                "default": "",
                "type": "",
                "width": 200,
                "flex": 1
            },
            {
                "title": "Monto",
                "field": "monto",
                "tipo": "",
                "formato": "",
                "default": "",
                "type": "number",
                "width": 100,
                "flex": 0.5
            }
        ],
        "Titulos_Recibo": [
            {
                "title": "No. Recibo",
                "field": "recibo",
                "tipo": "",
                "formato": "(dato)=> `${dato.valores.recibo}`",
                "default": "",
                "type": ""
            },
            {
                "title": "Fecha",
                "field": "fecha",
                "tipo": "fecha",
                "formato": "(dato)=> `${dato.createdAt}`",
                "default": "",
                "type": ""
            },
            {
                "title": "Cancelado",
                "field": "cancelado",
                "tipo": "",
                "formato": "(dato)=> `${dato.valores.totales.total.toFixed(3)}`",
                "default": "",
                "type": ""
            },
            {
                "title": "Abono",
                "field": "abono",
                "tipo": "",
                "formato": "(dato)=> `${dato.valores.totales.abono.toFixed(3)}`",
                "default": "",
                "type": ""
            },
            {
                "title": "Valor Dolar",
                "field": "dolar",
                "tipo": "",
                "formato": "(dato)=> `${dato.valores.totales.totald.toFixed(2)}`",
                "default": "",
                "type": ""
            }
        ],
        "Titulos_Solvencias": [
            {
                "title": "Cedula",
                "field": "cedula",
                "tipo": "",
                "formato": "",
                "default": "",
                "type": ""
            },
            {
                "title": "Nombres",
                "field": "nombres",
                "tipo": "",
                "formato": "",
                "default": "",
                "type": ""
            },
            {
                "title": "Apellidos",
                "field": "apellidos",
                "tipo": "",
                "formato": "",
                "default": "",
                "type": ""
            },
            {
                "title": "Periodo",
                "field": "periodo",
                "tipo": "",
                "formato": "",
                "default": "",
                "type": ""
            },
            {
                "title": "Inscripción",
                "field": "mensaje-inscripcion",
                "tipo": "",
                "formato": "",
                "default": "",
                "type": ""
            },
            {
                "title": "Septiembre",
                "field": "mensaje-septiembre",
                "tipo": "",
                "formato": "",
                "default": "",
                "type": ""
            },
            {
                "title": "Octubre",
                "field": "mensaje-octubre",
                "tipo": "",
                "formato": "",
                "default": "",
                "type": ""
            },
            {
                "title": "Noviembre",
                "field": "mensaje-noviembre",
                "tipo": "",
                "formato": "",
                "default": "",
                "type": ""
            },
            {
                "title": "Diciembre",
                "field": "mensaje-diciembre",
                "tipo": "",
                "formato": "",
                "default": "",
                "type": ""
            },
            {
                "title": "Enero",
                "field": "mensaje-enero",
                "tipo": "",
                "formato": "",
                "default": "",
                "type": ""
            },
            {
                "title": "Febrero",
                "field": "mensaje-febrero",
                "tipo": "",
                "formato": "",
                "default": "",
                "type": ""
            },
            {
                "title": "Marzo",
                "field": "mensaje-marzo",
                "tipo": "",
                "formato": "",
                "default": "",
                "type": ""
            },
            {
                "title": "Abril",
                "field": "mensaje-abril",
                "tipo": "",
                "formato": "",
                "default": "",
                "type": ""
            },
            {
                "title": "Mayo",
                "field": "mensaje-mayo",
                "tipo": "",
                "formato": "",
                "default": "",
                "type": ""
            },
            {
                "title": "Junio",
                "field": "mensaje-junio",
                "tipo": "",
                "formato": "",
                "default": "",
                "type": ""
            },
            {
                "title": "Julio",
                "field": "mensaje-julio",
                "tipo": "",
                "formato": "",
                "default": "",
                "type": ""
            },
            {
                "title": "Agosto",
                "field": "mensaje-agosto",
                "tipo": "",
                "formato": "",
                "default": "",
                "type": ""
            }
        ],
        "Titulos_Portada": [
            {
                "title": "Imagen",
                "field": "img",
                "tipo": "imagen",
                "formato": "(dato)=> `${dato.valores.img}`"
            },
            {
                "title": "Titulo",
                "field": "titulo",
                "tipo": "",
                "formato": "(dato)=> `${dato.valores.title}`",
                "default": "",
                "type": ""
            }
        ]
    },
    "Funciones": {},
    "Subtotales": {}
}