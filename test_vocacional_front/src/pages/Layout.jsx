import { Outlet } from "react-router-dom";
import Footer from "../componentes/footer/Footer";
import Nav from "../componentes/nav/Nav";
import Principal from "../componentes/principal/Principal";

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