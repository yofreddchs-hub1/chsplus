{
    "Titulo": "CHS+",
    "Logo": "/api/imagen/logo.png",
    "Estilos": {
        "Logo": {
            "height": 60,
            "width": 60
        },
        "Input_label": {
            "color": "#fff",
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
            "color": "#ffffff"
        },
        "Barra_menu": {
            "backgroundColor": "rgba(0, 0, 0)",
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
            "backgroundColor": "rgb(5, 30, 52)"
        },
        "Tabla_titulo": {
            "color": "#ffffff"
        },
        "Tabla_cabezera": {
            "backgroundImage": "linear-gradient(0deg, #080303 0, #524D4D 90% )"
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
        "Tabla_row_colorlocal": {
            "backgroundColor": "#0985CC"
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
            "value": "Dashboard",
            "primary": "Dashboard",
            "icon": "grid_view",
            "libre": "false"
        },
        {
            "value": "Reportes",
            "primary": "Reportes",
            "icon": "content_paste_search",
            "libre": "false"
        },
        {
            "value": "Ingresos",
            "primary": "Ingresos",
            "icon": "create_new_folder",
            "childen": [
                {
                    "value": "Ingreso Material",
                    "primary": "Ingresar Materia Prima",
                    "icon": "post_add"
                },
                {
                    "value": "Ingresar Empaque",
                    "primary": "Ingresar Empaque Terminado",
                    "icon": "assignment_add"
                },
                {
                    "value": "Ingresar Producto",
                    "primary": "Ingresar Producto Terminado",
                    "icon": "assignment_add"
                }
            ]
        },
        {
            "value": "Egresos",
            "primary": "Egresos",
            "icon": "folder_delete",
            "childen": [
                {
                    "value": "Ventas",
                    "primary": "Ventas",
                    "icon": "table_view"
                },
                {
                    "value": "cobrar",
                    "primary": "Por Cobrar",
                    "icon": "local_mall"
                },
                {
                    "value": "Egreso Material",
                    "primary": "Egreso Materia Prima",
                    "icon": "remove"
                },
                {
                    "value": "Egreso Empaque",
                    "primary": "Egreso Empaque Terminado",
                    "icon": "remove"
                },
                {
                    "value": "Egreso Producto Terminado",
                    "primary": "Egreso Producto Terminado",
                    "icon": "remove"
                }
            ]
        },
        {
            "value": "Planificar",
            "primary": "Planificar",
            "icon": "event_note"
        },
        {
            "value": "Produccion",
            "primary": "Produccion",
            "icon": "fact_check"
        },
        {
            "value": "Registros",
            "primary": "Registos",
            "icon": "dataset"
        },
        {
            "value": "Nuevos",
            "primary": "Nuevos",
            "icon": "note_add",
            "childen": [
                {
                    "value": "Formulas",
                    "primary": "Formulas",
                    "icon": "shopping_cart_checkout"
                }
            ]
        }
    ],
    "Menu_iconos": [],
    "Formularios": {
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
        "Form_Cliente": {
            "columna": 2,
            "value": [
                {
                    "key": "rif",
                    "name": "rif",
                    "label": "Cedula / Rif",
                    "tipo": "input",
                    "mensaje_error": "Indique documento de identidad",
                    "required": true
                },
                {
                    "key": "nombre",
                    "name": "nombre",
                    "label": "Nombre",
                    "mensaje_error": "Indique nombre del proveedor ",
                    "required": true
                },
                {
                    "key": "telefono",
                    "name": "telefono",
                    "label": "Telefono de contacto"
                },
                {
                    "key": "email",
                    "name": "email",
                    "label": "Correo electronico"
                },
                {
                    "key": "direcion",
                    "name": "direccion",
                    "label": "Dirección",
                    "multiline": true,
                    "numberOfLines": 4
                },
                {
                    "key": "contacto",
                    "name": "contacto",
                    "label": "Contactos",
                    "multiline": true,
                    "numberOfLines": 2
                },
                {
                    "nombre": "codigo",
                    "tipo": "auto-codigo",
                    "label": "Código",
                    "placeholder": "Código",
                    "title": "Código",
                    "mensaje_error": "C",
                    "disabled": true,
                    "numberOfLines": "",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "key": "codigo",
                    "name": "codigo",
                    "multiline": false
                },
                {
                    "nombre": "localidad",
                    "label": "Localidad",
                    "placeholder": "Localidad",
                    "title": "Localidad",
                    "mensaje_error": "",
                    "disabled": false,
                    "numberOfLines": "",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "key": "localidad",
                    "name": "localidad"
                }
            ]
        },
        "Form_Proveedor": {
            "columna": 2,
            "value": [
                {
                    "key": "rif",
                    "name": "rif",
                    "label": "Cedula / Rif",
                    "tipo": "input",
                    "mensaje_error": "Indique documento de identidad",
                    "required": true
                },
                {
                    "key": "nombre",
                    "name": "nombre",
                    "label": "Nombre",
                    "mensaje_error": "Indique nombre del proveedor ",
                    "required": true
                },
                {
                    "key": "telefono",
                    "name": "telefono",
                    "label": "Telefono de contacto"
                },
                {
                    "key": "email",
                    "name": "email",
                    "label": "Correo electronico"
                },
                {
                    "key": "direcion",
                    "name": "direccion",
                    "label": "Dirección",
                    "multiline": true,
                    "numberOfLines": 4
                },
                {
                    "key": "descripcion",
                    "name": "descripcion",
                    "label": "Descripción",
                    "multiline": true,
                    "numberOfLines": 4
                },
                {
                    "nombre": "codigo",
                    "tipo": "auto-codigo",
                    "label": "Código",
                    "placeholder": "Código",
                    "title": "Código",
                    "mensaje_error": "P",
                    "disabled": true,
                    "numberOfLines": "",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "key": "codigo",
                    "name": "codigo",
                    "multiline": false
                }
            ]
        },
        "Form_Inventariomp": {
            "columna": 2,
            "value": [
                {
                    "nombre": "codigo",
                    "tipo": "input",
                    "label": "Código",
                    "placeholder": "Código",
                    "title": "Código de materia prima",
                    "required": true,
                    "mensaje_error": "Debe colocar código de materia prima",
                    "disabled": false,
                    "numberOfLines": "",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "key": "codigo",
                    "name": "codigo",
                    "multiline": false
                },
                {
                    "nombre": "descripcion",
                    "tipo": "multiline",
                    "label": "Descripción",
                    "placeholder": "Descripción",
                    "title": "Descripción o nombre de materia prima",
                    "required": true,
                    "mensaje_error": "",
                    "disabled": false,
                    "numberOfLines": "2",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "key": "descripcion",
                    "name": "descripcion",
                    "multiline": true
                },
                {
                    "nombre": "unidad",
                    "tipo": "lista_multiuso",
                    "label": "Unidad",
                    "placeholder": "Unidad",
                    "title": "Unidad",
                    "required": false,
                    "mensaje_error": "",
                    "disabled": false,
                    "numberOfLines": "",
                    "lista": "lista_unidades",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "key": "unidad",
                    "name": "unidad",
                    "multiline": false
                },
                {
                    "nombre": "proveedor",
                    "tipo": "lista_multiuso",
                    "label": "Proveedor(es)",
                    "placeholder": "Proveedor(es)",
                    "title": "Proveedor(es)",
                    "mensaje_error": "",
                    "disabled": false,
                    "numberOfLines": "",
                    "lista": "sistemachs_Proveedor",
                    "getOptionLabel": [
                        "rif",
                        "nombre"
                    ],
                    "agregar": true,
                    "key": "proveedor",
                    "name": "proveedor",
                    "form": "Form_Proveedor",
                    "multiple": true
                },
                {
                    "nombre": "minimo",
                    "tipo": "number",
                    "label": "Inventario Mínimo",
                    "placeholder": "Inventario Mínimo",
                    "title": "Inventario Mínimo deseado en almacén",
                    "mensaje_error": "",
                    "disabled": false,
                    "numberOfLines": "",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "key": "minimo",
                    "name": "minimo",
                    "multiline": false
                },
                {
                    "nombre": "actual",
                    "tipo": "number",
                    "label": "Inventario Actual",
                    "placeholder": "Inventario Actual",
                    "title": "Inventario Actual en almacén",
                    "mensaje_error": "",
                    "disabled": true,
                    "numberOfLines": "",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "key": "actual",
                    "name": "actual",
                    "multiline": false
                }
            ]
        },
        "Form_Proveedor_Art": {
            "columna": 1,
            "value": [
                {
                    "nombre": "select_a",
                    "tipo": "lista_multiuso",
                    "label": "Selecciona Proveedor",
                    "placeholder": "",
                    "title": "",
                    "mensaje_error": "",
                    "disabled": false,
                    "numberOfLines": "",
                    "lista": "sistemachs_Proveedor",
                    "getOptionLabel": [
                        "rif",
                        "nombre"
                    ],
                    "key": "select_a",
                    "name": "select_a"
                }
            ]
        },
        "Form_Empaque": {
            "columna": 2,
            "value": [
                {
                    "nombre": "codigo",
                    "label": "Código",
                    "placeholder": "Código",
                    "title": "Código",
                    "required": true,
                    "mensaje_error": "Debe colocar código a empaque",
                    "disabled": false,
                    "numberOfLines": "",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "key": "codigo",
                    "name": "codigo"
                },
                {
                    "nombre": "descripcion",
                    "tipo": "multiline",
                    "label": "Descripción",
                    "placeholder": "Descripción",
                    "title": "Descripción",
                    "required": true,
                    "mensaje_error": "Debe colocar descripción del empaque",
                    "disabled": false,
                    "numberOfLines": "2",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "key": "descripcion",
                    "name": "descripcion",
                    "multiline": true
                },
                {
                    "nombre": "capacidad",
                    "label": "Capacidad",
                    "placeholder": "Capacidad",
                    "title": "Capacidad el empaque",
                    "mensaje_error": "",
                    "disabled": false,
                    "numberOfLines": "",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "key": "capacidad",
                    "name": "capacidad"
                },
                {
                    "nombre": "minimo",
                    "tipo": "number",
                    "label": "Inventario Mínimo",
                    "placeholder": "Inventario Mínimo",
                    "title": "Inventario Mínimo",
                    "mensaje_error": "",
                    "disabled": false,
                    "numberOfLines": "",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "agregar": false,
                    "key": "minimo",
                    "name": "minimo"
                },
                {
                    "nombre": "actual",
                    "tipo": "number",
                    "label": "Inventario Actual",
                    "placeholder": "Inventario Actual",
                    "title": "Inventario Actual",
                    "mensaje_error": "",
                    "disabled": false,
                    "numberOfLines": "",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "key": "actual",
                    "name": "actual",
                    "multiline": false
                },
                {
                    "nombre": "categoria",
                    "tipo": "lista_multiuso",
                    "label": "Categoría",
                    "placeholder": "Categoría",
                    "title": "Categoría",
                    "mensaje_error": "",
                    "disabled": false,
                    "numberOfLines": "",
                    "lista": "lista_categoria_empaque",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "key": "categoria",
                    "name": "categoria",
                    "multiline": false
                }
            ]
        },
        "Form_Formula": {
            "columna": 2,
            "value": [
                {
                    "nombre": "mezcla",
                    "tipo": "input",
                    "label": "Mezcla",
                    "placeholder": "Mezcla",
                    "title": "Nombre de mezcla para producto final",
                    "required": true,
                    "mensaje_error": "Debe colocar nombre de la mezcla",
                    "disabled": false,
                    "numberOfLines": "",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "key": "mezcla",
                    "name": "mezcla",
                    "multiline": false
                },
                {
                    "key": "formulas",
                    "name": "formulas",
                    "label": "Formula",
                    "tipo": "Tabla",
                    "titulos": "Titulos_formula_mp_d",
                    "Form": "Form_formula_mp",
                    "nopaginar": true,
                    "style": {
                        "height": 300
                    }
                },
                {
                    "nombre": "actual",
                    "tipo": "number",
                    "label": "Cantidad Existente",
                    "placeholder": "Cantidad Existente",
                    "title": "Cantidad Existente",
                    "mensaje_error": "",
                    "disabled": true,
                    "numberOfLines": "",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "key": "actual",
                    "name": "actual",
                    "multiline": false
                }
            ]
        },
        "Form_formula_mp": {
            "columna": 1,
            "value": [
                {
                    "nombre": "select_a",
                    "tipo": "lista_multiuso",
                    "label": "Selecciona Materia Prima",
                    "placeholder": "",
                    "title": "",
                    "mensaje_error": "",
                    "disabled": false,
                    "numberOfLines": "",
                    "lista": "sistemachs_Inventariomp",
                    "getOptionLabel": [
                        "codigo",
                        "descripcion"
                    ],
                    "key": "select_a",
                    "name": "select_a"
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
        },
        "Form_Inventariopt": {
            "columna": 2,
            "value": [
                {
                    "nombre": "codigo",
                    "label": "Código",
                    "placeholder": "Código",
                    "title": "Código",
                    "required": true,
                    "mensaje_error": "Debe indicar código",
                    "disabled": false,
                    "numberOfLines": "",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "key": "codigo",
                    "name": "codigo"
                },
                {
                    "nombre": "unidad",
                    "tipo": "lista_multiuso",
                    "label": "Unidad",
                    "placeholder": "Unidad",
                    "title": "Unidad",
                    "mensaje_error": "",
                    "disabled": false,
                    "numberOfLines": "",
                    "lista": "lista_unidades",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "key": "unidad",
                    "name": "unidad",
                    "multiline": false
                },
                {
                    "nombre": "descripcion",
                    "tipo": "multiline",
                    "label": "Descripción",
                    "placeholder": "Descripción",
                    "title": "Descripción",
                    "mensaje_error": "",
                    "disabled": false,
                    "numberOfLines": "2",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "key": "descripcion",
                    "name": "descripcion",
                    "multiline": true
                },
                {
                    "nombre": "minimo",
                    "tipo": "number",
                    "label": "Inventario Mínimo",
                    "placeholder": "Inventario Mínimo",
                    "title": "Inventario Mínimo",
                    "mensaje_error": "",
                    "disabled": false,
                    "numberOfLines": "",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "key": "minimo",
                    "name": "minimo",
                    "multiline": false
                },
                {
                    "nombre": "actual",
                    "tipo": "number",
                    "label": "Inventario Actual",
                    "placeholder": "Inventario Actual",
                    "title": "Inventario Actual",
                    "mensaje_error": "",
                    "disabled": false,
                    "numberOfLines": "",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "key": "actual",
                    "name": "actual",
                    "multiline": false
                },
                {
                    "nombre": "formula",
                    "tipo": "lista_multiuso",
                    "label": "Formula",
                    "placeholder": "Formula",
                    "title": "Formula",
                    "mensaje_error": "",
                    "disabled": false,
                    "numberOfLines": "",
                    "lista": "sistemachs_Formula",
                    "getOptionLabel": [
                        "mezcla"
                    ],
                    "key": "formula",
                    "name": "formula",
                    "multiline": false
                },
                {
                    "nombre": "cantidadf",
                    "tipo": "number",
                    "label": "Cantidad Formula",
                    "placeholder": "Cantidad Formula",
                    "title": "Cantidad Formula",
                    "mensaje_error": "",
                    "disabled": false,
                    "numberOfLines": "",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "key": "cantidadf",
                    "name": "cantidadf",
                    "multiline": false
                },
                {
                    "nombre": "madicional",
                    "tipo": "lista_multiuso",
                    "label": "Materia Prima Adicional",
                    "placeholder": "Materia Prima Adicional",
                    "title": "Materia Prima Adicional",
                    "mensaje_error": "",
                    "disabled": false,
                    "numberOfLines": "",
                    "lista": "sistemachs_Inventariomp",
                    "getOptionLabel": [
                        "codigo",
                        "descripcion"
                    ],
                    "key": "madicional",
                    "name": "madicional",
                    "multiline": false
                },
                {
                    "nombre": "cantidadm",
                    "tipo": "number",
                    "label": "Cantidad Materia Prima",
                    "placeholder": "Cantidad Materia Prima",
                    "title": "Cantidad Materia Prima",
                    "mensaje_error": "",
                    "disabled": false,
                    "numberOfLines": "",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "key": "cantidadm",
                    "name": "cantidadm",
                    "multiline": false
                },
                {
                    "nombre": "empaque",
                    "tipo": "lista_multiuso",
                    "label": "Empaque",
                    "placeholder": "Empaque",
                    "title": "Empaque",
                    "mensaje_error": "",
                    "disabled": false,
                    "numberOfLines": "",
                    "lista": "sistemachs_Empaque",
                    "getOptionLabel": [
                        "codigo",
                        "descripcion"
                    ],
                    "key": "empaque",
                    "name": "empaque",
                    "multiline": false
                },
                {
                    "nombre": "imagen",
                    "tipo": "Imagen",
                    "label": "Imagen",
                    "placeholder": "Imagen",
                    "title": "Imagen",
                    "mensaje_error": "",
                    "disabled": false,
                    "numberOfLines": "",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "key": "imagen",
                    "name": "imagen",
                    "multiline": false
                },
                {
                    "nombre": "categoria",
                    "tipo": "lista_multiuso",
                    "label": "Categoría",
                    "placeholder": "Categoría",
                    "title": "Categoría",
                    "mensaje_error": "",
                    "disabled": false,
                    "numberOfLines": "",
                    "lista": "lista_categoria_producto_terminado",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "key": "categoria",
                    "name": "categoria",
                    "multiline": false
                },
                {
                    "nombre": "precio",
                    "tipo": "number",
                    "label": "Precio de Venta",
                    "placeholder": "Precio de Venta",
                    "title": "Precio de Venta",
                    "mensaje_error": "",
                    "disabled": false,
                    "numberOfLines": "",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "key": "precio",
                    "name": "precio",
                    "multiline": false
                }
            ]
        },
        "Form_planificar_formula": {
            "columna": 2,
            "value": [
                {
                    "nombre": "formula",
                    "tipo": "lista_multiuso",
                    "label": "Formula",
                    "placeholder": "Formula",
                    "title": "Formula",
                    "mensaje_error": "",
                    "disabled": false,
                    "numberOfLines": "",
                    "lista": "sistemachs_Formula",
                    "getOptionLabel": [
                        "mezcla"
                    ],
                    "key": "formula",
                    "name": "formula",
                    "multiline": false
                },
                {
                    "nombre": "cantidad",
                    "tipo": "number",
                    "label": "Cant. Trompo",
                    "placeholder": "Cant. Trompo",
                    "title": "Cant. Trompo",
                    "mensaje_error": "",
                    "disabled": false,
                    "numberOfLines": "",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "agregar": false,
                    "key": "cantidad",
                    "name": "cantidad"
                }
            ]
        },
        "Form_fecha": {
            "columna": 1,
            "value": [
                {
                    "nombre": "fecha",
                    "tipo": "Fecha",
                    "label": "",
                    "placeholder": "",
                    "title": "",
                    "mensaje_error": "",
                    "disabled": false,
                    "numberOfLines": "",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "agregar": false,
                    "key": "fecha",
                    "name": "fecha"
                }
            ]
        },
        "Form_planificacion_dia": {
            "columna": 1,
            "value": [
                {
                    "nombre": "fecha",
                    "tipo": "Fecha",
                    "label": "Dia",
                    "placeholder": "Dia",
                    "title": "Dia",
                    "mensaje_error": "",
                    "disabled": false,
                    "numberOfLines": "",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "key": "fecha",
                    "name": "fecha",
                    "multiline": false
                }
            ]
        },
        "Form_Ingresos": {
            "columna": 1,
            "value": [
                {
                    "nombre": "fecha",
                    "tipo": "Fecha",
                    "label": "Dia",
                    "placeholder": "Dia",
                    "title": "Dia",
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
                    "key": "movimietno",
                    "name": "movimiento",
                    "label": "Materias Primas",
                    "tipo": "Tabla",
                    "titulos": "Titulos_formula_mp",
                    "Form": "Form_formula_mp",
                    "nopaginar": true,
                    "style": {
                        "height": 300
                    }
                }
            ]
        },
        "Form_ingreso_materia_prima": {
            "columna": 1,
            "value": [
                {
                    "key": "mp",
                    "name": "mp",
                    "label": "Materias Primas",
                    "tipo": "Tabla",
                    "titulos": "Titulos_formula_mp",
                    "Form": "Form_formula_mp",
                    "nopaginar": true,
                    "style": {
                        "height": 300
                    }
                }
            ]
        },
        "Form_ingreso_empaque": {
            "columna": 1,
            "value": [
                {
                    "key": "empaque",
                    "name": "empaque",
                    "label": "Empaques",
                    "tipo": "Tabla",
                    "titulos": "Titulos_formula_em",
                    "Form": "Form_formula_em",
                    "nopaginar": true,
                    "style": {
                        "height": 300
                    }
                }
            ]
        },
        "Form_formula_em": {
            "columna": 1,
            "value": [
                {
                    "nombre": "select_a",
                    "tipo": "lista_multiuso",
                    "label": "Selecciona empaque",
                    "placeholder": "",
                    "title": "",
                    "mensaje_error": "",
                    "disabled": false,
                    "numberOfLines": "",
                    "lista": "sistemachs_Empaque",
                    "getOptionLabel": [
                        "codigo",
                        "descripcion"
                    ],
                    "key": "select_a",
                    "name": "select_a"
                }
            ]
        },
        "Form_formula_pt": {
            "columna": 1,
            "value": [
                {
                    "nombre": "select_a",
                    "tipo": "lista_multiuso",
                    "label": "Selecciona producto terminado",
                    "placeholder": "",
                    "title": "",
                    "mensaje_error": "",
                    "disabled": false,
                    "numberOfLines": "",
                    "lista": "sistemachs_Inventariopt",
                    "getOptionLabel": [
                        "codigo",
                        "descripcion"
                    ],
                    "key": "select_a",
                    "name": "select_a"
                }
            ]
        },
        "Form_egreso_pt": {
            "columna": 1,
            "value": [
                {
                    "key": "producto",
                    "name": "producto",
                    "label": "Producto Terminado",
                    "tipo": "Tabla",
                    "titulos": "Titulos_formula_em",
                    "Form": "Form_formula_ept",
                    "nopaginar": true,
                    "style": {
                        "height": 300
                    }
                }
            ]
        },
        "Form_venta": {
            "columna": 2,
            "value": [
                {
                    "nombre": "recibo",
                    "label": "Referencia",
                    "placeholder": "Referencia",
                    "title": "Recibo",
                    "mensaje_error": "",
                    "disabled": false,
                    "numberOfLines": "",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "key": "recibo",
                    "name": "recibo"
                },
                {
                    "nombre": "cliente",
                    "tipo": "lista_multiuso",
                    "label": "Cliente",
                    "placeholder": "Cliente",
                    "title": "Cliente",
                    "required": true,
                    "mensaje_error": "Debe seleccionar cliente",
                    "disabled": false,
                    "numberOfLines": "",
                    "lista": "sistemachs_Cliente",
                    "getOptionLabel": [
                        "rif",
                        "nombre"
                    ],
                    "agregar": true,
                    "key": "cliente",
                    "name": "cliente",
                    "form": "Form_Cliente"
                },
                {
                    "key": "producto",
                    "name": "producto",
                    "label": "Productos",
                    "tipo": "Tabla",
                    "titulos": "Titulos_venta",
                    "Form": "Form_formula_ept",
                    "nopaginar": false,
                    "Subtotal": "Subtotal_venta",
                    "style": {
                        "height": 250
                    }
                }
            ]
        },
        "Form_venta_mostrar": {
            "columna": 1,
            "value": [
                {
                    "key": "producto",
                    "name": "producto",
                    "label": "Productos",
                    "tipo": "Tabla",
                    "titulos": "Titulos_venta_mostrar",
                    "nopaginar": false,
                    "Subtotal": "Subtotal_venta",
                    "style": {
                        "height": 250
                    }
                }
            ]
        },
        "Form_FormasPago": {
            "columna": 1,
            "value": [
                {
                    "key": "formapago",
                    "name": "formapago",
                    "label": "Forma de Pago",
                    "tipo": "Tabla",
                    "titulos": "Titulos_Formaspago",
                    "Form": "Form_Select_formapago",
                    "nopaginar": true,
                    "style": {
                        "height": 350
                    },
                    "editables": "(params) => {let editable=true;if ((params.row.titulo==='Debito' && ['bancod'].indexOf(params.field)!==-1) || ((params.row.titulo==='Efectivo Bolívar' || params.row.titulo==='Efectivo Dolar') && ['fecha','bancoo','bancod'].indexOf(params.field)!==-1)){ editable=false;} return editable; }",
                    "Subtotal": "Subtotal_formapago"
                }
            ]
        },
        "Form_Select_formapago": {
            "columna": 1,
            "value": [
                {
                    "key": "select_a",
                    "name": "select_a",
                    "label": "Selecciona forma de pago",
                    "tipo": "lista_multiuso",
                    "lista": "lista_Forma_Pago",
                    "multiple": false,
                    "getOptionLabel": [
                        "titulo"
                    ]
                }
            ]
        },
        "Form_formula_ept": {
            "columna": 1,
            "value": [
                {
                    "key": "select_a",
                    "name": "select_a",
                    "label": "Selecciona producto termiando",
                    "tipo": "lista_multiuso",
                    "lista": "sistemachs_Inventariopt",
                    "multiple": false,
                    "getOptionLabel": [
                        "codigo",
                        "descripcion"
                    ]
                }
            ]
        },
        "Form_formula_mov": {
            "columna": 2,
            "value": [
                {
                    "nombre": "formula",
                    "tipo": "lista_multiuso",
                    "label": "Formula",
                    "placeholder": "Formula",
                    "title": "Seleccionar Formula",
                    "mensaje_error": "",
                    "disabled": false,
                    "numberOfLines": "",
                    "lista": "sistemachs_Formula",
                    "getOptionLabel": [
                        "mezcla"
                    ],
                    "key": "formula",
                    "name": "formula"
                },
                {
                    "nombre": "actual",
                    "tipo": "number",
                    "label": "Cantidad Actual",
                    "placeholder": "Cantidad Actual",
                    "title": "Cantidad Actual",
                    "mensaje_error": "",
                    "disabled": true,
                    "numberOfLines": "",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "key": "actual",
                    "name": "actual",
                    "multiline": false
                }
            ]
        },
        "Form_Listas_n": {
            "columna": 1,
            "value": [
                {
                    "key": "nombre",
                    "name": "nombre",
                    "label": "Nombre de la lista",
                    "placeholder": "Nombre de la lista",
                    "required": true,
                    "mensaje_error": "Debe indicar el nombre de la lista a crear"
                }
            ]
        },
        "Form_reporte_venta": {
            "columna": 2,
            "value": [
                {
                    "nombre": "moneda",
                    "tipo": "lista_multiuso",
                    "label": "Moneda",
                    "placeholder": "Moneda",
                    "title": "Moneda",
                    "mensaje_error": "",
                    "disabled": false,
                    "numberOfLines": "",
                    "lista": "lista_moneda",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "key": "moneda",
                    "name": "moneda",
                    "multiline": false
                },
                {
                    "nombre": "tasa",
                    "tipo": "number",
                    "label": "Tasa Cambio",
                    "placeholder": "Tasa Cambio",
                    "title": "Tasa Cambio",
                    "required": true,
                    "mensaje_error": "",
                    "disabled": false,
                    "numberOfLines": "",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "key": "tasa",
                    "name": "tasa",
                    "multiline": false
                },
                {
                    "nombre": "destino",
                    "tipo": "input",
                    "label": "Destino",
                    "placeholder": "Destino",
                    "title": "Destino",
                    "mensaje_error": "",
                    "disabled": false,
                    "numberOfLines": "",
                    "getOptionLabel": [
                        "titulo"
                    ],
                    "key": "destino",
                    "name": "destino",
                    "multiline": false
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
        ],
        "lista_unidades": [
            {
                "_id": 0,
                "titulo": "Gramo",
                "value": "g",
                "permisos": "",
                "id": 1,
                "otro": ""
            },
            {
                "_id": 1,
                "titulo": "Kilogramo",
                "value": "Kg",
                "permisos": "",
                "id": 1,
                "otro": ""
            },
            {
                "_id": 2,
                "titulo": "Metro",
                "value": "m",
                "permisos": ""
            },
            {
                "_id": 3,
                "titulo": "Saco",
                "value": "saco",
                "permisos": ""
            },
            {
                "_id": 4,
                "titulo": "Centímetro Cúbico",
                "value": "cc",
                "permisos": "",
                "id": 4,
                "otro": ""
            },
            {
                "_id": 5,
                "titulo": "Litro",
                "value": "L",
                "permisos": "",
                "id": 5,
                "otro": ""
            },
            {
                "_id": 6,
                "titulo": "Pieza",
                "value": "pza",
                "permisos": ""
            },
            {
                "_id": 7,
                "titulo": "Otro",
                "value": "otro",
                "permisos": ""
            }
        ],
        "lista_categoria_empaque": [
            {
                "_id": 0,
                "titulo": "ADITIVOS E IMPERMEABILIZANTES para Concretos y Morteros",
                "value": "ADITIVOS E IMPERMEABILIZANTES para Concretos y Morteros",
                "permisos": ""
            },
            {
                "_id": 1,
                "titulo": "ACABADOS SUPERFICIALES para Paredes y Techos",
                "value": "ACABADOS SUPERFICIALES para Paredes y Techos",
                "permisos": ""
            },
            {
                "_id": 2,
                "titulo": "MORTEROS Y CONCRETOS para la Construcción",
                "value": "MORTEROS Y CONCRETOS para la Construcción",
                "permisos": ""
            },
            {
                "_id": 3,
                "titulo": "OTROS PRODUCTOS",
                "value": "OTROS PRODUCTOS",
                "permisos": ""
            }
        ],
        "lista_categoria_producto_terminado": [
            {
                "_id": 0,
                "titulo": "ADITIVOS E IMPERMEABILIZANTES para Concretos y Morteros",
                "value": "ADITIVOS E IMPERMEABILIZANTES para Concretos y Morteros",
                "permisos": ""
            },
            {
                "_id": 1,
                "titulo": "ACABADOS SUPERFICIALES para Paredes y Techos",
                "value": "ACABADOS SUPERFICIALES para Paredes y Techos",
                "permisos": ""
            },
            {
                "_id": 2,
                "titulo": "MORTEROS Y CONCRETOS para la Construcción",
                "value": "MORTEROS Y CONCRETOS para la Construcción",
                "permisos": ""
            },
            {
                "_id": 3,
                "titulo": "OTROS PRODUCTOS",
                "value": "OTROS PRODUCTOS:",
                "permisos": ""
            },
            {
                "_id": 4,
                "titulo": "REVESTIMIENTO Y DECORACION",
                "value": "REVESTIMIENTO Y DECORACION",
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
                "permisos": ""
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
        ],
        "lista_moneda": [
            {
                "_id": 0,
                "titulo": "Bs",
                "value": "bs",
                "permisos": ""
            },
            {
                "_id": 1,
                "titulo": "USD",
                "value": "usd",
                "permisos": ""
            }
        ]
    },
    "Titulos": {
        "Titulos_Proveedor": [
            {
                "title": "Cedula / Rif",
                "field": "rif",
                "formato": "(dato)=> `${dato.valores.rif}`"
            },
            {
                "title": "Nombre",
                "field": "nombre",
                "formato": "(dato)=> `${dato.valores.nombre}`"
            },
            {
                "title": "Telefono",
                "field": "telefono",
                "formato": "(dato)=> `${dato.valores.telefono}`"
            },
            {
                "title": "Correo electronico",
                "field": "email",
                "formato": "(dato)=> `${dato.valores.email}`"
            }
        ],
        "Titulos_Cliente": [
            {
                "title": "Cedula / Rif",
                "field": "rif",
                "formato": "(dato)=> `${dato.valores.rif}`"
            },
            {
                "title": "Nombre",
                "field": "nombre",
                "formato": "(dato)=> `${dato.valores.nombre}`"
            },
            {
                "title": "Telefono",
                "field": "telefono",
                "formato": "(dato)=> `${dato.valores.telefono}`"
            },
            {
                "title": "Correo electronico",
                "field": "email",
                "formato": "(dato)=> `${dato.valores.email}`"
            }
        ],
        "Titulos_Inventariomp": [
            {
                "title": "Descripción",
                "field": "descripcion",
                "tipo": "",
                "formato": "(dato)=> `${dato.valores ? dato.valores.descripcion : dato.descripcion}`",
                "default": "",
                "type": ""
            },
            {
                "title": "Código",
                "field": "codigo",
                "tipo": "",
                "formato": "(dato)=> `${dato.valores ? dato.valores.codigo : dato.codigo}`",
                "default": "",
                "type": ""
            },
            {
                "title": "Cantidad Actual",
                "field": "actual",
                "tipo": "",
                "formato": "(dato)=> `${Number(dato.valores ? dato.valores.actual : dato.actual).toFixed(3)}`",
                "default": "",
                "type": ""
            }
        ],
        "Titulos_Empaque": [
            {
                "title": "Código",
                "field": "codigo",
                "tipo": "",
                "formato": "(dato)=> `${dato.valores.codigo}`",
                "default": "",
                "type": ""
            },
            {
                "title": "Descripción",
                "field": "descripcion",
                "tipo": "",
                "formato": "(dato)=> `${dato.valores.descripcion}`",
                "default": "",
                "type": ""
            },
            {
                "title": "Capacidad",
                "field": "capacidad",
                "tipo": "",
                "formato": "(dato)=> `${dato.valores.capacidad}`",
                "default": "",
                "type": ""
            },
            {
                "title": "Cantidad Actual",
                "field": "actual",
                "tipo": "",
                "formato": "(dato)=> `${Number(dato.valores.actual && dato.valores.actual!=='' ? dato.valores.actual : 0).toFixed(3)}`",
                "default": "",
                "type": ""
            }
        ],
        "Titulos_Formula": [
            {
                "title": "Formula",
                "field": "mezcla",
                "tipo": "",
                "formato": "(dato)=> `${dato.valores.mezcla}`",
                "default": "",
                "type": ""
            },
            {
                "title": "Cantidad Actual",
                "field": "actual",
                "tipo": "",
                "formato": "(dato)=> `${Number(dato.valores.actual && dato.valores.actual!=='' ? dato.valores.actual : 0).toFixed(3)}`",
                "default": "",
                "type": ""
            }
        ],
        "Titulos_Inventariopt": [
            {
                "title": "Descripción",
                "field": "descripcion",
                "tipo": "",
                "formato": "(dato)=> `${dato.valores.descripcion}`",
                "default": "",
                "type": ""
            },
            {
                "title": "Código",
                "field": "codigo",
                "tipo": "",
                "formato": "(dato)=> `${dato.valores.codigo}`",
                "default": "",
                "type": ""
            },
            {
                "title": "Inventario Actual",
                "field": "actual",
                "tipo": "",
                "formato": "(dato)=> `${dato.valores.actual}`",
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
        ],
        "Titulos_formula_mp": [
            {
                "title": "Código",
                "field": "codigo",
                "tipo": "",
                "formato": "",
                "default": "",
                "type": ""
            },
            {
                "title": "Descripción",
                "field": "descripcion",
                "tipo": "",
                "formato": "",
                "default": "",
                "type": ""
            },
            {
                "title": "Cantidad Saco",
                "field": "saco",
                "tipo": "",
                "formato": "(dato)=> Number(dato.saco && dato.saco!=='' ? dato.saco : 0)",
                "default": "",
                "type": "number",
                "editable": true
            },
            {
                "title": "Cant. por Saco",
                "field": "cantsaco",
                "tipo": "",
                "formato": "(dato)=> Number(dato.cantsaco && dato.cantsaco!=='' ? dato.cantsaco : 0)",
                "default": "",
                "type": "number",
                "editable": true
            },
            {
                "title": "Unidad",
                "field": "unidad",
                "tipo": "",
                "formato": "(dato)=> `${dato.unidad && dato.unidad.value ? dato.unidad.value : ''}`",
                "default": "",
                "type": ""
            },
            {
                "title": "Cantidad",
                "field": "cantidad",
                "tipo": "",
                "formato": "(dato)=> {\nlet cantidad = Number(`${dato.cantidad ? dato.cantidad : 0}`); \nif(Number(dato.saco)!==0 && Number(dato.cantsaco)!==0){\n   cantidad= Number(dato.saco) * Number(dato.cantsaco);\n}\nreturn cantidad\n}",
                "default": "",
                "type": "number",
                "editable": true
            }
        ],
        "Titulos_ingresos_egresos": [
            {
                "title": "Descripción",
                "field": "descripcion",
                "tipo": "",
                "formato": "(dato)=> `${dato.valores ? dato.valores.descripcion : dato.descripcion}`",
                "default": "",
                "type": ""
            },
            {
                "title": "Código",
                "field": "codigo",
                "tipo": "",
                "formato": "(dato)=> `${dato.valores ? dato.valores.codigo : dato.codigo}`",
                "default": "",
                "type": ""
            },
            {
                "title": "Inventario Actual",
                "field": "actual",
                "tipo": "",
                "formato": "(dato)=> `${Number(dato.valores && dato.valores.actual  ? dato.valores.actual : dato.actual ? dato.actual : 0).toFixed(2)}`\n",
                "default": "",
                "type": ""
            }
        ],
        "Titulos_formula_em": [
            {
                "title": "Código",
                "field": "codigo",
                "tipo": "",
                "formato": "",
                "default": "",
                "type": ""
            },
            {
                "title": "Descripción",
                "field": "descripcion",
                "tipo": "",
                "formato": "",
                "default": "",
                "type": ""
            },
            {
                "title": "Cantidad",
                "field": "cantidad",
                "tipo": "",
                "formato": "(dato)=> Number(`${dato.cantidad}`)",
                "default": "",
                "type": "number",
                "editable": true
            }
        ],
        "Titulos_formula_pt": [
            {
                "title": "Código",
                "field": "codigo",
                "tipo": "",
                "formato": "",
                "default": "",
                "type": ""
            },
            {
                "title": "Descripción",
                "field": "descripcion",
                "tipo": "",
                "formato": "",
                "default": "",
                "type": ""
            },
            {
                "title": "Cantidad",
                "field": "cantidad",
                "tipo": "",
                "formato": "(dato)=> Number(`${dato.cantidad}`)",
                "default": "",
                "type": "number",
                "editable": true
            }
        ],
        "Titulos_formula_mp_d": [
            {
                "title": "Código",
                "field": "codigo",
                "tipo": "",
                "formato": "",
                "default": "",
                "type": ""
            },
            {
                "title": "Descripción",
                "field": "descripcion",
                "tipo": "",
                "formato": "",
                "default": "",
                "type": ""
            },
            {
                "title": "Unidad",
                "field": "unidad",
                "tipo": "",
                "formato": "(dato)=> `${dato.unidad && dato.unidad.value ? dato.unidad.value : ''}`",
                "default": "",
                "type": ""
            },
            {
                "title": "Cantidad",
                "field": "cantidad",
                "tipo": "",
                "formato": "(dato)=> Number(`${dato.cantidad ? dato.cantidad : 0}`)",
                "default": "",
                "type": "number"
            }
        ],
        "Titulos_venta": [
            {
                "title": "Código",
                "field": "codigo",
                "tipo": "",
                "formato": "",
                "default": "",
                "type": ""
            },
            {
                "title": "Descripción",
                "field": "descripcion",
                "tipo": "",
                "formato": "",
                "default": "",
                "type": "",
                "flex": 3
            },
            {
                "title": "Precio Venta",
                "field": "precio",
                "tipo": "",
                "formato": "",
                "default": "",
                "type": "number",
                "editable": true
            },
            {
                "title": "Cantidad",
                "field": "cantidad",
                "tipo": "",
                "formato": "(dato)=> Number(`${dato.cantidad}`)",
                "default": "1",
                "type": "number",
                "editable": true
            },
            {
                "title": "Total",
                "field": "total",
                "tipo": "",
                "formato": "(dato)=> {\nlet precio = dato.precio ? Number(dato.precio) : 0;\nlet cantidad = dato.cantidad ? Number(dato.cantidad) : 1;\nlet total = precio * cantidad;\nreturn Number(`${total}`)\n}",
                "default": "",
                "type": "number"
            }
        ],
        "Titulos_Formaspago": [
            {
                "title": "Forma de Pago",
                "field": "titulo",
                "tipo": "",
                "formato": "",
                "default": "",
                "type": ""
            },
            {
                "title": "Fecha",
                "field": "fecha",
                "tipo": "",
                "formato": "",
                "default": "",
                "type": "date",
                "editable": true
            },
            {
                "title": "Banco Origen",
                "field": "bancoo",
                "tipo": "",
                "formato": "",
                "default": "",
                "type": "",
                "editable": true
            },
            {
                "title": "Banco Destino",
                "field": "bancod",
                "tipo": "",
                "formato": "",
                "default": "",
                "type": "",
                "editable": true
            },
            {
                "title": "Referencia",
                "field": "referencia",
                "tipo": "",
                "formato": "",
                "default": "",
                "type": "",
                "editable": true
            },
            {
                "title": "Monto",
                "field": "monto",
                "tipo": "",
                "formato": "",
                "default": "",
                "type": "number",
                "editable": true
            }
        ],
        "Titulos_porcobrar": [
            {
                "title": "Referencia",
                "field": "recibo",
                "tipo": "",
                "formato": "(dato)=> `${dato.valores ? dato.valores.recibo : dato.recibo}`",
                "default": "",
                "type": ""
            },
            {
                "title": "Fecha",
                "field": "fecha",
                "tipo": "",
                "formato": "(dato)=> `${dato.valores ? dato.valores.fecha : dato.fecha}`",
                "default": "",
                "type": ""
            },
            {
                "title": "Cliente",
                "field": "cliente",
                "tipo": "",
                "formato": "(dato)=> {\nreturn `${dato.valores && dato.valores.orden_venta && dato.valores && dato.valores.orden_venta.cliente ? dato.valores.orden_venta.cliente.rif + ' ' +dato.valores.orden_venta.cliente.nombre : ''}`\n}",
                "default": "",
                "type": ""
            },
            {
                "title": "Deuda",
                "field": "deuda",
                "tipo": "",
                "formato": "(dato)=> {\nreturn `$ ${Number(dato.valores && dato.valores.formapago && dato.valores.formapago['formapago-subtotal'] ? dato.valores.formapago['formapago-subtotal'].restan : 0)}`\n}",
                "default": "",
                "type": "number"
            }
        ],
        "Titulos_Ingresos": [
            {
                "title": "Código",
                "field": "codigo",
                "tipo": "",
                "formato": "(dato)=> `${dato.valores ? dato.valores.codigo : dato.codigo}`",
                "default": "",
                "type": ""
            },
            {
                "title": "Fecha",
                "field": "fecha",
                "tipo": "",
                "formato": "(dato)=> `${dato.valores ? dato.valores.fecha: dato.fecha}`",
                "default": "",
                "type": ""
            }
        ],
        "Titulos_Ventas": [
            {
                "title": "Referencia",
                "field": "recibo",
                "tipo": "",
                "formato": "(dato)=> `${dato.valores ? dato.valores.recibo : dato.recibo}`",
                "default": "",
                "type": ""
            },
            {
                "title": "Fecha",
                "field": "fecha",
                "tipo": "",
                "formato": "(dato)=> `${dato.valores ? dato.valores.fecha : dato.fecha}`",
                "default": "",
                "type": ""
            },
            {
                "title": "Cliente",
                "field": "cliente",
                "tipo": "",
                "formato": "(dato)=> {\nreturn `${dato.valores && dato.valores.orden_venta && dato.valores && dato.valores.orden_venta.cliente ? dato.valores.orden_venta.cliente.rif + ' ' +dato.valores.orden_venta.cliente.nombre : ''}`\n}",
                "default": "",
                "type": ""
            },
            {
                "title": "Facturado",
                "field": "cancelar",
                "tipo": "numero",
                "formato": "(dato)=> {\nreturn `$ ${Number(dato.valores && dato.valores.formapago && dato.valores.formapago['formapago-subtotal'] ? dato.valores.formapago['formapago-subtotal'].cancelar : 0).toFixed(2)}`\n}",
                "default": "",
                "type": "number"
            },
            {
                "title": "Cancelado",
                "field": "cancelado",
                "tipo": "",
                "formato": "(dato)=> {\nreturn `$ ${Number(dato.valores && dato.valores.formapago && dato.valores.formapago['formapago-subtotal'] ? dato.valores.formapago['formapago-subtotal'].total + dato.valores.formapago['formapago-subtotal'].totalb / dato.valores.formapago['formapago-subtotal'].Tasa : 0).toFixed(2)}`\n}",
                "default": "",
                "type": "number"
            },
            {
                "title": "Deuda",
                "field": "deuda",
                "tipo": "",
                "formato": "(dato)=> {\nreturn `$ ${Number(dato.valores && dato.valores.formapago && dato.valores.formapago['formapago-subtotal'] ? dato.valores.formapago['formapago-subtotal'].restan : 0).toFixed(2)}`\n}",
                "default": "",
                "type": "number"
            }
        ],
        "Titulos_venta_mostrar": [
            {
                "title": "Cantidad",
                "field": "cantidad",
                "tipo": "",
                "formato": "",
                "default": "",
                "type": "number",
                "flex": 1.5
            },
            {
                "title": "Concepto o Descripción",
                "field": "descripcion",
                "tipo": "",
                "formato": "",
                "default": "",
                "type": "",
                "flex": 6
            },
            {
                "title": "Precio Unitario ",
                "field": "precio",
                "tipo": "",
                "formato": "",
                "default": "",
                "type": "number",
                "flex": 2.5
            },
            {
                "title": "Total",
                "field": "total",
                "tipo": "",
                "formato": "",
                "default": "",
                "type": "number",
                "flex": 2
            }
        ]
    },
    "Funciones": {},
    "Subtotales": {
        "Subtotal_orden": [
            [
                {
                    "title": "Subtotal"
                },
                {
                    "title": " "
                },
                {
                    "field": "subtotal",
                    "default": 0,
                    "formato": "(dato, resultado)=> Number((Number(dato.costo) * Number(dato.cantidad)).toFixed(2)) + Number(resultado.subtotal)"
                }
            ],
            [
                {
                    "title": "Iva"
                },
                {
                    "default": 6,
                    "tipo": "input",
                    "title": "%",
                    "field": "iva"
                },
                {
                    "default": 0,
                    "field": "subiva",
                    "formato": "(dato,resultado)=> Number((Number(resultado.subtotal) * Number(resultado.iva)/100).toFixed(2))"
                }
            ],
            [
                {
                    "title": "Total"
                },
                {
                    "title": " "
                },
                {
                    "default": 0,
                    "field": "total",
                    "formato": "(dato,resultado)=> Number(resultado.subtotal) + Number(resultado.subiva)"
                }
            ]
        ],
        "Subtotal_venta": [
            [
                {
                    "title": "Tasa de Cambio"
                },
                {
                    "field": "Tasa",
                    "default": 0,
                    "tipo": "input",
                    "width": 100,
                    "defaultf": "(dato, resultado)=> tasa"
                },
                {
                    "title": "Subtotal"
                },
                {
                    "title": "$"
                },
                {
                    "field": "subtotal",
                    "default": 0,
                    "formato": "(dato, resultado)=> Number((Number(dato.precio) * Number(dato.cantidad)).toFixed(2)) + Number(resultado.subtotal)"
                },
                {
                    "title": "Bs."
                },
                {
                    "field": "subtotalb",
                    "default": 0,
                    "formato": "(dato, resultado)=> Number((Number(dato.precio) * Number(resultado.Tasa) * Number(dato.cantidad)).toFixed(2)) + Number(resultado.subtotalb)"
                }
            ],
            [
                {
                    "title": "Descuento"
                },
                {
                    "default": 0,
                    "tipo": "input",
                    "title": "%",
                    "field": "desc"
                },
                {
                    "title": "Iva"
                },
                {
                    "default": 0,
                    "tipo": "input",
                    "title": "%",
                    "field": "iva"
                },
                {
                    "title": "$"
                },
                {
                    "default": 0,
                    "field": "subiva",
                    "formato": "(dato,resultado)=> Number(((Number(resultado.subtotal) * Number(resultado.iva)/100) - (Number(resultado.subtotal) * Number(resultado.desc)/100)).toFixed(2))"
                },
                {
                    "title": "Bs."
                },
                {
                    "field": "subivab",
                    "default": 0,
                    "formato": "(dato,resultado)=> Number(((Number(resultado.subtotalb) * Number(resultado.iva )/100) - (Number(resultado.subtotalb) * Number(resultado.desc )/100)).toFixed(2))"
                }
            ],
            [
                {
                    "title": "Total"
                },
                {
                    "title": "$"
                },
                {
                    "default": 0,
                    "field": "total",
                    "formato": "(dato,resultado)=> Number((Number(resultado.subtotal) + Number(resultado.subiva)).toFixed(2))"
                },
                {
                    "title": "Bs."
                },
                {
                    "field": "totalb",
                    "default": 0,
                    "formato": "(dato,resultado)=> Number((Number(resultado.subtotalb) + Number(resultado.subivab)).toFixed(2))"
                }
            ]
        ],
        "Subtotal_formapago": [
            [
                {
                    "title": "Tasa de Cambio"
                },
                {
                    "field": "Tasa",
                    "default": 0,
                    "defaultf": "(dato, resultado)=> externos && externos.totales ? externos.totales.Tasa : tasa"
                },
                {
                    "title": "Total a Cancelar"
                },
                {
                    "title": "$"
                },
                {
                    "field": "cancelar",
                    "default": 0,
                    "defaultf": "(dato, resultado)=> externos && externos.totales ? externos.totales.total : 0"
                },
                {
                    "title": "Bs."
                },
                {
                    "field": "cancelarb",
                    "default": 0,
                    "defaultf": "(dato, resultado)=> externos && externos.totales ? externos.totales.totalb : 0"
                }
            ],
            [
                {
                    "title": "Total"
                },
                {
                    "title": "$"
                },
                {
                    "field": "total",
                    "default": 0,
                    "formato": "(dato, resultado)=> {let monto = Number(dato.monto ? dato.monto : 0); if (dato.titulo!=='Efectivo Dolar'){monto=0;}return monto + Number(resultado.total)}"
                },
                {
                    "title": "Bs."
                },
                {
                    "field": "totalb",
                    "default": 0,
                    "formato": "(dato, resultado)=> {let monto = Number(dato.monto); if (dato.titulo==='Efectivo Dolar'){monto=0;}return monto + Number(resultado.totalb)}"
                }
            ],
            [
                {
                    "title": "Restan"
                },
                {
                    "title": "$"
                },
                {
                    "defaultf": "(resultado)=> {let cancel= Number(resultado.total ? resultado.total : 0); if(cancel===0) {return resultado.cancelar;} return 0}",
                    "field": "restan",
                    "default": 0,
                    "formato": "(dato,resultado)=> {let total = Number(resultado.cancelar); let totalb = Number(resultado.cancelarb); let  cancel= Number(resultado.total ? resultado.total : 0); let cancelb= Number(resultado.totalb ? resultado.totalb : 0);let resul = Number((total-cancel).toFixed(2)); let resulb = Number((totalb-cancelb).toFixed(2)); resul-=Number((cancelb/tasa).toFixed(2)); resulb-= Number((cancel*tasa).toFixed(2)); return resul}"
                },
                {
                    "title": "Bs."
                },
                {
                    "defaultf": "(resultado)=> {let cancel= Number(resultado.totalb ? resultado.totalb : 0); if(cancel===0) {return resultado.cancelarb;} return 0}",
                    "field": "restanb",
                    "default": 0,
                    "formato": "(dato,resultado)=> {let total = Number(resultado.cancelar); let totalb = Number(resultado.cancelarb); let  cancel= Number(resultado.total ? resultado.total : 0); let cancelb= Number(resultado.totalb ? resultado.totalb : 0);let resul = Number((total-cancel).toFixed(2)); let resulb = Number((totalb-cancelb).toFixed(2)); resul-=Number((cancelb/tasa).toFixed(2)); resulb-= Number((cancel*tasa).toFixed(2)); return resulb}"
                }
            ]
        ],
        "Subtotal_mensualidad": [
            [
                {
                    "title": "Abono"
                },
                {
                    "title": "$",
                    "field": "Abonod",
                    "default": 0,
                    "formato": "(dato, resultado)=>  Number(resultado.abonod)"
                },
                {
                    "title": "Bs.",
                    "field": "Abono",
                    "default": 0,
                    "formato": "(dato, resultado)=>  Number(resultado.abono)"
                },
                {
                    "title": "Total"
                },
                {
                    "title": "$",
                    "field": "totald",
                    "default": 0,
                    "formato": "(dato, resultado)=>  dato.montod + Number(resultado.totald)"
                },
                {
                    "title": "Bs.",
                    "field": "total",
                    "default": 0,
                    "formato": "(dato, resultado)=> dato.monto + Number(resultado.total)"
                }
            ]
        ]
    }
}