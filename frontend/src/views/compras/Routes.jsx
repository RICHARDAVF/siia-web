import ListComprobantes from "./movimientos/ListComprobantes"
import RegistroComprobantes from "./movimientos/RegistroComprobantes"
export const ComprasView =[
    {
        "view":ListComprobantes,
        "route":"/list/comprobantes",
    },
    {
        "view":RegistroComprobantes,
        "route":"/registro/comprobantes",
 

    }
]
