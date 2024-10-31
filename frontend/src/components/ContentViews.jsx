import { Route, Routes } from "react-router-dom"
import Home from "./Home"
import RegistroAsientos from "../views/contabilidad/movimientos/RegistroAsientos.jsx"
import TipoCambio from "../views/gerencial/mantenimiento/TipoCambio.jsx"
import ListAsientos from "../views/contabilidad/movimientos/ListAsientos.jsx"
import { ComprasView } from "../views/compras/Routes.jsx"
import RegistroComprobantes from "../views/compras/movimientos/RegistroComprobantes.jsx"
const BuildRoutes=(views)=>{
    
    return views.map((item)=>{
        const ViewComponent = item.view;
        return <Route key={item.route} path={item.route} element={<ViewComponent/>}/>
    }
        
    )
}
const ContentViews=()=>{
    return(
        <>
            <Routes>
                <Route path='/home' element={<Home/>}/>

                <Route path='/asientos/list' element={<ListAsientos/>}/>
                <Route path='/asientos/create' element={<RegistroAsientos/>}/>
                <Route path='/tipo-cambio' element={<TipoCambio/>}/>
                {/* <Route path="/registro/comprobantes" element={<RegistroComprobantes/>}/> */}
                {BuildRoutes(ComprasView)}

            </Routes>

        </>
    )
}
export default ContentViews