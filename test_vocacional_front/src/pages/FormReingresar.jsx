import { useContext, useState } from "react";
import InputRegister from "../componentes/inputRegister/InputRegister";
import { obtenerUsuario } from "../pedidos/fetchRegister";
import { useNavigate } from "react-router-dom";
import { ContextUser } from "../contextos/ContextUser";
import Cargando from "../componentes/cargando/Cargando";

const FormReingresar = () => {

    const { user, setUser} = useContext(ContextUser);
    const [email, setEmail] = useState("");

    const navegar = useNavigate();

    const getUser = async () => {
        const response = await obtenerUsuario(email);
        if (response.hasOwnProperty('id_user')) {
            setUser((prevUser) => ({
                ...prevUser,
                ...response,
            }));
            return true;
        } else {
            alert(response?.messages.error || "algo salió mal =(");
            return false;
        }
    }
    const startTest = async (e) => {
        e.preventDefault();
        const emailValido = await getUser();

        if (emailValido) navegar('/test')
    }

    const verResultados = async (e) => {
        e.preventDefault();
        const emailValido = await getUser();

        if (emailValido) navegar(`/resultados/${email}`)
    }

    return !user.loading ? (
        <div className="box-ingresar">
            <form onSubmit={startTest} id="form-reingresar" className="form-reingresar" autoComplete="off">
                <div className="box-imagen" id="box-re-imagen">
                    <img src="/person-prueba.webp" alt="user image" />
                </div>
                <InputRegister srcImagen="/person-prueba.webp">
                    <input
                        required
                        id="input-reingresar"
                        className="input-register"
                        type="email"
                        placeholder="correo electrónico"
                        value={email}
                        maxLength="50"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </InputRegister>
            </form>
            <div className="box-botones">
                <button className="boton-primario" onClick={verResultados}>Resultados anteriores</button>
                <button className="boton-primario" form="form-reingresar">ingresar</button>
            </div>
        </div>
     ) : ( <Cargando/> );
}
 
export default FormReingresar;