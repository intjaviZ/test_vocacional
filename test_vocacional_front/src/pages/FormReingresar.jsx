import { useContext, useEffect, useState } from "react";
import InputRegister from "../componentes/inputRegister/InputRegister";
import { obtenerUsuario } from "../pedidos/fetchRegister";
import { useNavigate } from "react-router-dom";
import { ContextUser } from "../contextos/ContextUser";
import '../estilos/botones.css'
import '../estilos/forms.css'

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

    return (
        <div className="box-ingresar">
            <form className="form-reingresar">
            <div className="box-imagen">
                <img src="../../public/person-prueba.webp" alt="user image" />
            </div>
            <InputRegister srcImagen="../../public/person-prueba.webp">
                <input
                    required
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
            <button className="boton-primario" onClick={startTest}>ingresar</button>
            <button className="boton-primario" onClick={verResultados}>Resultados anteriores</button>
        </div>
        </div>
     );
}
 
export default FormReingresar;