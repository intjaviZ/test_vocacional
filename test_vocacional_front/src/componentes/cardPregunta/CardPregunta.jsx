import { memo, useEffect, useState } from 'react';
import '../cardPregunta/CardPregunta.css'

const CardPregunta = memo(({ pregunta, id_pregunta, id_area, incisos, sumarArea, selectedInciso }) => {
    const [opcion, setOpcion] = useState(null)
    const handleSelect = (e) => {
        const valor = parseInt(e.target.value, 10);
        sumarArea(id_area, id_pregunta, valor);
        setOpcion(valor);
    }

    useEffect(() => {
        setOpcion(selectedInciso);
    }, [selectedInciso]);
    
    return (
        <div className='box-pregunta'>
            <p className='pregunta' id={id_pregunta}>{pregunta}</p>
            <div className='box-incisos'>
                {incisos.map((inciso) => (
                    <label 
                        htmlFor={`${inciso.id_inciso}-${id_pregunta}`}
                        className={`box-opcion grupo${id_pregunta}
                        ${opcion === inciso.valor_inciso ? 'seleccionado' : ''}`}
                        key={`${inciso.id_inciso}-${id_pregunta}`}
                    >
                        {inciso.inciso}
                        <input
                        className='input-radio'
                        type="radio"
                        name={id_pregunta+id_area}
                        id={`${inciso.id_inciso}-${id_pregunta}`}
                        value={inciso.valor_inciso}
                        onChange={handleSelect} />    
                    </label>
                ))}
            </div>
        </div>
    );
});

export default CardPregunta;