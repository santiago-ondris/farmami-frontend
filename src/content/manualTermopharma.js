export const manualTermopharma = {
  title: 'Manual de usuario',
  subtitle: 'Guia completa de operacion del sistema',
  version: 'Version 1.0 | Mayo 2026',
  sections: [
    {
      heading: '1. Introduccion',
      paragraphs: [
        'El sistema permite registrar, rastrear y auditar todos los movimientos de medicamentos e insumos, garantizando trazabilidad completa desde el ingreso al deposito hasta la entrega al destinatario final.'
      ]
    },
    {
      heading: '1.1 Objetivos del sistema',
      bullets: [
        'Registrar ingresos y egresos de medicamentos con datos de lote, vencimiento y cadena de frio.',
        'Mantener un stock actualizado y detectar desvios o negativos en tiempo real.',
        'Gestionar la documentacion habilitante de clientes y proveedores.',
        'Generar reportes y exportaciones para auditorias y organismos de control.',
        'Proveer una bitacora de auditoria de todos los cambios realizados en el sistema.'
      ]
    },
    {
      heading: '1.2 Roles de usuario',
      paragraphs: [
        'El sistema cuenta con dos roles diferenciados.',
        'Nota: La creacion de usuarios es exclusiva del rol Administrador. No existe registro publico.'
      ]
    },
    {
      heading: '2. Acceso al sistema',
      subsections: [
        {
          heading: '2.1 Inicio de sesion',
          paragraphs: [
            'Para ingresar al sistema accede a la URL provista por el administrador. Vas a ver la pantalla de inicio de sesion con dos campos: Correo electronico y Contrasena.',
            'Hace clic en Iniciar sesion para autenticarte. El sistema validara tus credenciales y te redirigira al panel de control.',
            'Nota: Si ingresas credenciales incorrectas varias veces consecutivas, el sistema bloqueara el acceso por 15 minutos como medida de seguridad.'
          ]
        },
        {
          heading: '2.2 Cierre de sesion',
          paragraphs: [
            'Para cerrar la sesion, hace clic en Cerrar sesion ubicado en la parte inferior del menu lateral. El sistema borrara los tokens de autenticacion y te redirigira a la pantalla de login.'
          ]
        },
        {
          heading: '2.3 Expiracion de sesion',
          paragraphs: [
            'La sesion se renueva automaticamente mientras uses el sistema. Si el navegador permanece cerrado por un periodo prolongado, al volver a abrir la aplicacion se te pedira que vuelvas a iniciar sesion.'
          ]
        }
      ]
    },
    {
      heading: '3. Navegacion',
      paragraphs: [
        'El sistema se organiza en un menu lateral fijo en escritorio o desplegable en moviles. Las secciones disponibles dependen del rol del usuario.'
      ],
      subsections: [
        {
          heading: '3.1 Estructura del menu',
          paragraphs: []
        },
        {
          heading: '3.2 Panel de control (Inicio)',
          paragraphs: [
            'El panel de control es la pagina de inicio y muestra metricas clave del inventario.'
          ],
          bullets: [
            'Stock activo: cantidad de productos con movimientos registrados.',
            'Inventario total: suma de unidades disponibles en todo el deposito.',
            'Egresos pendientes: remitos no confirmados como entregados.',
            'Stock critico: productos con stock negativo o en cero.'
          ],
          trailingParagraphs: [
            'Ademas, el panel muestra alertas de vencimiento para lotes que expiran en los proximos 60 dias y accesos rapidos para crear nuevos registros.'
          ]
        }
      ]
    },
    {
      heading: '4. Gestion de stock',
      subsections: [
        {
          heading: '4.1 Listado de productos (Stock)',
          paragraphs: [
            'La seccion Stock muestra el catalogo completo de productos con su nivel de inventario consolidado. Se accede desde el menu lateral a Stock.',
            'Busqueda y filtros: Escribe en el campo de busqueda para filtrar por nombre de producto o laboratorio. El filtro se aplica automaticamente.',
            'Exportacion: Hace clic en Exportar vista o Exportar todo. Se abrira un modal con tres opciones: Solo productos con stock (stock > 0), Solo productos sin stock (stock = 0) y Todos los productos. El archivo se descarga en formato Excel (.xlsx).'
          ]
        },
        {
          heading: '4.2 Detalle de producto',
          paragraphs: [
            'Desde el listado de stock, hace clic en Ver historial para acceder al detalle de un producto.'
          ],
          bullets: [
            'Stock consolidado actual en un numero grande y destacado.',
            'Linea de tiempo de todos los movimientos (ingresos y egresos) ordenados por fecha.',
            'Indicadores IN (verde) y EG (rojo) para identificar el tipo de movimiento.',
            'Boton Ver remito en cada movimiento para acceder al registro original.'
          ]
        }
      ]
    },
    {
      heading: '5. Ingresos de mercaderia',
      paragraphs: [
        'Los ingresos representan las entradas al deposito: recepciones de proveedores, devoluciones o transferencias. Se accede desde el menu a Ingresos.'
      ],
      subsections: [
        {
          heading: '5.1 Listado de ingresos',
          paragraphs: [
            'Busqueda y filtros disponibles: texto libre por nombre del producto, lote, numero de remito o proveedor; cadena de frio: Todos / Si / No; rango de fechas: Desde / Hasta.'
          ]
        },
        {
          heading: '5.2 Registrar un nuevo ingreso',
          paragraphs: [
            'Hace clic en el boton Nuevo ingreso. Completa el formulario con los campos solicitados. Al guardar, el sistema incrementa el stock del producto y registra el movimiento en el historial. Seras redirigido al listado de ingresos con un mensaje de confirmacion.'
          ]
        },
        {
          heading: '5.3 Editar o eliminar un ingreso',
          paragraphs: [
            'Desde el detalle de un ingreso, el boton del lapiz habilita la edicion en linea de todos los campos. El boton Eliminar solicita confirmacion antes de proceder. La eliminacion es logica: el registro queda marcado pero no se borra de la base de datos.'
          ]
        }
      ]
    },
    {
      heading: '6. Egresos de mercaderia',
      paragraphs: [
        'Los egresos registran las salidas de stock: despachos a clientes, transferencias u otras salidas. Se accede desde el menu a Egresos.'
      ],
      subsections: [
        {
          heading: '6.1 Listado de egresos',
          bullets: [
            'Pendiente: fondo ambar o naranja.',
            'Entregado: fondo verde.',
            'Cancelado: fondo gris, fila con opacidad reducida.'
          ]
        },
        {
          heading: '6.2 Registrar un nuevo egreso',
          paragraphs: [
            'Hace clic en Nuevo egreso y completa el formulario.',
            'Controles de stock en tiempo real: al ingresar el producto y la cantidad, el sistema calcula el stock resultante.',
            'Si el resultado es negativo, aparece un banner rojo de advertencia: "Atencion: Este egreso dejara el stock en negativo".',
            'Si intentas guardar con stock negativo, se abre un modal de confirmacion que muestra el stock proyectado. Puedes continuar de todas formas o cancelar para revisar.',
            'Advertencia de lote no encontrado: si el numero de lote ingresado no coincide con ningun ingreso previo del producto, el sistema muestra una advertencia en ambar. Puedes igualmente guardar el registro.'
          ]
        },
        {
          heading: '6.3 Editar o eliminar un egreso',
          paragraphs: [
            'El proceso es igual al de los ingresos: lapiz para editar y boton Eliminar con confirmacion. La eliminacion reduce el egreso del stock automaticamente.'
          ]
        }
      ]
    },
    {
      heading: '7. Remitos',
      paragraphs: [
        'Los remitos son documentos de entrega que agrupan uno o mas productos despachados a un cliente. Al crear un remito, el sistema genera automaticamente los egresos correspondientes. Se accede desde Comercial a Remitos.'
      ],
      subsections: [
        {
          heading: '7.1 Listado de remitos',
          paragraphs: []
        },
        {
          heading: '7.2 Crear un nuevo remito',
          paragraphs: [
            'Hace clic en Nuevo remito y completa la cabecera del remito: Fecha, Hora, Estado y Cliente.',
            'Items del remito: hace clic en Agregar item para sumar lineas. Cada linea requiere Producto, Cantidad, Lote y Vencimiento.',
            'Al guardar, el sistema crea un egreso por cada item. Si algun item dejara el stock en negativo, se muestra un modal de confirmacion con los productos afectados antes de proceder.',
            'Consejo: usa los remitos en lugar de crear egresos individuales cuando debas despachar varios productos para un mismo cliente en una sola operacion.'
          ]
        }
      ]
    },
    {
      heading: '8. Clientes',
      paragraphs: [
        'La seccion Clientes centraliza la informacion de las empresas o dependencias que reciben mercaderia. Incluye datos de identificacion, documentacion habilitante y evaluaciones.'
      ],
      subsections: [
        {
          heading: '8.1 Listado de clientes',
          paragraphs: []
        },
        {
          heading: '8.2 Crear o editar un cliente',
          bullets: [
            'Identificacion: Establecimiento, Nombre, Direccion y Localidad.',
            'Habilitacion y datos regulatorios: Direccion tecnica, Vigencia de habilitacion, GLN, CUIT y Contacto.'
          ]
        },
        {
          heading: '8.3 Ficha de cliente',
          bullets: [
            'Datos generales: direccion, localidad, GLN, CUIT y contacto.',
            'Historial de evaluaciones: lista de todas las evaluaciones realizadas con su resultado APTO o NO APTO.'
          ]
        },
        {
          heading: '8.4 Evaluaciones de cliente',
          paragraphs: [
            'Desde la ficha del cliente, hace clic en Nueva evaluacion. El formulario tiene 11 criterios que se califican como APTO o NO APTO.'
          ],
          bullets: [
            'Habilitacion direccion de jurisdiccion.',
            'Habilitacion sanitaria (RU.GE.PRE.SA).',
            'Constancia de CUIT.',
            'Constancia de ingresos brutos.',
            'Certificado GLN.',
            'Habilitacion municipal.',
            'Puntualidad en los pagos.',
            'Frecuencia de compras.',
            'Volumen de compras.',
            'Condicion financiera general.',
            'Experiencia del personal de compra.'
          ],
          trailingParagraphs: [
            'El resultado global se calcula automaticamente: APTO solo si todos los criterios son APTO; NO APTO si al menos uno es NO APTO.'
          ]
        },
        {
          heading: '8.5 Documentacion de clientes',
          paragraphs: [
            'Desde Comercial, Clientes y Documentacion, selecciona un cliente y marca los documentos recibidos: Habilitacion DJF, Habilitacion RU.GE.PRE.SA, Constancia de CUIT, Constancia de ingresos brutos, Certificado GLN y Habilitacion municipal.',
            'Un indicador muestra el progreso de documentos presentados. Guarda los cambios con el boton Guardar.'
          ]
        }
      ]
    },
    {
      heading: '9. Proveedores',
      paragraphs: [
        'La seccion Proveedores gestiona la informacion de los laboratorios, droguerias, importadores y distribuidores que abastecen el deposito.'
      ],
      subsections: [
        {
          heading: '9.1 Listado de proveedores',
          paragraphs: []
        },
        {
          heading: '9.2 Crear o editar un proveedor',
          bullets: [
            'Identificacion: Numero, Nombre, Tipo, Producto o servicio, Direccion y CUIT.',
            'Documentacion regulatoria: habilitacion de jurisdiccion provincial, ultima resolucion DJF, certificado de habilitacion ANMAT, disposicion de habilitacion ANMAT, certificado de buenas practicas de transito, resolucion de cambio de direccion tecnica, registro de productos ANMAT, habilitacion municipal, constancia AFIP y documentacion completa.'
          ]
        },
        {
          heading: '9.3 Documentacion de proveedores',
          paragraphs: [
            'Desde Comercial, Proveedores y Documentacion, selecciona el proveedor, marca los documentos recibidos y guarda.'
          ]
        }
      ]
    },
    {
      heading: '10. Ordenes de compra',
      paragraphs: [
        'Las ordenes de compra registran las solicitudes de reposicion de stock a los proveedores. Se accede desde Comercial a Ordenes de compra.'
      ],
      subsections: [
        {
          heading: '10.1 Listado de ordenes',
          paragraphs: []
        },
        {
          heading: '10.2 Crear una orden de compra',
          paragraphs: [
            'Completa el encabezado y los items.'
          ],
          bullets: [
            'Encabezado: Proveedor obligatorio, Condicion de pago obligatoria y Fecha de entrega estimada opcional.',
            'Items: hace clic en Agregar item para sumar lineas. Cada linea requiere Producto, Cantidad pedida y Precio unitario.'
          ],
          trailingParagraphs: [
            'El importe total se calcula automaticamente. Al guardar, el sistema asigna un numero de orden automaticamente.'
          ]
        }
      ]
    },
    {
      heading: '11. Rechazos',
      paragraphs: [
        'La seccion Rechazos registra los productos devueltos o rechazados por problemas de calidad, vencimiento u otras no conformidades. Se accede desde Calidad a Rechazos.'
      ],
      subsections: [
        {
          heading: '11.1 Listado de rechazos',
          paragraphs: []
        },
        {
          heading: '11.2 Registrar un rechazo',
          paragraphs: []
        }
      ]
    },
    {
      heading: '12. Gestion de usuarios (solo Administradores)',
      paragraphs: [
        'La seccion de usuarios permite crear y desactivar cuentas de acceso al sistema. Solo es visible para el rol Administrador desde Administracion a Usuarios.'
      ],
      subsections: [
        {
          heading: '12.1 Listado de usuarios',
          paragraphs: []
        },
        {
          heading: '12.2 Crear un usuario',
          paragraphs: [
            'Hace clic en + Nuevo usuario y completa el modal.',
            'Nota: La contrasena inicial debe ser comunicada al usuario por un canal seguro. No existe funcion de recuperacion de contrasena por email en esta version.'
          ]
        },
        {
          heading: '12.3 Desactivar un usuario',
          paragraphs: [
            'Hace clic en Desactivar junto al usuario. El sistema pedira confirmacion antes de proceder. El usuario no podra ingresar al sistema una vez desactivado. La operacion es logica: el registro se mantiene en la base de datos.'
          ]
        }
      ]
    },
    {
      heading: '13. Exportaciones',
      paragraphs: [
        'El sistema permite exportar datos en formato Excel (.xlsx) desde las secciones de Ingresos, Egresos y Stock. Los archivos se descargan directamente en el navegador.'
      ],
      subsections: [
        {
          heading: '13.1 Tipos de exportacion',
          paragraphs: []
        },
        {
          heading: '13.2 Exportacion de stock con filtro por disponibilidad',
          paragraphs: [
            'Al exportar desde la seccion Stock, se muestra un modal adicional con tres opciones: Solo productos con stock (stock > 0), Solo productos sin stock (stock = 0) y Todos los productos.'
          ]
        },
        {
          heading: '13.3 Nombre del archivo',
          paragraphs: [
            'El archivo descargado tiene el formato: tipo_AAAA-MM-DD.xlsx, por ejemplo ingresos_2026-05-10.xlsx.'
          ]
        }
      ]
    },
    {
      heading: '14. Flujos de trabajo habituales',
      subsections: [
        {
          heading: '14.1 Registrar una recepcion de mercaderia',
          ordered: [
            'Ir a Ingresos y luego a Nuevo ingreso.',
            'Seleccionar el producto con el autocomplete.',
            'Completar lote, vencimiento, proveedor y cantidad.',
            'Tildar Cadena de frio si corresponde.',
            'Guardar. El stock se actualiza inmediatamente.'
          ]
        },
        {
          heading: '14.2 Despachar mercaderia a un cliente',
          ordered: [
            'Ir a Egresos y luego a Nuevo egreso.',
            'Seleccionar el producto y verificar el stock disponible.',
            'Ingresar empresa solicitante, lote, cantidad y estado del remito.',
            'Si el sistema advierte stock negativo, revisar antes de confirmar.',
            'Guardar.'
          ]
        },
        {
          heading: '14.3 Emitir un remito con multiples productos',
          ordered: [
            'Ir a Comercial, Remitos y luego a Nuevo remito.',
            'Seleccionar cliente y establecer fecha y hora.',
            'Agregar un item por cada producto a despachar.',
            'Guardar. El sistema crea los egresos automaticamente.'
          ]
        },
        {
          heading: '14.4 Verificar vencimientos proximos',
          ordered: [
            'Ir al Panel de control (Inicio).',
            'Revisar la seccion "Seguimiento prioritario".',
            'Hacer clic en Ver lotes en los productos alertados.',
            'Priorizar el despacho de lotes proximos a vencer.'
          ]
        },
        {
          heading: '14.5 Incorporar un nuevo proveedor',
          ordered: [
            'Ir a Comercial, Proveedores y luego a Nuevo proveedor.',
            'Completar numero, nombre, tipo y datos fiscales.',
            'Marcar la documentacion recibida.',
            'Guardar.',
            'Ir a Proveedores y luego a Documentacion para actualizar el estado en cualquier momento.'
          ]
        }
      ]
    },
    {
      heading: '15. Preguntas frecuentes y solucion de problemas',
      subsections: [
        {
          heading: 'No encuentro el producto en el autocomplete',
          paragraphs: [
            'Verifica que el producto no haya sido eliminado revisando en Stock. Intenta buscar por laboratorio. Si el producto no existe, solicita a un usuario con permisos que lo de de alta a traves de un ingreso.'
          ]
        },
        {
          heading: 'El sistema me advierte stock negativo al crear un egreso',
          paragraphs: [
            'Revisa si existe algun ingreso sin registrar. Si el egreso es correcto, confirmalo en el modal de advertencia. El sistema lo permite para cubrir ajustes de inventario. Los items en negativo aparecen en el panel como stock critico.'
          ]
        },
        {
          heading: 'El campo Lote muestra advertencia en ambar',
          paragraphs: [
            'Significa que no se encontro ese lote en ingresos previos del producto. Es solo informativo; puedes guardar el registro de todas formas.'
          ]
        },
        {
          heading: 'No puedo iniciar sesion',
          bullets: [
            'Que el correo electronico este escrito correctamente.',
            'Que el BloqMayus este desactivado.',
            'Que la cuenta este activa consultando con el Administrador.',
            'Si realizaste varios intentos fallidos, el sistema bloquea el acceso por 15 minutos.'
          ]
        },
        {
          heading: 'No aparece la seccion Administracion en el menu',
          paragraphs: [
            'La seccion Administracion solo es visible para usuarios con rol Administrador. Si necesitas acceso, solicitalo al Administrador del sistema.'
          ]
        },
        {
          heading: 'El boton Exportar no descarga ningun archivo',
          paragraphs: [
            'Verifica que el navegador no este bloqueando descargas automaticas. Revisa la configuracion de descargas y vuelve a intentarlo. Si el error persiste, consulta con el Administrador.'
          ]
        },
        {
          heading: 'Elimine un registro por error, como lo recupero?',
          paragraphs: [
            'Las eliminaciones en el sistema son logicas: el registro no se borra fisicamente de la base de datos. Contacta al Administrador del sistema para que revierta el estado del registro.'
          ]
        }
      ]
    },
    {
      heading: '16. Referencia rapida',
      paragraphs: []
    }
  ]
};
