import ListComprobates from "./movimientos/ListComprobantes"
import RegistroComprobantes from "./movimientos/RegistroComprobantes"
export const ComprasView =[
    {
        "view":ListComprobates,
        "route":"/list/comprobantes",
    },
    {
        "view":RegistroComprobantes,
        "route":"/registro/comprobantes",
 

    }
]
