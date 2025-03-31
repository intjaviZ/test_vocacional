import { createContext, useEffect, useState } from "react";
import { pedirUserModelJson } from "../pedidos/fetchModels";

export const ContextUser = createContext();

export const ContextUserProvider = ({ children }) => {
    let [user, setUser] = useState({ "loading": true });

    const fetchModelUser = async () => {
        const modelUser = await pedirUserModelJson();
        setUser(modelUser);
        return modelUser;
    }
    
    useEffect(() => { fetchModelUser() },[]);
    const reset = async () => { return await fetchModelUser() }

    return (
        <ContextUser.Provider value={{user, setUser, reset}}>
            {children}
        </ContextUser.Provider>
    );
}