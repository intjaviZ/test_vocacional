import { createContext, useEffect, useState } from "react";
import { pedirRespuestasModelJson } from "../pedidos/fetchModels";

export const ContextRespuestas = createContext();

export const ContextRespuestasProvider = ({ children }) => {
    let [respuestas, setRespuestas] = useState([]);

    const fetchModelRespuestas = async () => { return await pedirRespuestasModelJson() }

    useEffect(() => { fetchModelRespuestas().then((data) => setRespuestas(data)) },[]);
    return (
        <ContextRespuestas.Provider value={{respuestas, setRespuestas}}>
            {children}
        </ContextRespuestas.Provider>
     );
}