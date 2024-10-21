import { Navigate, Route,Routes } from "react-router-dom"
import { useAuth } from "./AuthContext";
import Dashboard from "./Dashboard";
import { ListConts } from "../views/cuentas/List";
import Layout from "./Layout";

const PrivateRoute = ({ element }) => {
    const { user } = useAuth();

    return user ? element : <Navigate to="/" />;
};
export  const  Content=()=>{
    return (
        <Routes>
            <Route path="/"  element={<PrivateRoute element={<Layout/>}/>}/>
            <Route path="/list-conts" element={<ListConts/>}/>
            <Route path="/dashboard"  element={<Dashboard/>}/>
        </Routes>
    )
}