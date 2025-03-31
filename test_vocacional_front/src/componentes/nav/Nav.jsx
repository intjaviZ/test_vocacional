import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import '../nav/nav.css'
import { ContextUser } from "../../contextos/ContextUser";
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useContext(ContextUser);

  return (
    <header className="nav">
      <nav className="nav-container">
        <a href="https://universidaddelsur.edu.mx/" target="blank" rel="noopener noreferrer">
          <div className="text-xl 2xl:text-3xl font-bold">Logo</div>
        </a>
        <button
          aria-expanded={isOpen}
          className="burguer-boton"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-full h-full"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        {/* Menú normal */}
        <div className="menu-pc">
          <Link className="links" to={'/registrar'}>Registrarme</Link>
          <Link className="links" to={'/reingresar'}>Reingresar</Link>
          {user.test_completado == 3 && <Link className="links"
            state={{ id_user: user.id_user }} to='/resultados'>
            Resultados</Link>}
        </div>
        {/* Menú desplegable */}
        <div className={`box-oculto ${isOpen ? 'box-visible' : 'box-salida'}`}>
          <div className="box-links">
            <Link className="links link-mv" onClick={() => setIsOpen(false)} to={'/registrar'}>Registrarme</Link>
            <Link className="links link-mv" onClick={() => setIsOpen(false)} to={'/reingresar'}>Reingresar</Link>
            {user.test_completado == 3 && <Link className="links link-mv" 
            onClick={() => setIsOpen(false)} state={{ id_user: user.id_user }} to='/resultados'>
              Resultados</Link>}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;