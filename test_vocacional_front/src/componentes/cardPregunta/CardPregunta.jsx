import '../cardPregunta/CardPregunta.css'

const CardPregunta = ({ pregunta, id_pregunta, id_area, incisos, sumarArea }) => {
    const handleSelect = (e) => {
        const valor = parseInt(e.target.value, 10);
        sumarArea(id_area, id_pregunta, valor);

        document.querySelectorAll(`.grupo${id_pregunta}`).forEach(
            (label) => label.classList.remove("seleccionado"));

        const label = document.querySelector(`label[for="${e.target.id}"]`);
        if (label) label.classList.add("seleccionado");
    }
    return (
        <div className='box-pregunta'>
            <p className='pregunta' id={id_pregunta}>{pregunta}</p>
            <div className='box-incisos'>
                {incisos.map((inciso) => (
                    
                        <label 
                            htmlFor={inciso.id_inciso+id_pregunta}
                            className={'box-opcion' + ' ' + `grupo${id_pregunta}`}
                            key={inciso.id_inciso+id_pregunta}
                        >
                            {inciso.inciso}
                            <input
                            className='input-radio'
                            required
                            type="radio"
                            name={id_pregunta+id_area}
                            id={inciso.id_inciso+id_pregunta}
                            value={inciso.valor_inciso}
                            onChange={handleSelect} />    
                        </label>
                        
                    
                ))}
            </div>
        </div>
    );
}
export default CardPregunta;