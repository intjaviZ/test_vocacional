import { useContext, useEffect } from "react";
import { useState } from "react";
import InputRegister from "../componentes/inputRegister/InputRegister";
import { pedirCiudad, pedirEstados, pedirGenero, registrarUsuario } from "../pedidos/fetchRegister";
import { useNavigate } from "react-router-dom";
import { ContextUser } from "../contextos/ContextUser";
import Cargando from "../componentes/cargando/Cargando";
import { ModalError, ModalExito } from "../componentes/Modal/Modales";

const FormRegister = () => {
    const { user, setUser } = useContext(ContextUser);

    const [estados, setEstados] = useState([]);
    const [ciudades, setCiudades] = useState([]);
    const [generos, setGeneros] = useState([]);

    const navegar = useNavigate();

    let { id_user, permissions, test_completado, ...userData } = user;
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
                value = value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, "");
                value = value.replace(/\s{2,}/g, " ");
                value = value.trimStart();
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
                if (value !== 0) fetchCiudades(value).then((data) => setCiudades(data))
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

    const camposValidos = (campos) => {
        for (const key in campos) {
            const value = campos[key];
            if (value == "" || value == " " || value == "0") return false;
        }
        return true;
    }

    const startTest = async (e) => {
        e.preventDefault();

        const validos = camposValidos(userData);
        if (!validos) {
            return ModalError(
                "Debes llenar todos los campos",
                "Asegurate de llenar correctamente todos los campos", false);
        }

        const response = await registrarUsuario(userData);

        if (!response) {
            return ModalError("Error de servidor", "El servidor ha tardado demasiado.")
        } 
        if (response.error) {
            if (Object.keys(response.messages).length > 1 ) {
                return ModalError("Datos erroneos", "prueba seguir las sugerencias del navegador para registrarte")
            }
            const mensaje = Object.values(response.messages)[0];
            return ModalError("Error en un dato", mensaje)
        }
        if (response.status == 201 || response.permissions) {
            setUser((estado) => ({ ...estado, "id_user": response.id_user, "permissions": response.permissions }));
            ModalExito(response.mensaje, "Ahora estás listo para iniciar tu test vocacional");
            navegar('/test');
        }
    }

    return !user.loading ? (
        <div className="box-ingresar">
            <form onSubmit={startTest} id="form-register" className="form-ingresar" autoComplete="off">
                <div className="box-imagen">
                    <img src="/person-prueba.webp" alt="user image" />
                </div>
                <div className="box-input">
                    <InputRegister srcImagen="/person-prueba.webp">
                        <input
                            required
                            id="input-nombre"
                            type="text"
                            placeholder="nombre"
                            className='input-register'
                            value={nombre_user}
                            minLength="3"
                            maxLength="25"
                            title="Minimo de 3 caracteres"
                            onChange={(e) => onChangeInput(e, "nombre_user")} />
                    </InputRegister>
                    <InputRegister srcImagen="/person-prueba.webp">
                        <input
                            required
                            id="input-aPaterno"
                            type="text"
                            placeholder="apellido paterno"
                            className='input-register'
                            value={apellido_paterno}
                            minLength="3"
                            maxLength="16"
                            title="Minimo de 3 caracteres"
                            onChange={(e) => onChangeInput(e, "apellido_paterno")} />
                    </InputRegister>
                    <InputRegister srcImagen="/person-prueba.webp">
                        <input
                            required
                            id="input-aMaterno"
                            type="text"
                            placeholder="apellido materno"
                            className='input-register'
                            value={apellido_materno}
                            minLength="3"
                            maxLength="16"
                            title="Minimo de 3 caracteres"
                            onChange={(e) => onChangeInput(e, "apellido_materno")}
                        />
                    </InputRegister>
                    <InputRegister srcImagen="/person-prueba.webp">
                        <input
                            required
                            id="input-email"
                            type="email"
                            placeholder="correo electrónico"
                            className='input-register'
                            maxLength="50"
                            value={email}
                            onChange={(e) => onChangeInput(e, "email")}
                        />
                    </InputRegister>
                    <InputRegister srcImagen="/person-prueba.webp">
                        <input
                            required
                            id="input-tel"
                            type="tel"
                            placeholder="telefono"
                            title="10 digitos"
                            className='input-register'
                            value={telefono}
                            maxLength="10"
                            onChange={(e) => onChangeInput(e, "telefono")}
                        />
                    </InputRegister>
                    <InputRegister srcImagen="/person-prueba.webp">
                        <select required name="estadosOrigen" className='input-register select' id="estadosOrigen" title="campo requerido" value={id_estado} onChange={(e) => onChangeInput(e, "id_estado")}>
                            <option value={0}>Selecciona un estado</option>
                            {estados.map((estado) => (
                                <option key={estado.id_Estado} value={estado.id_Estado}>{estado.Estado}</option>
                            ))}
                        </select>
                    </InputRegister>
                    <InputRegister srcImagen="/person-prueba.webp">
                        <select required name="ciudadOrigen" className='input-register select' id="ciudadOrigen" title="campo requerido" value={id_ciudad} onChange={(e) => onChangeInput(e, "id_ciudad")}>
                            <option value={0}>Selecciona una ciudad</option>
                            {ciudades.map((ciudad) => (
                                <option key={ciudad.id_municipio} value={ciudad.id_municipio}>{ciudad.municipio}</option>
                            ))}
                        </select>
                    </InputRegister>
                    <InputRegister srcImagen="/person-prueba.webp">
                        <select required name="genero" className='input-register select' id="genero" title="campo requerido" value={id_genero} onChange={(e) => onChangeInput(e, "id_genero")}>
                            <option value={0}>Selecciona un genero</option>
                            {generos.map((genero) => (
                                <option key={genero.id_genero} value={parseInt(genero.id_genero)}>{genero.genero}</option>
                            ))}
                        </select>
                    </InputRegister>
                </div>
            </form>
            <div className="box-boton">
                <button form="form-register" className="boton-primario">Empezar</button>
            </div>
        </div>
    ) : (
        <Cargando />
    );
}

export default FormRegister;