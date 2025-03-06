import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import CardPregunta from "../componentes/cardPregunta/CardPregunta";
import { pedirIncisos, pedirPreguntas, subirRespuestas } from "../pedidos/fetchPreguntas";
import { ContextUser } from "../contextos/ContextUser";
import { ContextRespuestas } from "../contextos/ContextTest";
import { useNavigate } from "react-router-dom";
import Cargando from "../componentes/cargando/Cargando";
import { ModalError, ModalExito } from "../componentes/Modal/Modales";


const Preguntas = () => {
    const { user } = useContext(ContextUser);
    const { respuestas, updateArea } = useContext(ContextRespuestas);

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
        fetchPreguntas().then((data) => {
            if (preguntas.length === 0) setPreguntas(data);
        });
        fetchIncisos().then((data) => {
            if (incisos.length === 0) setIncisos(data);
        });
    }, []);//pedidos al montar el componente

    const sumarArea = useCallback((area, id_pregunta, valor) => {

        if (typeof valor !== "number" || isNaN(valor) || valor < 0 || valor > 2 || valor === undefined || valor === null) return;
        const valorPrevio = radiosSelected.current[id_pregunta] || 0;
        updateArea(area, valorPrevio, valor);

        radiosSelected.current[id_pregunta] = valor;
    }, [radiosSelected]);

    const grupoPreguntas = useMemo(() => {
        return preguntas.slice(grupoActual * tamanioGrupo, (grupoActual + 1) * tamanioGrupo);
    }, [preguntas, grupoActual]);

    // Funciones para cambiar de grupo
    const scrollToTop = (beforeAnimation, afterAnimation) => {
        setAnimacion(beforeAnimation);
        setTimeout(() => {
            setAnimacion(afterAnimation);
        }, 500);
        window.scrollTo({
            top: 0,
            behavior: 'auto',
        });
    }

    const siguienteGrupo = () => {
        if ((grupoActual + 1) * tamanioGrupo < preguntas.length) {
            scrollToTop("-translate-x-full", "translate-x-0");
            setGrupoActual(grupoActual + 1)
        }
    }
    const anteriorGrupo = () => {
        if (grupoActual > 0) {
            scrollToTop("-translate-x-full", "translate-x-0");
            setGrupoActual(grupoActual - 1);
        }
    }
    const esUltimoGrupo = (grupoActual + 1) * tamanioGrupo >= preguntas.length;

    //funciones de validación
    const testCompletado = (preguntasTest) => {
        for (const pregunta of preguntasTest) {
            const respuesta = radiosSelected.current[pregunta.id_pregunta];
            if (respuesta === undefined) {
                ModalError("Test incompleto", "hay preguntas sin respuesta, por favor, contesta cada pregunta");
                return false;
            }
        }
        return true;
    }
    const RespuestasDistintas = (valoresTest) => {
        const todosIguales = valoresTest.every(valor => valor === valoresTest[0]);
        if (!todosIguales) return true;

        ModalError("", "Todos los campos tienen el mismo valor.");
        return false;
    }
    const enRango = (valoresTest) => {
        const isWithinRange = (value) => value >= 0 && value <= 32; // Ejemplo de rango permitido (0 a 10)
        const valoresEnRango = valoresTest.every(isWithinRange);

        if (valoresEnRango) return true;

        ModalError("", "Tus resultados están fuera de rango")
        return false;
    }

    const validarRespuestas = () => {
        const valores = Object.values(respuestas.current);

        if (!testCompletado(preguntas)) return false;
        if (!RespuestasDistintas(valores)) return false;
        if (!enRango(valores)) return false;

        return true;
    }

    //envío de pregunta
    const postPreguntas = async (e) => {
        e.preventDefault();

        if (!validarRespuestas()) return;

        if (buttonRef.current) buttonRef.current.disabled = true;

        const response = await subirRespuestas(user.id_user, respuestas.current);

        if (!response) {
            return ModalError("", "No logramos registrar tu respuesta, prueba más tarde");
        } else if (response.message) {
            return ModalError("", response.message);
        } else if (response.messages) {
            const mensaje = Object.values(response.messages)[0];
            return ModalError("Error en un dato", mensaje);
        }
        if (response.exito) {
            return ModalExito("Felicidades", "Listo para ver tus resultados???", () => navegar('/resultados'));
        }
    }

    if (preguntas.length === 0) {
        return <Cargando />;
    }
    return (
        <div className=" w-full pt-8">
            <div className="overflow-hidden relative">
                <form id="form-preguntas" onSubmit={postPreguntas} autoComplete="off">
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
                {esUltimoGrupo && (<button className="boton-primario" form="form-preguntas" ref={buttonRef}>Finalizar</button>)}
                {!esUltimoGrupo && (<button className="boton-primario" onClick={siguienteGrupo} disabled={(grupoActual + 1) * tamanioGrupo >= preguntas.length}>Siguiente</button>)}
            </div>

        </div>
    );
}

export default Preguntas;