import { Navigate, Outlet } from "react-router-dom";

const VistasProtegidas = ({ permissions, redirectTo="/public" }) => {
    if (!permissions) {
        return <Navigate to={redirectTo}/>
    }

    return <Outlet/>
}
 
export default VistasProtegidas;