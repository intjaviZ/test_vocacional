import { Route, Routes } from 'react-router-dom'
import './App.css'
import { useContext } from 'react'
import { ContextUser } from './contextos/ContextUser'
import Layout from './pages/Layout'
import FormRegister from './pages/FormRegister'
import Preguntas from './pages/Preguntas'
import Resultados from './pages/Resultados';
import NoEncontrado from './pages/NoEncontrado'
import SinPermiso from './pages/SinPermiso'
import VistasProtegidas from './pages/VistaProtegida'
import FormReingresar from './pages/FormReingresar'

function App() {
  const { user } = useContext(ContextUser);
  return (
    <>
      <Routes>
        <Route path='/' element={<Layout/>}>
          <Route path='/public' element={<SinPermiso/>}/>
          <Route index element={<FormRegister/>}/>
          <Route path='/registrar' element={<FormRegister/>}/>
          <Route path='/reingresar' element={<FormReingresar/>}/>
          <Route path='/resultados/:email' element={<Resultados/>}/>
          <Route element={<VistasProtegidas permissions={user.permissions}/>}>
            <Route path='/test' element={<Preguntas/>}/>
            <Route path='/resultados' element={<Resultados/>}/>
          </Route>
        </Route>
        <Route path='*' element={<NoEncontrado/>}/>
      </Routes>
      {/* <FormRegister/> */}
      {/* <Preguntas/> */}
      {/* <Resultados/> */}
    </>
  );
}

export default App
