import { useContext, useEffect, useState } from "react";
import InputRegister from "../componentes/InputRegister";
import { obtenerUsuario } from "../pedidos/fetchRegister";
import { useNavigate } from "react-router-dom";
import { ContextUser } from "../contextos/ContextUser";

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
        <form>
            <InputRegister>
                <input
                    required
                    type="email"
                    placeholder="correo electrónico"
                    value={email}
                    maxLength="50"
                    onChange={(e) => setEmail(e.target.value)}
                />
            </InputRegister>
            <button onClick={startTest}>ingresar</button>
            <button onClick={verResultados}>Resultados anteriores</button>
        </form>
     );
}
 
export default FormReingresar;