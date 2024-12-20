import ListCentroCostos from "./mantenimientos/centroCostos/ListCentroCostos";
import ListOrigenes from "./mantenimientos/origenes/ListOrigen";
import PlanContable from "./mantenimientos/PlanContable";
import ListMedioPago from "./mantenimientos/MedioPago/ListMediopago";
import ListAsientos from "./movimientos/Asientos/ListAsientos";
import RegistroAsientos from "./movimientos/Asientos/RegistroAsientos";
import RegistroRetenciones from "./movimientos/Retenciones/RegistroRetenciones";

import Reporte from "./reportes/LibroDiario";
<<<<<<< HEAD
import TipoAuxiliar from "./mantenimientos/tipoAuxiliar/TipoAuxiliar";
=======
import RegistroVentas from "./reportes/RegistroVentas";
>>>>>>> 415b1883ed90628422f495bf077b1cd8dbb56c8f
export const ContabilidadView = [
    {
        "view": ListAsientos,
        "route": "/list/asientos"
    },
    {
        "view": RegistroAsientos,
        "route": "/registro/asientos"
    }
]
export const PlanContableView = [
    {
        "view": PlanContable,
        "route": "registro/plan/contable"
    }
]
export const RetencionesView = [
    {
        "view": RegistroRetenciones,
        "route": "registro/retenciones"
    }
]

export const OrigenesView = [
    {
        'view': ListOrigenes,
        'route': 'list/origen'
    }
]

export const CentroCostoView = [
    {
        'view': ListCentroCostos,
        'route': '/list/centro-costos'
    }
]
export const MedioPagosView = [
    {
        'view': ListMedioPago,
        'route': 'list/medio-pago'
    }
]
export const ReportesView = [
    {
<<<<<<< HEAD
        'view': Reporte,
        'route': '/reporte/libro-diario'
    }
]
export const TipoAuxiliarView = [
    {
        'view': TipoAuxiliar,
        'route': '/tipo-auxiliar'
=======
        'view':Reporte,
        'route':'/reporte/libro-diario'
    },
    {
        "view":RegistroVentas,
        "route":'reporte/ventas'
>>>>>>> 415b1883ed90628422f495bf077b1cd8dbb56c8f
    }
]