import '../inputRegister/InputRegister.css'

const InputRegister = ({ icon, children }) => {
    return (
        <div className='box'>
            <div className='box-image'>
                {icon}
            </div>
            {children}
        </div>
     );
}
 
export default InputRegister;