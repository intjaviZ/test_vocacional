import { createContext, useEffect, useState } from "react";
import { pedirUserModelJson } from "../pedidos/fetchModels";

export const ContextUser = createContext();

export const ContextUserProvider = ({ children }) => {
    let [user, setUser] = useState({ "loading": true });

    const fetchModelUser = async () => { return await pedirUserModelJson() }

    useEffect(() => { fetchModelUser().then((data) => setUser(data)) },[]);
    // useEffect(() => console.log(user),[user]);
    return (
        <ContextUser.Provider value={{user, setUser}}>
            {children}
        </ContextUser.Provider>
     );
}