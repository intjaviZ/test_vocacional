import { useContext, useEffect, useState } from "react";
import { ContextUser } from "../contextos/ContextUser";
import { pedirDatosGrafica } from "../pedidos/fetchPreguntas";
import Grafica from "../componentes/grafica/Grafica";
import Cargando from "../componentes/cargando/Cargando";
import { ModalError, ModalExito, ModalWarning } from "../componentes/Modal/Modales";
import ErrorPage from "./ErrorPage";
import { enviarEmail } from "../pedidos/fetchRegister";

const Resultados = () => {

    const { user } = useContext(ContextUser);
    const [evaluacion , setEvaluacion] = useState({
        nombre: "",
        evaluacion: "",
        area: "",
    });
    const [grafica, setGrafica] = useState(null);
    const [error, setError] = useState(false);

    const pedirGrafica = async (id) => {
        const { status, resultados } = await pedirDatosGrafica(id);
        if (status != 200 || resultados.usuario.id_user !== id) {
            ModalError('Error',"No logramos obtener tus resultados");
            setError(true);
        } 

        const datos = resultados.datos;
        const usuario = resultados.usuario;
        const { nombre, evaluacion, area } = usuario;
        setEvaluacion({ nombre, evaluacion, area });
            
        if (datos.labels.length === datos.data.length) {
            const nuevosDatos = datos.labels.map((label, index) => ({
                name: label,
                value: datos.data[index],
            }));
            setGrafica(nuevosDatos);
        }
    }

    useEffect(() => {
        if (user.permissions) {
            const id_user = parseInt(user.id_user);
            pedirGrafica(id_user);
        }
    },[user]);

    const finalizar = async () => {
        const email = await enviarEmail(user.id_user);
        if (email.enviado) {
            return ModalExito("Listo","Puedes revisar tu bandeja de Correo y ver tus resultados");
        }
        return ModalWarning("Vaya!!!","No pudimo enviar a tus resultados al correo, pero puedes verlos por aquí");
    }

    return ( !error ?
        <>
            <div className="px-6 pb-3 pt-7">
                <h1 className="font-light text-center text-xl md:text-2xl lg:text-3xl 2xl:text-6xl">
                    Felicidades, has terminado tu test vocacional.
                    Tu área destacada es: <span className=" font-bold">{evaluacion.area}</span></h1>
                <h2 className="pt-4 font-light text-center text-lg md:text-xl 2xl:text-5xl">
                Concluimos que tienes un {evaluacion.evaluacion}</h2>
            </div>
            <div className="flex-grow flex items-center justify-center w-full">
                <div 
                className="min-w-grafica w-full min-h-52 h-52 sm:h-grafica-sm md:h-grafica-md 
                xl:h-grafica-xl 2xl:h-grafica-2xl">
                    {grafica != null ? (
                        <Grafica datos={grafica} />
                    ): (<Cargando/>)}
                </div>
            </div>
            <div className=" w-full flex justify-center items-start pb-6">
                <button className="boton-primario" onClick={finalizar}>Finalizar</button>
            </div>
        </> : <ErrorPage mensaje="Ocurrió un problema y no tenemos resultados para mostrar :("/>
    );

}
export default Resultados;