import { Link } from 'react-router-dom'
import { api, type Inmueble, type Sesion } from '../api'
import { moneda, useDatos } from '../util'
import MensajeError from '../componentes/MensajeError'

export default function MisInmuebles({ sesion }: { sesion: Sesion }) {
  const ruta = sesion.rol === 'vendedor' ? `/vendedores/${sesion.id}/inmuebles` : `/agentes/${sesion.id}/inmuebles`
  const inmuebles = useDatos(() => api.get<Inmueble[]>(ruta), [ruta])

  return (
    <>
      <h1>Mis inmuebles</h1>
      <MensajeError mensaje={inmuebles.error} />
      <table>
        <thead>
          <tr>
            <th>Dirección</th>
            <th>Tipo</th>
            <th>Metraje</th>
            <th>Precio</th>
            <th>{sesion.rol === 'vendedor' ? 'Agente' : 'Vendedor'}</th>
            <th>Disponible</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {inmuebles.datos?.map((i) => (
            <tr key={i.id}>
              <td>{i.direccion}</td>
              <td>{i.tipoInmueble}</td>
              <td>{i.metraje} m²</td>
              <td>{moneda(i.precio)}</td>
              <td>{sesion.rol === 'vendedor' ? i.agente : i.vendedor}</td>
              <td>{i.disponibilidad === 1 ? 'Sí' : 'No'}</td>
              <td>
                <Link to={`/inmuebles/${i.id}/ofertas`}>Ofertas</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {inmuebles.datos?.length === 0 && <p>No hay inmuebles.</p>}
    </>
  )
}
