import '../inputRegister/InputRegister.css'

const InputRegister = ({ srcImagen, children }) => {
    return ( 
        <div className='box'>
            <div className='box-image'>
                <img className='image' src={srcImagen} alt="" />
            </div>
            {children}
        </div>
     );
}
 
export default InputRegister;