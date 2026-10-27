import { useState } from 'react'
import { api, query, type Agente } from '../api'
import { useDatos } from '../util'
import MensajeError from '../componentes/MensajeError'
import TablaVentas from '../componentes/TablaVentas'

export default function Agentes() {
  const [q, setQ] = useState('')
  const agentes = useDatos(() => api.get<Agente[]>('/agentes' + query({ q })), [q])
  const [elegido, setElegido] = useState<Agente | null>(null)

  return (
    <>
      <h1>Agentes</h1>
      <input placeholder="Buscar por nombre o código" value={q} onChange={(e) => setQ(e.target.value)} />
      <MensajeError mensaje={agentes.error} />
      <table>
        <thead>
          <tr>
            <th>Código</th>
            <th>Nombre</th>
            <th>Email</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {agentes.datos?.map((a) => (
            <tr key={a.id} className={elegido?.id === a.id ? 'elegido' : ''}>
              <td>{a.codigo}</td>
              <td>
                {a.nombre} {a.apellido}
              </td>
              <td>{a.email}</td>
              <td>
                <button onClick={() => setElegido(a)}>Ver ventas</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {elegido && (
        <>
          <h2>
            Ventas de {elegido.nombre} {elegido.apellido}
          </h2>
          <TablaVentas idAgente={elegido.id} />
        </>
      )}
    </>
  )
}
