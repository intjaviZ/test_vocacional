import { useContext, useEffect, useRef, useState } from "react";
import CardPregunta from "../componentes/CardPregunta";
import { pedirIncisos, pedirPreguntas, subirRespuestas } from "../pedidos/fetchPreguntas";
import { ContextUser } from "../contextos/ContextUser";
import { ContextRespuestas } from "../contextos/ContextTest";
import { ContextResultados } from "../contextos/ContextResultados";
import { useNavigate } from "react-router-dom";

const Preguntas = () => {
    const { user }                      = useContext(ContextUser);
    const { respuestas, setRespuestas } = useContext(ContextRespuestas);
    const { resultados, setResultados}  = useContext(ContextResultados);

    const buttonRef = useRef(null);
    const [preguntas, setPreguntas] = useState([]);
    const [incisos, setIncisos] = useState([]);
    const [radiosSelected, setRadiosSelected] = useState({});
    const [grupoActual, setGrupoActual] = useState(0);

    const navegar = useNavigate();

    const tamanioGrupo = 10;

    const fetchPreguntas = async () => { return await pedirPreguntas() }
    const fetchIncisos = async () => { return await pedirIncisos() }

    useEffect(() => { 
        fetchPreguntas().then((data) => setPreguntas(data))
        fetchIncisos().then((data) => setIncisos(data))
    }, []);

    // useEffect(() => console.log(radiosSelected),[radiosSelected])

    const grupoPreguntas = preguntas.slice( grupoActual * tamanioGrupo, (grupoActual + 1) * tamanioGrupo );
    
    // Funciones para cambiar de grupo
    const siguienteGrupo = () => { 
        if ((grupoActual + 1) * tamanioGrupo < preguntas.length) setGrupoActual(grupoActual + 1)
    }
    const anteriorGrupo = () => {
        if (grupoActual > 0) setGrupoActual(grupoActual - 1);
    }
    // Verificar si es el último grupo
    const esUltimoGrupo = (grupoActual + 1) * tamanioGrupo >= preguntas.length;

    const sumarArea = (area, id_pregunta, valor) => {
        if (isNaN(valor) || valor < 0 || valor > 32 || valor == undefined || valor == null) return;

        setRespuestas((estado) => {
            const valorPrevio = radiosSelected[id_pregunta] || 0; // Obtén el valor previo o 0 si no existe
            return { ...estado, [area]: estado[area] - valorPrevio + valor }; // Resta el valor previo y suma el nuevo valor
        });
        // Actualiza el valor seleccionado en `selecciones` para esta pregunta
        setRadiosSelected((selecciones) => ({ ...selecciones, [id_pregunta]: valor }));
    }

    const validarRespuestas = () => {

        for (const pregunta of preguntas) {
            const respuesta = radiosSelected[pregunta.id_pregunta];
            if (respuesta === undefined) {
                alert("Por favor, selecciona una respuesta para cada pregunta");
                return false;
            }
        }

        // Extraer los valores de 'respuestas'
        const valores = Object.values(respuestas);
        // Verificar si todos los valores son iguales
        const todosIguales = valores.every(valor => valor === valores[0]);
        if (todosIguales) {
            alert('Todos los campos tienen el mismo valor.');
            return false;
        }

        const isWithinRange = (value) => value >= 0 && value <= 32; // Ejemplo de rango permitido (0 a 10)
        const allInRange = Object.values(respuestas).every(isWithinRange);
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
            // console.log(response);
            
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
        <>
        <div>
            <p>Hola {user.nombre_user}</p>
        </div>
        <div>
            <form onSubmit={postPreguntas}>
            {grupoPreguntas.map((pregunta) => (
                <CardPregunta
                    key={pregunta.id_pregunta} 
                    id_pregunta={pregunta.id_pregunta} 
                    id_area={pregunta.id_area} 
                    pregunta={pregunta.pregunta}
                    incisos={incisos}
                    sumarArea={sumarArea}/>
                    
            ))}
            {esUltimoGrupo && (<button ref={buttonRef}>Click Me</button>)}
            </form>
        </div>
        <div>
            <button onClick={anteriorGrupo} disabled={grupoActual === 0}>Anterior</button>
            <button onClick={siguienteGrupo} disabled={(grupoActual + 1) * tamanioGrupo >= preguntas.length}>Siguiente</button>
        </div>
        </>
     );
}

export default Preguntas;