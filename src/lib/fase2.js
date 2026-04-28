export const CAMPOS_EVALUACION_CLIENTE = [
  ['habilitacion_direccion_jurisdiccion', 'Habilitación dirección de jurisdicción'],
  ['habilitacion_sanitaria_rugepresa', 'Habilitación sanitaria (RU.GE.PRE.SA)'],
  ['constancia_cuit', 'Constancia de CUIT'],
  ['constancia_ingresos_brutos', 'Constancia de ingresos brutos'],
  ['certificado_gln', 'Certificado GLN'],
  ['habilitacion_municipal', 'Habilitación municipal'],
  ['puntualidad_pagos', 'Puntualidad en los pagos'],
  ['frecuencia_compras', 'Frecuencia de compras'],
  ['volumen_compras', 'Volumen de compras'],
  ['condicion_financiera_general', 'Condición financiera general'],
  ['experiencia_personal_compra', 'Experiencia del personal de compra']
];

export const CAMPOS_EVALUACION_PROVEEDOR = [
  ['habilitacion_jurisdiccion_provincial', 'Habilitación jurisdicción provincial'],
  ['ultima_resolucion_djf', 'Última resolución DJF'],
  ['disposicion_habilitacion_anmat', 'Disposición habilitación ANMAT'],
  ['cert_buenas_practicas_transito', 'Certificado buenas prácticas de tránsito'],
  ['resolucion_cambio_direccion_tecnica', 'Resolución cambio dirección técnica'],
  ['registro_productos_anmat', 'Registro productos ANMAT'],
  ['habilitacion_municipal', 'Habilitación municipal'],
  ['constancia_afip', 'Constancia AFIP'],
  ['documentacion_completa', 'Documentación completa']
];

export const TIPOS_PROVEEDOR = [
  'LABORATORIO',
  'DROGUERIA',
  'IMPORTADOR',
  'DISTRIBUIDOR',
  'PROVEEDOR_SERVICIOS',
  'PROVEEDOR_INSUMOS'
];

export const getEvaluacionResult = (evaluacion, fields) => (
  fields.every(([key]) => evaluacion[key] === 'APTO') ? 'APTO' : 'NO_APTO'
);
