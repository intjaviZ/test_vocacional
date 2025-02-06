import { useContext, useEffect, useState } from "react";
import { ContextResultados } from "../contextos/ContextResultados";
import { ContextUser } from "../contextos/ContextUser";
import { useNavigate, useParams } from "react-router-dom";
import { obtenerUsuario } from "../pedidos/fetchRegister";
import { pedirDatosGrafica, pedirResultados } from "../pedidos/fetchPreguntas";
import Grafica from "../componentes/grafica/Grafica";
import Cargando from "../componentes/cargando/Cargando";

const sinResultados = () => {
    return (
        <div>
            <h1>Ocurrió un problema y no tenemos resultados para mostrar</h1>
        </div>
    );
}

const Resultados = () => {
    const { resultados, setResultados } = useContext(ContextResultados);
    const { user, setUser } = useContext(ContextUser);
    const [grafica, setGrafica] = useState(null);
    const { email } = useParams();
    const navegar = useNavigate();

    const verificarUser = async () => {
        if (user.id_user) return null;
        if (email) {
            const response = await obtenerUsuario(email);
            if (response.hasOwnProperty('id_user')) { return response }
            else {
                navegar('/reingresar')
            }
        } else {
            return null;
        }
    }

    const verificarResultados = async () => {
        // if (resultados.id_user) return null;
        if (resultados?.id_user) return null;

        const response = await pedirResultados(user.id_user);
        if (response.hasOwnProperty('id_user')) { return response }
        else { return sinResultados() }
    }

    useEffect(() => {
        if (user.loading) return;
        const pedirDatos = async () => {
            const userData = await verificarUser();
            if (userData) {
                setUser((prevUser) => ({
                    ...prevUser,
                    ...userData,
                }));
            }
            const resultadosData = await verificarResultados();
            if (resultadosData && resultadosData.id_user) {
                setResultados((resultados) => ({
                    ...resultados,
                    ...resultadosData,
                }));
            }
        }
        pedirDatos();
    }, [user]);

    useEffect(() => {
        const pedirGrafica = async () => {
            if (user.id_user) {
                const graficaData = await pedirDatosGrafica(user.id_user);
                if (graficaData.labels.length === graficaData.data.length) {
                    const nuevosDatos = graficaData.labels.map((label, index) => ({
                        name: label,
                        value: graficaData.data[index],
                    }));
                    setGrafica(nuevosDatos);
                }
            }
        }
        pedirGrafica();
    }, [user.id_user]);

    return (
        <>
            <div className=" px-6 pb-3 pt-7">
                <h1 className=" font-light text-center text-xl md:text-2xl lg:text-3xl 2xl:text-6xl">
                    Felicidades, has terminado tu test vocacional.
                    Tu área destacada es: {resultados.area}</h1>
                <h2 className="pt-4 font-light text-center text-lg md:text-xl 2xl:text-5xl">Concluimos que tienes un {resultados.evaluacion}</h2>
            </div>
            <div className=" flex-grow flex items-center justify-center w-full">
                <div className="min-w-grafica w-full min-h-52 h-52 sm:h-grafica-sm md:h-grafica-md xl:h-grafica-xl 2xl:h-grafica-2xl">
                    {grafica != null ? (
                        <Grafica datos={grafica} />
                    ): (<Cargando/>)}
                </div>
            </div>
        </>
    );

}
export default Resultados;