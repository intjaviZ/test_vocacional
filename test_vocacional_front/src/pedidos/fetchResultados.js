import { ModalError } from "../componentes/Modal/Modales";

export const listaResultados = async (id_user) => {
    try {
        const pedido = await fetch(`http://localhost:8080/testvc/respuestas/${id_user}`);
        const response = await pedido.json();
        return response;
    } catch (error) {
        ModalError('Oppps!','No logramos obtener tus resultados.');
    }
}

export const pedirDatosGrafica = async (id_grafica) => {
    try {
        const response = await fetch(`http://localhost:8080/testvc/grafica/${id_grafica}`);
        const resultados = await response.json();
        return {
            status: response.status,
            resultados
        };
    } catch (error) {
        ModalError("Vaya!!!","No hemos podido obtener este resultado");
    }
}

export const enviarEmail = async (id) => {
    try {
        const pedido = await fetch(`http://localhost:8080/testvc/email`, {
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