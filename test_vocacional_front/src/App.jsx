import { Route, Routes } from 'react-router-dom'
import { useContext, Suspense, lazy } from 'react'
import { ContextUser } from './contextos/ContextUser'
import Layout from './pages/Layout'
import Cargando from './componentes/cargando/Cargando'
import VistasProtegidas from './pages/VistaProtegida'
import './estilos/forms.css'
import './estilos/botones.css'

// Cargar dinámicamente las páginas
const FormRegister = lazy(() => import('./pages/FormRegister'))
const Preguntas = lazy(() => import('./pages/Preguntas'))
const Resultados = lazy(() => import('./pages/Resultados'))
const NoEncontrado = lazy(() => import('./pages/NoEncontrado'))
const SinPermiso = lazy(() => import('./pages/SinPermiso'))
const FormReingresar = lazy(() => import('./pages/FormReingresar'))

function App() {
  const { user } = useContext(ContextUser);
  return (
    <Suspense fallback={<Cargando/>}>
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
          <Route path='*' element={<NoEncontrado/>}/>
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App
