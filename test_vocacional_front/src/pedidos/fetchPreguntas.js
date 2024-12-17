export const pedirIncisos = async () => {
    const response = await fetch('http://localhost:8080/testvc/pedirIncisos');
    const incisos = await response.json();
    return incisos;
}

export const pedirPreguntas = async () => {
    const response = await fetch('http://localhost:8080/testvc/pedirPreguntas');
    const preguntas = await response.json();
    return preguntas;
}

export const subirRespuestas = async (id_user, respuestas) => {
    try {
        const response = await fetch(`http://localhost:8080/testvc/subirResultados/${id_user}`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(respuestas)
        });
        const resultados = await response.json();
        return resultados;   
    } catch (error) {
        console.error("Error en la solicitud:", error);
    }
}

export const pedirResultados = async (id_user) => {
    try {
        const response = await fetch(`http://localhost:8080/testvc/pedirResultados/${id_user}`);
        const resultados = await response.json();
        return resultados;   
    } catch (error) {
        console.error("Error en la solicitud:", error);
    }
}

export const pedirDatosGrafica = async (id_user) => {
    try {
        const response = await fetch(`http://localhost:8080/testvc/pedirGrafica/${id_user}`);
        return response.json();
    } catch (error) {
        console.error("Error en la solicitud:", error);
    }
}