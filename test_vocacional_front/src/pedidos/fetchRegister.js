import { ModalError, ModalWarning } from "../componentes/Modal/Modales";

export const pedirEstados = async () => {
    const response = await fetch("https://restricted-agreement-personally-shelf.trycloudflare.com/testvc/estados");
    const estados = await response.json();
    return estados;
};

export const pedirCiudad = async (id_ciudad) => {
    const response = await fetch(`https://restricted-agreement-personally-shelf.trycloudflare.com/testvc/municipios/${id_ciudad}`);
    const ciudades = await response.json();
    return ciudades;
};

export const pedirGenero = async () => {
    const response = await fetch(`https://restricted-agreement-personally-shelf.trycloudflare.com/testvc/generos`);
    const generos = await response.json();
    return generos;
};

export const registrarUsuario = async (dataUsuario) => {
    try {
        const pedido = await fetch('https://restricted-agreement-personally-shelf.trycloudflare.com/testvc/usuario', {
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
        const pedido = await fetch('https://restricted-agreement-personally-shelf.trycloudflare.com/testvc/pedirUsuario', {
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

export const enviarEmail = async (id) => {
    try {
        const pedido = await fetch(`https://restricted-agreement-personally-shelf.trycloudflare.com/testvc/email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "id": id })
        });

        const response = await pedido.json();
        return response;
    } catch (error) {
        ModalWarning("Vaya!!!","No pudimo enviar a tus resultados al correo, pero puedes verlos por aquí");
    }
}