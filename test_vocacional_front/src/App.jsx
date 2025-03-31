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
const ListaResultados = lazy(() => import('./pages/ListaResultados'))
const Resultado = lazy(() => import('./pages/Resultado'))
const NoEncontrado = lazy(() => import('./pages/NoEncontrado'))
const ErrorPage = lazy(() => import('./pages/ErrorPage'))
const FormReingresar = lazy(() => import('./pages/FormReingresar'))

function App() {
  const { user } = useContext(ContextUser);
  return (
    <Suspense fallback={<Cargando/>}>
      <Routes>
        <Route path='/' element={<Layout/>}>
          <Route path='/public' element={<ErrorPage
            mensaje="vaya!!!, no has registrado un usuario, hazlo en este momento para acceder a tu test : )"/>}/>
          <Route index element={<FormRegister/>}/>
          <Route path='/registrar' element={<FormRegister/>}/>
          <Route path='/reingresar' element={<FormReingresar/>}/>

          <Route element={<VistasProtegidas permissions={user.permissions}/>}>
            <Route path='/test' element={<Preguntas/>}/>
            <Route path='/resultados' element={<ListaResultados/>}/>
            <Route path='/resultado' element={<Resultado/>}/>
          </Route>
          
          <Route path='*' element={<NoEncontrado/>}/>
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App
