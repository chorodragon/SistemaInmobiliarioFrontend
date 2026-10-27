import { useState, type FormEvent } from 'react'
import { api, query, type Contrato, type Prestamo, type Sesion } from '../api'
import { fecha, moneda, useDatos, useFormulario } from '../util'
import MensajeError from '../componentes/MensajeError'

const FILTRO = { comprador: 'idComprador', vendedor: 'idVendedor', agente: 'idAgente' } as const

function FilaContrato({ contrato: c, sesion, onCambio }: { contrato: Contrato; sesion: Sesion; onCambio: () => void }) {
  const prestamos = useDatos(() => api.get<Prestamo[]>(`/contratos/${c.id}/prestamos`), [c.id, c.estado])
  const [form, cambiar, setForm] = useFormulario({ banco: '', monto: '', plazo: '', intereses: '' })
  const [error, setError] = useState('')
  const pendiente = c.estado === 'pendiente'
  const esVendedor = sesion.rol === 'vendedor'

  const ejecutar = (p: Promise<unknown>) => {
    setError('')
    p.then(() => {
      prestamos.recargar()
      onCambio()
    }).catch((e) => setError(e.message))
  }

  const registrarPrestamo = (e: FormEvent) => {
    e.preventDefault()
    ejecutar(
      api.post(`/contratos/${c.id}/prestamos`, form).then(() => setForm({ banco: '', monto: '', plazo: '', intereses: '' })),
    )
  }

  return (
    <div className="tarjeta">
      <h3>
        Contrato #{c.id} · {c.inmueble} <span className={'estado ' + c.estado}>{c.estado}</span>
      </h3>
      <p>
        {moneda(c.monto)} · {c.tipoPago} · {fecha(c.fecha)}
        <br />
        Comprador: {c.comprador} · Vendedor: {c.vendedor} · Agente: {c.agente}
      </p>

      {pendiente && sesion.rol !== 'agente' && (
        <p>
          {esVendedor && (
            <>
              <button onClick={() => ejecutar(api.post(`/contratos/${c.id}/aceptar`))}>Aceptar contrato</button>{' '}
            </>
          )}
          <button
            className="secundario"
            onClick={() => ejecutar(api.post(`/contratos/${c.id}/cancelar?por=${sesion.rol}`))}
          >
            Cancelar contrato
          </button>
        </p>
      )}

      {prestamos.datos && prestamos.datos.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Banco</th>
              <th>Monto</th>
              <th>Plazo</th>
              <th>Interés anual</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {prestamos.datos.map((p) => (
              <tr key={p.id}>
                <td>{p.banco}</td>
                <td>{moneda(p.monto)}</td>
                <td>{p.plazo} meses</td>
                <td>{p.intereses} %</td>
                <td>
                  <span className={'estado ' + p.estado}>{p.estado}</span>
                </td>
                <td>
                  {esVendedor && pendiente && p.estado === 'pendiente' && (
                    <>
                      <button onClick={() => ejecutar(api.post(`/prestamos/${p.id}/aceptar`))}>Aceptar</button>{' '}
                      <button className="secundario" onClick={() => ejecutar(api.post(`/prestamos/${p.id}/cancelar`))}>
                        Cancelar
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {esVendedor && pendiente && (
        <form className="en-linea" onSubmit={registrarPrestamo}>
          <input name="banco" placeholder="Banco" value={form.banco} onChange={cambiar} required />
          <input name="monto" type="number" step="0.01" placeholder="Monto" value={form.monto} onChange={cambiar} required />
          <input name="plazo" type="number" placeholder="Plazo (meses)" value={form.plazo} onChange={cambiar} required />
          <input
            name="intereses"
            type="number"
            step="0.0001"
            placeholder="Interés anual %"
            value={form.intereses}
            onChange={cambiar}
            required
          />
          <button type="submit">Registrar préstamo</button>
        </form>
      )}
      <MensajeError mensaje={prestamos.error || error} />
    </div>
  )
}

export default function Contratos({ sesion }: { sesion: Sesion }) {
  const contratos = useDatos(
    () => api.get<Contrato[]>('/contratos' + query({ [FILTRO[sesion.rol]]: sesion.id })),
    [sesion.id, sesion.rol],
  )

  return (
    <>
      <h1>Contratos</h1>
      <MensajeError mensaje={contratos.error} />
      {contratos.datos?.length === 0 && <p>No hay contratos.</p>}
      {contratos.datos?.map((c) => (
        <FilaContrato key={c.id} contrato={c} sesion={sesion} onCambio={contratos.recargar} />
      ))}
    </>
  )
}
