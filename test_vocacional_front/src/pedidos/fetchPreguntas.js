// to do
// añadir los modales en los bloques catch

import { ModalError } from "../componentes/Modal/Modales";

export const pedirIncisos = async () => {
    const response = await fetch('https://restricted-agreement-personally-shelf.trycloudflare.com/testvc/incisos');
    const incisos = await response.json();
    return incisos;
}

export const pedirPreguntas = async () => {
    const response = await fetch('https://restricted-agreement-personally-shelf.trycloudflare.com/testvc/preguntas');
    const preguntas = await response.json();
    return preguntas;
}

export const subirRespuestas = async (id_user, respuestas) => {
    try {
        const response = await fetch(`https://restricted-agreement-personally-shelf.trycloudflare.com/testvc/subirResultados/${id_user}`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(respuestas)
        });
        const resultados = await response.json();
        return resultados;   
    } catch (error) {
        ModalError("Vaya!!!","No logramos guardar tus resultados");
    }
}

export const pedirDatosGrafica = async (id_user) => {
    try {
        const response = await fetch(`https://restricted-agreement-personally-shelf.trycloudflare.com/testvc/grafica/${id_user}`);
        const resultados = await response.json();
        return {
            status: response.status,
            resultados
        };
    } catch (error) {
        ModalError("Vaya!!!","No hemos podido obtener tus resultados");
    }
}