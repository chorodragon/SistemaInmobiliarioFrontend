import { useState } from 'react'
import { Navigate, NavLink, Route, Routes } from 'react-router-dom'
import type { Rol, Sesion } from './api'
import { guardarSesion, leerSesion, LOGO } from './util'
import Login from './paginas/Login'
import Registro from './paginas/Registro'
import Buscar from './paginas/Buscar'
import InmuebleDetalle from './paginas/InmuebleDetalle'
import MisOfertas from './paginas/MisOfertas'
import Contratos from './paginas/Contratos'
import Agentes from './paginas/Agentes'
import Notificaciones from './paginas/Notificaciones'
import MisInmuebles from './paginas/MisInmuebles'
import NuevoInmueble from './paginas/NuevoInmueble'
import OfertasInmueble from './paginas/OfertasInmueble'
import Ventas from './paginas/Ventas'

const MENU: Record<Rol, [string, string][]> = {
  comprador: [
    ['/buscar', 'Buscar'],
    ['/mis-ofertas', 'Mis ofertas'],
    ['/contratos', 'Contratos'],
    ['/agentes', 'Agentes'],
    ['/notificaciones', 'Notificaciones'],
  ],
  vendedor: [
    ['/mis-inmuebles', 'Mis inmuebles'],
    ['/nuevo-inmueble', 'Nuevo inmueble'],
    ['/contratos', 'Contratos'],
    ['/agentes', 'Agentes'],
    ['/notificaciones', 'Notificaciones'],
  ],
  agente: [
    ['/mis-inmuebles', 'Mis inmuebles'],
    ['/ventas', 'Ventas'],
    ['/contratos', 'Contratos'],
    ['/notificaciones', 'Notificaciones'],
  ],
}

export default function App() {
  const [sesion, setSesion] = useState<Sesion | null>(leerSesion)

  const iniciar = (s: Sesion) => {
    guardarSesion(s)
    setSesion(s)
  }

  const cerrar = () => {
    guardarSesion(null)
    setSesion(null)
  }

  if (!sesion) {
    return (
      <main>
        <Routes>
          <Route path="/login" element={<Login onLogin={iniciar} />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </main>
    )
  }

  const rol = sesion.rol
  return (
    <>
      <header>
        <strong className="marca">
          <img src={LOGO} alt="" />
          Sistema Inmobiliario
        </strong>
        <nav>
          {MENU[rol].map(([ruta, texto]) => (
            <NavLink key={ruta} to={ruta}>
              {texto}
            </NavLink>
          ))}
        </nav>
        <span>
          {sesion.nombre} {sesion.apellido} ({rol}) <button onClick={cerrar}>Salir</button>
        </span>
      </header>
      <main>
        <Routes>
          {rol === 'comprador' && (
            <>
              <Route path="/buscar" element={<Buscar />} />
              <Route path="/inmuebles/:id" element={<InmuebleDetalle sesion={sesion} />} />
              <Route path="/mis-ofertas" element={<MisOfertas sesion={sesion} />} />
              <Route path="/agentes" element={<Agentes />} />
            </>
          )}
          {rol === 'vendedor' && (
            <>
              <Route path="/nuevo-inmueble" element={<NuevoInmueble sesion={sesion} />} />
              <Route path="/agentes" element={<Agentes />} />
            </>
          )}
          {rol === 'agente' && <Route path="/ventas" element={<Ventas sesion={sesion} />} />}
          {rol !== 'comprador' && (
            <>
              <Route path="/mis-inmuebles" element={<MisInmuebles sesion={sesion} />} />
              <Route path="/inmuebles/:id/ofertas" element={<OfertasInmueble sesion={sesion} />} />
            </>
          )}
          <Route path="/contratos" element={<Contratos sesion={sesion} />} />
          <Route path="/notificaciones" element={<Notificaciones sesion={sesion} />} />
          <Route path="*" element={<Navigate to={MENU[rol][0][0]} />} />
        </Routes>
      </main>
    </>
  )
}
