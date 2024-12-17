import { Link } from "react-router-dom";

const Nav = () => {
    return ( 
        <nav>
            <Link to={'/registrar'}>Registrarme</Link>
            <br />
            <Link to={'/reingresar'}>Usar mi mismo correo</Link>
        </nav>
     );
}
 
export default Nav;