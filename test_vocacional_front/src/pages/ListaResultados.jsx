import { useEffect, useState } from "react";
import { listaResultados } from "../pedidos/fetchResultados";
import { useLocation, useNavigate } from "react-router-dom";
import Cargando from "../componentes/cargando/Cargando";
import { FaChartPie  } from 'react-icons/fa';




const ElementList = ({ id, text }) => {
    const navegar = useNavigate();
    const mostrarResultado = () => { navegar('/resultado', { state: id }) }

    return (
        <button onClick={mostrarResultado} className="bg-primary text-secondary font-bold min-h-8 h-auto w-64
            mb-2 lg:mb-0 ml-0
            py-7 2xl:py-12 px-5 rounded-r-[128px] lg:rounded-l-[128px] 2xl:rounded-r-[256px] 2xl:rounded-l-[256px]
            overflow-hidden shadow-[4px_0_6px_rgba(0,0,0,0.4)] flex items-center justify-center gap-3
            ">
            <FaChartPie />
            {text}
        </button>
    );
}

const ListaResultados = () => {
    const location = useLocation();
    const { id_user } = location.state;
    const [resultadosList, setResultadosList] = useState([]);

    useEffect(() => {
        const fetchListaResultados = async () => {
            const data = await listaResultados(id_user);
            if (data) setResultadosList(data);
        }
        fetchListaResultados();
    }, []);

    return (
        resultadosList.length != 0 ?
        <div className=" w-full h-full py-10 2xl:py-40">
            <h1 className="text-xl sm:text-4xl 2xl:text-6xl font-bold text-primary text-center">RESULTADOS ANTERIORES</h1>
            <div className="mt-16 2xl:pt-32 flex flex-col flex-wrap items-start justify-center gap-4 2xl:gap-20
            lg:flex-row lg:items-center lg:p-5 lg:mb-10 lg:gap-8 2xl:px-44">
                {resultadosList.map((resultado, index) => (
                <ElementList key={resultado} id={resultado}
                    text={"Resultado " + parseInt(index + 1)} />
                ))}
            </div>
        </div> : <Cargando/>
    );
}
export default ListaResultados;