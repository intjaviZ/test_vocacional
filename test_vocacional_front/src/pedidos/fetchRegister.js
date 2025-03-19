import { ModalError, ModalWarning } from "../componentes/Modal/Modales";

export const pedirEstados = async () => {
    const response = await fetch("http://localhost:8080/testvc/estados");
    const estados = await response.json();
    return estados;
};

export const pedirCiudad = async (id_ciudad) => {
    const response = await fetch(`http://localhost:8080/testvc/municipios/${id_ciudad}`);
    const ciudades = await response.json();
    return ciudades;
};

export const pedirGenero = async () => {
    const response = await fetch(`http://localhost:8080/testvc/generos`);
    const generos = await response.json();
    return generos;
};

export const registrarUsuario = async (dataUsuario) => {
    try {
        const pedido = await fetch('http://localhost:8080/testvc/usuario', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dataUsuario)
        });
        const response = await pedido.json();
        return response;
    } catch (error) {
        ModalError("No podemos registrate en este momento",
            "Lo sentimos, Tuvimos un problema para registrar tu usuario, intenta más tarde.", false);
    }
}


export const obtenerUsuario = async (email) => {
    try {
        if (!email.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.email)){ 
            return { "invalid": "Por favor, ingresa un email valido"  };
        }
        const pedido = await fetch('http://localhost:8080/testvc/pedirUsuario', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(email)
        });
        const response = await pedido.json();
        return response;
    } catch (error) {
        ModalError("No podemos obtener tus datos en este momento",
            "Lo sentimos, Tuvimos un problema para obtener tu usuario, intenta más tarde.", false);
    }
}

