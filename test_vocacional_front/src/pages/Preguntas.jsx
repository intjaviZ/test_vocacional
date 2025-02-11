import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import CardPregunta from "../componentes/cardPregunta/CardPregunta";
import { pedirIncisos, pedirPreguntas, subirRespuestas } from "../pedidos/fetchPreguntas";
import { ContextUser } from "../contextos/ContextUser";
import { ContextRespuestas } from "../contextos/ContextTest";
import { ContextResultados } from "../contextos/ContextResultados";
import { useNavigate } from "react-router-dom";
import Cargando from "../componentes/cargando/Cargando";


const Preguntas = () => {
    const { user } = useContext(ContextUser);
    const { respuestas, updateArea } = useContext(ContextRespuestas);
    const { resultados, setResultados } = useContext(ContextResultados);

    const buttonRef = useRef(null);
    const radiosSelected = useRef({});
    const [preguntas, setPreguntas] = useState([]);
    const [incisos, setIncisos] = useState([]);
    const [grupoActual, setGrupoActual] = useState(0);
    const [animacion, setAnimacion] = useState("");

    const navegar = useNavigate();

    const tamanioGrupo = 10;

    const fetchPreguntas = async () => { return await pedirPreguntas() }
    const fetchIncisos = async () => { return await pedirIncisos() }

    useEffect(() => {
        fetchPreguntas().then((data) => setPreguntas(data))
        fetchIncisos().then((data) => {
            setIncisos(data);
        })        
    }, []);

    const grupoPreguntas = useMemo(() => {
        return preguntas.slice(grupoActual * tamanioGrupo, (grupoActual + 1) * tamanioGrupo);
    }, [preguntas, grupoActual]);

    // Funciones para cambiar de grupo
    const scrollToTop = (beforeAnimation,afterAnimation) => {
        setAnimacion(beforeAnimation);
        setTimeout(() => {
            setAnimacion(afterAnimation);
        }, 500);
        window.scrollTo({
            top: 0,
            behavior: 'auto',
        });
    };
    const siguienteGrupo = () => {
        if ((grupoActual + 1) * tamanioGrupo < preguntas.length) {
            scrollToTop("-translate-x-full","translate-x-0");
            setGrupoActual(grupoActual + 1)
        }
    }
    const anteriorGrupo = () => {
        if (grupoActual > 0) {
            scrollToTop("-translate-x-full","translate-x-0");
            setGrupoActual(grupoActual - 1);
        }
    }
    const esUltimoGrupo = (grupoActual + 1) * tamanioGrupo >= preguntas.length;

    const sumarArea = useCallback((area, id_pregunta, valor) => {
        if (isNaN(valor) || valor < 0 || valor > 32 || valor === undefined || valor === null) return;
        // respuestas.current[area]: respuestas.current[area] - valorPrevio + valor; 
        const valorPrevio = radiosSelected.current[id_pregunta] || 0;
        updateArea(area, valorPrevio, valor);
        // setRespuestas((estado) => {
        //     const valorPrevio = radiosSelected.current[id_pregunta] || 0;
        //     return { ...estado, [area]: estado[area] - valorPrevio + valor };
        // });
        radiosSelected.current[id_pregunta] = valor;
    }, [radiosSelected]);

    const validarRespuestas = () => {
        for (const pregunta of preguntas) {
            const respuesta = radiosSelected.current[pregunta.id_pregunta];
            if (respuesta === undefined) {
                alert("Por favor, selecciona una respuesta para cada pregunta");
                return false;
            }
        }

        // Extraer los valores de 'respuestas'
        const valores = Object.values(respuestas.current);
        // Verificar si todos los valores son iguales
        const todosIguales = valores.every(valor => valor === valores[0]);
        if (todosIguales) {
            alert('Todos los campos tienen el mismo valor.');
            return false;
        }

        const isWithinRange = (value) => value >= 0 && value <= 32; // Ejemplo de rango permitido (0 a 10)
        const allInRange = valores.every(isWithinRange);
        if (!allInRange) {
            alert('Todos los valores deben estar en el rango permitido (0-32).');
            return false;
        }

        return true;
    }

    const postPreguntas = async (e) => {
        e.preventDefault();
        if (validarRespuestas()) {
            if (buttonRef.current) {
                buttonRef.current.disabled = true;
            }

            const response = await subirRespuestas(user.id_user, respuestas);

            if (response && response.id_user) {
                setResultados((respuesta) => ({
                    ...respuesta,
                    ...response
                }));
                alert("Respuesta registrada correctamente")
                navegar('/resultados')

            } else {
                alert('Error al enviar la solicitud.');
            }
        }
    }
    return (
        preguntas.length != 0 ? (
            <div className=" w-full pt-8">
                <div className="overflow-hidden relative">
                    <form className="relative" onSubmit={postPreguntas} autoComplete="off">
                        <div className={`transform transition-transform duration-300 ${animacion}`}>
                            {grupoPreguntas.map((pregunta) => (
                                <CardPregunta
                                    key={pregunta.id_pregunta}
                                    id_pregunta={pregunta.id_pregunta}
                                    id_area={pregunta.id_area}
                                    pregunta={pregunta.pregunta}
                                    incisos={incisos}
                                    sumarArea={sumarArea}
                                    selectedInciso={radiosSelected.current[pregunta.id_pregunta] ?? null} />
                            ))}
                        </div>
                    </form>
                </div>

                <div className="box-botones">
                    <button className="boton-primario" onClick={anteriorGrupo} disabled={grupoActual === 0}>Anterior</button>
                    {esUltimoGrupo && (<button className="boton-primario" ref={buttonRef}>Finalizar</button>)}
                    {!esUltimoGrupo && (<button className="boton-primario" onClick={siguienteGrupo} disabled={(grupoActual + 1) * tamanioGrupo >= preguntas.length}>Siguiente</button>)}
                </div>

            </div>) : (<Cargando />)
    );
}

export default Preguntas;