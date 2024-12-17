export const pedirUserModelJson = async () => {
    const response = await fetch('http://localhost:8080/testvc/modelUser');
    const userModel = await response.json();
    return userModel;
}

export const pedirRespuestasModelJson = async () => {
    const response = await fetch('http://localhost:8080/testvc/modelRespuestas');
    const respuestasModel = await response.json();
    return respuestasModel;
}

export const pedirResultadosModelJson = async () => {
    const response = await fetch('http://localhost:8080/testvc/modelResultados');
    const userModel = await response.json();
    return userModel;
}