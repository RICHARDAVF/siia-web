
import ListCondicionPago from "./mantenimientos/condicionPago/ListCondicionpago"
import ListTipoServicio from "./mantenimientos/TipoServicio/ListTipoServicio"

import ListComprobantes from "./movimientos/comprobantes/ListComprobantes"
import RegistroComprobantes from "./movimientos/comprobantes/RegistroComprobantes"
import RecepcionDocumentoList from "./movimientos/RecepcionDocumentos/RecepcionDocumentList"

import ReporteCuentasPagar from "./reporte/CuentasPagar"
export const ComprasView = [
    {
        "view": ListComprobantes,
        "route": "/list/comprobantes",
    },
    {
        "view": RegistroComprobantes,
        "route": "/registro/comprobantes",
    }
]

export const RecepcionDocumentosView = [
    {
        "view": RecepcionDocumentoList,
        "route": "/recepcion/documentos"
    }
]
export const CondicionPagoView = [

    {
        "view": ListCondicionPago,
        "route": '/list/condicion-pago'
    }
]
export const ReportesView = [
    {
        "view": ReporteCuentasPagar,
        "route": "/reporte/cuentas-pagar"
    }
]

export const TipoServicioView = [
    {
        'view': ListTipoServicio,
        'route': '/list/tipo-servicio'
    }
]
