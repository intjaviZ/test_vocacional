// to do
// añadir los modales en los bloques catch

import { ModalError } from "../componentes/Modal/Modales";

export const pedirPreguntas = async () => {
    const response = await fetch('http://localhost:8080/testvc/preguntas');
    const preguntas = await response.json();
    return preguntas;
}

export const pedirIncisos = async () => {
    const response = await fetch('http://localhost:8080/testvc/incisos');
    const incisos = await response.json();
    return incisos;
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
        ModalError("Vaya!!!","No logramos guardar tus resultados");
    }
}