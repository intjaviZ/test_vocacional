import { createContext, useEffect, useRef } from "react";
import { pedirRespuestasModelJson } from "../pedidos/fetchModels";

export const ContextRespuestas = createContext();

export const ContextRespuestasProvider = ({ children }) => {
    let respuestas = useRef({});

    const fetchModelRespuestas = async () => { return await pedirRespuestasModelJson() }
    useEffect(() => { fetchModelRespuestas().then((data) => respuestas.current = data) },[]);

    const updateArea = (area, valorPrevio, valorNuevo) => {
        respuestas.current = { 
            ...respuestas.current, 
            [area]: (respuestas.current[area] || 0) - valorPrevio + valorNuevo 
        };
    }

    return (
        <ContextRespuestas.Provider value={{respuestas, updateArea}}>
            {children}
        </ContextRespuestas.Provider>
     );
}