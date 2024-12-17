export const pedirEstados = async () => {
    const response = await fetch("http://localhost:8080/testvc/pedirEstados");
    const estados = await response.json();
    return estados;
};

export const pedirCiudad = async (id_ciudad) => {
    const response = await fetch(`http://localhost:8080/testvc/pedirCiudades/${id_ciudad}`);
    const ciudades = await response.json();
    return ciudades;
};

export const pedirGenero = async () => {
    const response = await fetch(`http://localhost:8080/testvc/pedirGeneros`);
    const generos = await response.json();
    return generos;
};

export const registrarUsuario = async (dataUsuario) => {
    try {
        const pedido = await fetch('http://localhost:8080/testvc/crearUser', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dataUsuario)
        });
        const response = await pedido.json();
        return response;
    } catch (error) {
        console.error("Error en la solicitud:", error);
    }
}


export const obtenerUsuario = async (email) => {
    try {
        if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){ 
            const response = {
                "messages":{
                    "error": "ingresa un email valido"
                }
            };
            return response;
        }

        const pedido = await fetch(`http://localhost:8080/testvc/pedirUser/${email}`);
        const response = await pedido.json();
        return response;
    } catch (error) {
        console.error("Error en la solicitud:", error);
    }
}