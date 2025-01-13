import { Link } from "react-router-dom";
import '../nav/nav.css'
const Nav = () => {
    return ( 
        <nav id="nav">
            <Link to={'/registrar'}>Registrarme</Link>
            <br />
            <Link to={'/reingresar'}>Reingresar</Link>
        </nav>
     );
}
 
export default Nav;