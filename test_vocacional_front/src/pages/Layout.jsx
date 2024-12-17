import { Outlet } from "react-router-dom";
import Footer from "../componentes/Footer";
import Nav from "../componentes/Nav";
import Principal from "../componentes/Principal";

const Layout = () => {
    return ( 
        <>
            <Nav/>
            <Principal>
                <Outlet/>
            </Principal>
            <Footer/>
        </>
     );
}
 
export default Layout;