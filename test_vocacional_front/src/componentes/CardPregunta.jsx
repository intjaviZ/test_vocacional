const CardPregunta = ({ pregunta, id_pregunta, id_area, incisos, sumarArea }) => {
    

    const handleSelect = (e) => {
        const valor = parseInt(e.target.value, 10);
        sumarArea(id_area, id_pregunta, valor);
    }
    return (
        <div>
            <p id={id_pregunta}>{pregunta}</p>
            <div>
                {incisos.map((inciso) => (
                    <div key={inciso.id_inciso+id_pregunta}>
                        <label htmlFor={inciso.id_inciso+id_pregunta}>{inciso.inciso}</label>
                        <input
                            required
                            type="radio"
                            name={id_pregunta+id_area}
                            id={inciso.id_inciso+id_pregunta}
                            value={inciso.valor_inciso}
                            onChange={handleSelect} />
                    </div>
                ))}
            </div>
        </div>
    );
}
export default CardPregunta;