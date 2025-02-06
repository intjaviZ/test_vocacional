import { createContext, useEffect, useState } from "react";
import { pedirResultadosModelJson } from "../pedidos/fetchModels";

export const ContextResultados = createContext();

export const ContextResultadosProvider = ({ children }) => {
    let [resultados, setResultados] = useState([]);

    const fetchModelResultados = async () => { return await pedirResultadosModelJson() }

    useEffect(() => { fetchModelResultados().then((data) => setResultados(data)) },[]);
    
    return (
        <ContextResultados.Provider value={{ resultados, setResultados }}>
            {children}
        </ContextResultados.Provider>
     );
}