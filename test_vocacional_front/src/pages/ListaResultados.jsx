import { useEffect, useState } from "react";
import { listaResultados } from "../pedidos/fetchResultados";
import { useLocation, useNavigate } from "react-router-dom";

const ElementList = ({ id, text }) => {
    const navegar = useNavigate();
    const mostrarResultado = () => { navegar('/resultado', { state: id }) }

    return (
        <button onClick={mostrarResultado} className="text-secondary text-sm sm:text-base xl:text-lg 2xl:text-2xl
    border 2xl:border-2 border-cobre rounded-3xl m-2 2xl:m-6 ml-0 pl-4 xl:pl-8 py-1 2xl:py-3 min-w-28 w-5/6 flex items-center box-border 
    md:cursor-pointer transition duration-200 ease-in
    md:hover:text-primary md:hover:bg-secondary md:hover:border-transparent">
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
        <div className=" w-full h-full pt-20 2xl:pt-40">
            <div className='bg-primary min-h-8 h-auto  min-w-72 w-card-mv max-w-cp
            mb-4 md:mb-7 lg:mb-12 ml-0 py-10  pl-left-cp pr-9 rounded-r-full overflow-hidden 
            shadow-[4px_0_6px_rgba(0,0,0,0.4)]
            md:w-card-tb lg:w-card-es md:pl-left-cp-es 2xl:h-1/2 2xl:'>
                <h1 className="text-xl sm:text-3xl 2xl:text-5xl font-bold mb-6 2xl:mb-12 text-secondary">Lista resultados</h1>
                {resultadosList.map((resultado, index) => (
                    <ElementList key={resultado} id={resultado}
                        text={"Resultado " + parseInt(index + 1)} />
                ))}
            </div>
        </div>
    );
}
export default ListaResultados;