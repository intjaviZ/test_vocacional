import { useEffect, useState } from "react";

const NoEncontrado = () => {
    let [codigo,setCodigo] = useState(0)
    useEffect(() => {
        const interval = setInterval(() => {
            if (codigo < 404 ) {
                setCodigo((prev) => prev += 1);
            } else {
                clearInterval(interval)
            }
        },2)
        return () => clearInterval(interval);
    });
    return (
        <div className="w-full px-6 pt-24 flex items-start justify-center">
            <h1 className="font-light text-2xl xl:text-4xl 2xl:text-6xl uppercase"><span className="font-mono font-bold text-center">{codigo}</span> Nada por aquí.</h1>
        </div>
    );
};

export default NoEncontrado;
