const InputRegister = ({ srcImagen, children }) => {
    return ( 
        <div>
            <div>
                <img src={srcImagen} alt="" />
            </div>
            {children}
        </div>
     );
}
 
export default InputRegister;