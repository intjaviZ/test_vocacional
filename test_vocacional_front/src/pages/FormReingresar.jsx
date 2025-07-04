import { useContext, useEffect, useState } from "react";
import InputRegister from "../componentes/inputRegister/InputRegister";
import { obtenerUsuario } from "../pedidos/fetchRegister";
import { useNavigate } from "react-router-dom";
import { ContextUser } from "../contextos/ContextUser";
import Cargando from "../componentes/cargando/Cargando";
import { ModalError, ModalExito, ModalWarning } from "../componentes/Modal/Modales";
import { FaUserCircle } from "react-icons/fa";
import { MdOutlineAlternateEmail } from "react-icons/md";

const FormReingresar = () => {

    const { user, setUser } = useContext(ContextUser);
    const [emailState, setEmail]         = useState({ "email": '' });
    const [userObtenido,setUserObtenido] = useState(false);
    const [clickStart, setClickStart]    = useState(false);

    const navegar = useNavigate();

    const getUser = async (user_email) => {
        const response = await obtenerUsuario(user_email);
        if ('invalid' in response) {
            ModalError("Error", response.invalid, true);
        } else if ('id_user' in response && !('error' in response)) {
            setUser((prevUser) => ({
                ...prevUser,
                ...response,
            }));
            setUserObtenido(true);
            return true;
        } else {
            ModalError("Error", response.messages.error, true);
        }
        return false;
    }

    const startTest = async (e) => {
        e.preventDefault();
        const emailValido = await getUser(emailState);
        if (!emailValido)  return;

        setClickStart(true);
        ModalExito("Todo bien","",() => { navegar('/test') });        
    }
    const verResultados = async (e) => {
        e.preventDefault();
        const emailValido = await getUser(emailState);
        if (!emailValido) return;
        if (clickStart) setClickStart(false);
        //caso en que el usuario no vaya a test después del click a startTest y quiera ir a resultados
        //la lógica de redirección la maneja el efecto secundario
    }

    const sinResultados = () => parseInt(user.test_completado) !== 3;

    useEffect(() => {
        if (clickStart) return;
        if (!userObtenido)  return;

        const sinResultado = sinResultados();
        if (sinResultado) {
            ModalWarning("Sin resultados",
            "No encontramos resultados anteriores, haz tu test ahora mismo!",
            () => { navegar('/test') });
            return;
        }
        navegar('/resultados', { state: { id_user: user.id_user } });
        
    },[userObtenido, clickStart]);

    return !user.loading ? (
        <div className="box-ingresar">
            <form onSubmit={startTest} className="form-reingresar" autoComplete="off">
                <div className="box-imagen" id="box-re-imagen">
                    <FaUserCircle className="h-full w-full text-secondary"/>
                </div>
                <InputRegister icon={<MdOutlineAlternateEmail className="h-full text-secondary"/>}>
                    <input
                        required
                        id="input-reingresar"
                        className="input-register"
                        type="email"
                        placeholder="correo electrónico"
                        value={emailState.email}
                        maxLength="50"
                        onChange={(e) => setEmail({ email: e.target.value })}
                    />
                </InputRegister>
            </form>
            <div className="box-botones">
                <button className="boton-primario" onClick={verResultados}>Resultados anteriores</button>
                <button className="boton-primario" onClick={startTest}>Iniciar test</button>
            </div>
        </div>
    ) : (<Cargando />);
}

export default FormReingresar;