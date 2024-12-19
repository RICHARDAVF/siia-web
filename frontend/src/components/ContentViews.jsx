import { Route, Routes } from "react-router-dom"
import Home from "./Home"

import { ComprasView, CondicionPagoView, RecepcionDocumentosView, TipoServicioView } from "../views/compras/Routes.jsx"
import { CentroCostoView, ContabilidadView, MedioPagosView, OrigenesView, PlanContableView, ReportesView, RetencionesView } from "../views/contabilidad/Routes.js"
import { TipoCambioView } from "../views/configuracion/Routes.js"

const BuildRoutes = (views) => {

    return views.map((item) => {
        const ViewComponent = item.view;
        return <Route key={item.route} path={item.route} element={<ViewComponent />} />
    }

    )
}
const ContentViews = () => {
    return (
        <>
            <Routes>
                <Route path='/home' element={<Home />} />

                {/* <Route path="/registro/comprobantes" element={<RegistroComprobantes/>}/> */}
                {BuildRoutes(ComprasView)}
                {BuildRoutes(ContabilidadView)}
                {BuildRoutes(PlanContableView)}
                {BuildRoutes(RetencionesView)}
                {BuildRoutes(RecepcionDocumentosView)}
                {BuildRoutes(CondicionPagoView)}
                {BuildRoutes(ReportesView)}
                {BuildRoutes(TipoServicioView)}
                {BuildRoutes(OrigenesView)}
                {BuildRoutes(TipoCambioView)}
                {BuildRoutes(CentroCostoView)}
                {BuildRoutes(MedioPagosView)}
                {BuildRoutes(ReportesView)}


            </Routes>

        </>
    )
}
export default ContentViews