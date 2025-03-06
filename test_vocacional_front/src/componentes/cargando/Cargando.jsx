import { useEffect } from "react";
import { ModalError } from "../Modal/Modales";

const Cargando = () => {
    useEffect(() => {
        const timeOut = setTimeout(() => {
            ModalError("Oooops!","Intenta más tarde", true)
        }, 5000);

        return () => clearTimeout(timeOut);
    },[]);
    return (
        <div className="h-full w-full flex flex-col items-center justify-center flex-grow">
            <div className="border-secondary h-28 w-28 animate-spin rounded-full border-8 border-t-cobre" />
            <h1 className="pt-10">Cargando...</h1>
        </div>
    );
}

export default Cargando;