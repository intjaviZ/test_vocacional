import { useEffect, useState } from "react";
import { listaResultados } from "../pedidos/fetchResultados";
import { useLocation, useNavigate } from "react-router-dom";

const ElementList = ({ id, text }) => {
    const navegar = useNavigate();
    const mostrarResultado = () => { navegar('/resultado', { state: id}) }

    return (
        <button onClick={mostrarResultado} className="boton-primario">{text}</button>
    );
}

const ListaResultados = () => {
    const location = useLocation();
    const id_user = location.state;
    const [resultadosList, setResultadosList] = useState([]);


    useEffect(() => {
        const fetchListaResultados = async () => {
            const data = await listaResultados(id_user); 
            if (data) setResultadosList(data);
        }
        fetchListaResultados();
    })

    return (
        <div>
            <h1 className="text-center text-2xl">Lista resultados</h1>
            {resultadosList.map((resultado, index) => (
                <ElementList key={resultado} id={resultado} text={"Resultado "+ parseInt(index+1)} />
            ))}
        </div>
    );

}
export default ListaResultados;