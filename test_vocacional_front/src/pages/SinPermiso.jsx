import { Link } from "react-router-dom";

const SinPermiso = () => {
    return ( 
        <div>
            <h1>Oooh, no te has registrado, hazlo en este momento para acceder al test</h1>
            <Link to={'/registrar'}>Registrarme</Link>
            <Link to={'/reingresar'}>Usar mi mismo correo</Link>
        </div>
    );
}
 
export default SinPermiso;