import { useContext, useEffect } from "react";
import { useState } from "react";
import InputRegister from "../componentes/InputRegister";
import { pedirCiudad, pedirEstados, pedirGenero, registrarUsuario } from "../pedidos/fetchRegister";
import { useNavigate } from "react-router-dom";
import { ContextUser } from "../contextos/ContextUser";

const FormRegister = () => {
    const { user, setUser} = useContext(ContextUser);
    
    const [estados, setEstados] = useState([]);
    const [ciudades, setCiudades] = useState([]);
    const [generos, setGeneros] = useState([]);

    const navegar = useNavigate();
    
    let { id_user, permissions, ...userData } = user;
    let { nombre_user, apellido_paterno, apellido_materno, email, telefono, id_estado, id_ciudad, id_genero } = userData;

    const fetchEstados = async () => { return await pedirEstados() } 
    const fetchCiudades = async (id_estado) => { return await pedirCiudad(id_estado) }
    const fetchGenero = async () => { return await pedirGenero() }

    useEffect(() => {
        fetchEstados().then((data) => setEstados(data));
        fetchGenero().then((data) => setGeneros(data));
    }, []);

    const onChangeInput = (event, prop) => {
        let value = event.target.value;

        switch (prop) {
            case "nombre_user":
            case "apellido_paterno":
            case "apellido_materno":
                const regexString = /[0-9\s]/g;
                if(regexString.test(value)) {
                    value = value.replace(regexString, '');
                    return;
                }
                break;
            case "telefono":
                const regexNumber = /[^0-9]/g;
                if (regexNumber.test(value)) {
                    value = value.replace(regexNumber, '');    
                    return;
                }
                break;
            case "id_estado":
                value = parseInt(value);
                fetchCiudades(value).then((data) => setCiudades(data));
                break;
            case "id_ciudad":
            case "id_genero":
                value = parseInt(value);
                break;
            default:
                break;
        }        
        setUser((estado) => ({ ...estado, [prop]: value }));
    };

    const startTest = async (e) => {
        e.preventDefault();

        for (const key in userData) {
            const value = userData[key];
            if (value == "" || value == " " || value == "0") return alert("debes llenar todos los campos");
        }
        const response = await registrarUsuario(userData);
        
        if (response) {
            alert(response.mensaje);
            if (response.status === 200) {
                setUser((estado) => ({...estado, "id_user": response.id_user, "permissions": true}))
                navegar('/test');
            }
        }
    }

    return !user.loading ? (
        <div>
            <div>
                {/* imagen */}
            </div>
            <form onSubmit={startTest}>
                <InputRegister>
                    <input 
                        required
                        type="text"
                        placeholder="nombre"
                        value={nombre_user}
                        minLength="3"
                        maxLength="16"
                        onChange={(e) => onChangeInput(e,"nombre_user")} />
                </InputRegister>
                <InputRegister>
                    <input
                        required
                        type="text"
                        placeholder="apellido paterno"
                        value={apellido_paterno}
                        minLength="3"
                        maxLength="16"
                        pattern="\w{3,16}"
                        onChange={(e) => onChangeInput(e,"apellido_paterno")}/>
                </InputRegister>
                <InputRegister>
                    <input
                        required
                        type="text"
                        placeholder="apellido materno"
                        value={apellido_materno}
                        minLength="3"
                        maxLength="16"
                        onChange={(e) => onChangeInput(e,"apellido_materno")}
                    />
                </InputRegister>
                <InputRegister>
                    <input
                        required
                        type="email"
                        placeholder="correo electrónico"
                        maxLength="50"
                        value={email}
                        onChange={(e) => onChangeInput(e,"email")}
                    />
                </InputRegister>
                <InputRegister>
                    <input
                        required
                        type="tel"
                        placeholder="telefono"
                        value={telefono}
                        maxLength="10"
                        onChange={(e) => onChangeInput(e,"telefono")}
                    />
                </InputRegister>
                <InputRegister>
                    <select required name="estadosOrigen" id="estadosOrigen" value={id_estado} onChange={(e) => onChangeInput(e,"id_estado")}>
                    <option>Selecciona un estado</option>
                        {estados.map((estado) => (
                                <option key={estado.id_Estado} value={estado.id_Estado}>{estado.Estado}</option>
                        ))}
                    </select>
                </InputRegister>
                <InputRegister>
                    <select required name="ciudadOrigen" id="ciudadOrigen" value={id_ciudad} onChange={(e) => onChangeInput(e,"id_ciudad")}>
                    <option>Selecciona una ciudad</option>
                        {ciudades.map((ciudad) =>(
                            <option key={ciudad.id_municipio} value={ciudad.id_municipio}>{ciudad.municipio}</option>
                        ))}
                    </select>
                </InputRegister>
                <InputRegister>
                    <select required name="genero" id="genero" value={id_genero} onChange={(e) => onChangeInput(e,"id_genero")}>
                        <option>Selecciona un genero</option>
                        {generos.map((genero) => (
                            <option key={genero.id_genero} value={parseInt(genero.id_genero)}>{genero.genero}</option>
                        ))}
                    </select>
                </InputRegister>
                <button>Iniciar</button>
            </form>
        </div>
     ) : (
        <h1>cargando datos</h1>
     );
}
 
export default FormRegister;