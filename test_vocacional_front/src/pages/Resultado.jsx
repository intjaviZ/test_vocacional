import { useEffect, useState } from "react";
import Grafica from "../componentes/grafica/Grafica";
import Cargando from "../componentes/cargando/Cargando";
import { ModalError, ModalExito, ModalWarning } from "../componentes/Modal/Modales";
import ErrorPage from "./ErrorPage";
import { useLocation } from "react-router-dom";
import { enviarEmail, pedirDatosGrafica } from "../pedidos/fetchResultados";

const Resultado = () => {
    const location = useLocation();
    const idGrafica = location.state;

    const [evaluacion , setEvaluacion] = useState({
        nombre: "",
        evaluacion: "",
        area: "",
        status_email: 0
    });
    const [grafica, setGrafica] = useState(null);
    const [error, setError] = useState(false);
    const [botonEmail, setBotonEmail] = useState(true);

    useEffect(() => { pedirGrafica(idGrafica) },[]);

    useEffect(() => {
        if (evaluacion.status_email === 3) setBotonEmail(false);
    },[evaluacion]);

    const pedirGrafica = async (id) => {
        const { status, resultados } = await pedirDatosGrafica(id);
        if (status != 200) {
            ModalError('Error',"No logramos obtener tus resultados");
            setError(true);
        } 

        const datos = resultados.datos;
        const usuario = resultados.usuario;
        const { nombre, evaluacion, area, status_email } = usuario;
        setEvaluacion({ nombre, evaluacion, area, status_email });
            
        if (datos.labels.length === datos.data.length) {
            const nuevosDatos = datos.labels.map((label, index) => ({
                name: label,
                value: datos.data[index],
            }));
            setGrafica(nuevosDatos);
        }
    }

    const finalizar = async () => {
        setBotonEmail(false);
        const email = await enviarEmail(idGrafica);
        if (email.enviado) {
            return ModalExito("Listo","Puedes revisar tu bandeja de Correo y ver tus resultados");
        }
        return ModalWarning("Vaya!!!","No pudimo enviar a tus resultados al correo, pero puedes verlos por aquí",() => {
            setBotonEmail(true);
        });
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
                {botonEmail && ( <button className="boton-primario"
                onClick={finalizar} disabled={!botonEmail}>Finalizar</button>
                )}
            </div>
        </> : <ErrorPage mensaje="Ocurrió un problema y no tenemos resultados para mostrar :("/>
    );

}
 
export default Resultado;