import config from '../src/config'
const { BASE_URL } = config
export const MANY_DATA_LIST = (document) => `${BASE_URL}/api/v1/generic/${document}/`
export const LIST_ASIENTOS = (document) => `${BASE_URL}/api/v1/contabilidad/${document}/`
// CONDICION DE PAGO
export const LIST_CONDICION_PAGO = (document) => `${BASE_URL}/api/v1/compras/list/condicion-pago/${document}/`
export const EDIT_CONDICION_PAGO = (document) => `${BASE_URL}/api/v1/compras/edit/condicion-pago/${document}/codigo/`
export const SAVE_CONDICION_PAGO = (document) => `${BASE_URL}/api/v1/compras/save/condicion-pago/${document}/`
export const DELETE_CONDICION_PAGO = (document) => `${BASE_URL}/api/v1/compras/delete/condicion-pago/${document}/codigo/`
// TIPO DE SERVICIO
export const LIST_TIPO_SERVICIO = (document) => `${BASE_URL}/api/v1/compras/list/tipo-servicio/${document}/`
export const SAVE_TIPO_SERVICIO = (document) => `${BASE_URL}/api/v1/compras/save/tipo-servicio/${document}/`
export const EDIT_TIPO_SERVICIO = (document) => `${BASE_URL}/api/v1/compras/edit/tipo-servicio/${document}/codigo/`
export const DELETE_TIPO_SERVICIO = (document) => `${BASE_URL}/api/v1/compras/delete/tipo-servicio/${document}/codigo/`
// ASIENTOS
export const EDIT_ASIENTOS = (document) => `${BASE_URL}/api/v1/contabilidad/edit/asientos/${document}/codigo/`
export const DELETE_ASIENTOS = (document) => `${BASE_URL}/api/v1/contabilidad/delete/asientos/${document}/codigo/`

// ORIGENES
export const LIST_ORIGENES = (document) => `${BASE_URL}/api/v1/contabilidad/list/origen/${document}/`
export const SAVE_ORIGENES = (document) => `${BASE_URL}/api/v1/contabilidad/save/origen/${document}/`
export const DELETE_ORIGENES = (document) => `${BASE_URL}/api/v1/contabilidad/delete/origen/${document}/`
export const EDIT_ORIGENES = (document) => `${BASE_URL}/api/v1/contabilidad/edit/origen/${document}/codigo/`

// CUENTAS
export const LIST_CUENTAS = (document) => `${BASE_URL}/api/v1/generics/list/cuentas/${document}/`

// CENTRO COSTO
export const LIST_CENTRO_COSTO = (document) => `${BASE_URL}/api/v1/contabilidad/list/centro-costos/${document}/`
export const SAVE_CENTRO_COSTO = (document) => `${BASE_URL}/api/v1/contabilidad/save/centro-costos/${document}/`
export const DELETE_CENTRO_COSTO = (document) => `${BASE_URL}/api/v1/contabilidad/delete/centro-costos/${document}/`
export const UPDATE_CENTRO_COSTO = (document) => `${BASE_URL}/api/v1/contabilidad/edit/centro-costos/${document}/codigo/`


// MEDIO DE PAGO
export const LIST_MEDIO_PAGO = (document)=>`${BASE_URL}/api/v1/contabilidad/list/medio-pago/${document}/`
export const SAVE_MEDIO_PAGO = (document)=>`${BASE_URL}/api/v1/contabilidad/save/medio-pago/${document}/`
export const EDIT_MEDIO_PAGO = (document)=>`${BASE_URL}/api/v1/contabilidad/edit/medio-pago/${document}/codigo/`
export const DELETE_MEDIO_PAGO = (document)=>`${BASE_URL}/api/v1/contabilidad/delete/medio-pago/${document}/codigo/`

//TIPO DE AUXILIAR
export const LIST_TIPO_AUXILIAR = (document)=>`${BASE_URL}/api/v1/contabilidad/list/tipo-auxiliar/${document}/`
export const SAVE_TIPO_AUXILIAR = (document)=>`${BASE_URL}/api/v1/contabilidad/save/tipo-auxiliar/${document}/`