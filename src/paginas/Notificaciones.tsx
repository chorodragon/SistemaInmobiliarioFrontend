import { api, query, type Notificacion, type Sesion } from '../api'
import { fecha, useDatos } from '../util'
import MensajeError from '../componentes/MensajeError'

export default function Notificaciones({ sesion }: { sesion: Sesion }) {
  const filtro = sesion.rol === 'agente' ? { idAgente: sesion.id } : { idUsuario: sesion.id }
  const notificaciones = useDatos(
    () => api.get<Notificacion[]>('/notificaciones' + query(filtro)),
    [sesion.id, sesion.rol],
  )

  const marcar = (id: number) => api.put(`/notificaciones/${id}/leida`).then(notificaciones.recargar)

  return (
    <>
      <h1>
        Notificaciones <button onClick={notificaciones.recargar}>Actualizar</button>
      </h1>
      <MensajeError mensaje={notificaciones.error} />
      {notificaciones.datos?.length === 0 && <p>No tienes notificaciones.</p>}
      <ul className="notificaciones">
        {notificaciones.datos?.map((n) => (
          <li key={n.id} className={n.leida ? 'leida' : ''}>
            <small>{fecha(n.fecha)}</small> {n.mensaje}{' '}
            {!n.leida && (
              <button className="secundario" onClick={() => marcar(n.id)}>
                Marcar leída
              </button>
            )}
          </li>
        ))}
      </ul>
    </>
  )
}
