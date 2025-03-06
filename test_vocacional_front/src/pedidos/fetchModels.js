export const pedirUserModelJson = async () => {
    const response = await fetch('https://restricted-agreement-personally-shelf.trycloudflare.com/testvc/usuario');
    const userModel = await response.json();
    return userModel;
}

export const pedirRespuestasModelJson = async () => {
    const response = await fetch('https://restricted-agreement-personally-shelf.trycloudflare.com/testvc/respuestas');
    const respuestasModel = await response.json();
    return respuestasModel;
}