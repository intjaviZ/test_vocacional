export const pedirUserModelJson = async () => {
    const response = await fetch('http://localhost:8080/testvc/usuario');
    const userModel = await response.json();
    return userModel;
}

export const pedirRespuestasModelJson = async () => {
    const response = await fetch('http://localhost:8080/testvc/respuestas');
    const respuestasModel = await response.json();
    return respuestasModel;
}