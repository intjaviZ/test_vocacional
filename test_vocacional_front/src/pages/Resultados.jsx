import { useContext, useEffect, useState } from "react";
import { ContextResultados } from "../contextos/ContextResultados";
import { ContextUser } from "../contextos/ContextUser";
import { useNavigate, useParams } from "react-router-dom";
import { obtenerUsuario } from "../pedidos/fetchRegister";
import { pedirDatosGrafica, pedirResultados } from "../pedidos/fetchPreguntas";
import Grafica from "../componentes/grafica/Grafica";
// import Cargando from "../componentes/cargando/cargando";

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
    const [ grafica, setGrafica ] = useState(null);
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
        if (resultados.id_user) return null;

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
    },[user]);

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
    },[user.id_user]);
    
    return (
        <>
            <h1>Aquí están tus resultados {user.nombre_user}</h1>
            <div style={{textAlign:"left", fontSize:"1.3rem"}}>
                <p>Tu area de mayor interés es: <b>{resultados.area}</b></p>
                <p>Obtuviste un total de <b>{resultados.puntos}</b> puntos</p>
                <p>Lo que demuestra un <b>{resultados.evaluacion}</b></p>
            </div>
            <h2>Resultados completos</h2>
            <div style={{display:"flex", alignItems:"center", justifyContent:"center"}}>
                {grafica != null && (
                    <Grafica datos={grafica}/>
                )}
            </div>
        </>
    );
    
}
export default Resultados;