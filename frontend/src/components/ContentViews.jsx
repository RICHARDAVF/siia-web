import { Route, Routes } from "react-router-dom"
import Home from "./Home"
import TipoCambio from "../views/gerencial/mantenimiento/TipoCambio.jsx"
import { ComprasView, CondicionPagoView, RecepcionDocumentosView, ReportesView } from "../views/compras/Routes.jsx"
import { ContabilidadView, PlanContableView, RetencionesView } from "../views/contabilidad/Routes.js"

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

              
                <Route path='/tipo-cambio' element={<TipoCambio/>}/>
                {/* <Route path="/registro/comprobantes" element={<RegistroComprobantes/>}/> */}
                {BuildRoutes(ComprasView)}
                {BuildRoutes(ContabilidadView)}
                {BuildRoutes(PlanContableView)}
                {BuildRoutes(RetencionesView)}
                {BuildRoutes(RecepcionDocumentosView)}
                {BuildRoutes(CondicionPagoView)}
                {BuildRoutes(ReportesView)}

            </Routes>

        </>
    )
}
export default ContentViews