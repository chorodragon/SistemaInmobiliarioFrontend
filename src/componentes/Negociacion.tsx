import { useState, type FormEvent } from 'react'
import { api, type Catalogo, type ContraOferta, type Oferta, type Parte } from '../api'
import { dias, esCredito, fecha, moneda, useDatos, useFormulario } from '../util'
import MensajeError from './MensajeError'

interface Props {
  oferta: Oferta
  parte: Parte | null
  tiposPago: Catalogo[]
  onCambio: () => void
}

export default function Negociacion({ oferta, parte, tiposPago, onCambio }: Props) {
  const contras = useDatos(
    () => api.get<ContraOferta[]>(`/ofertas/${oferta.id}/contraofertas`),
    [oferta.id, oferta.estado],
  )
  const [form, cambiar, setForm] = useFormulario({ monto: '', tiempo: '', idTipoPago: '' })
  const [error, setError] = useState('')
  const credito = esCredito(tiposPago, form.idTipoPago)

  const pendiente = contras.datos?.find((c) => c.estado === 'pendiente')
  const abierta = oferta.estado === 'pendiente' && parte !== null
  const puedeResponder = abierta && (pendiente ? pendiente.origen !== parte : parte === 'vendedor')

  const ejecutar = (p: Promise<unknown>) => {
    setError('')
    p.then(() => {
      contras.recargar()
      onCambio()
    }).catch((e) => setError(e.message))
  }

  const contraofertar = (e: FormEvent) => {
    e.preventDefault()
    ejecutar(
      api.post(`/ofertas/${oferta.id}/contraofertas`, { ...form, tiempo: credito ? form.tiempo : null, origen: parte }).then(() =>
        setForm({ monto: '', tiempo: '', idTipoPago: '' }),
      ),
    )
  }

  return (
    <div className="tarjeta">
      <h3>
        Oferta #{oferta.id} · {oferta.inmueble} <span className={'estado ' + oferta.estado}>{oferta.estado}</span>
      </h3>
      <p>
        {oferta.comprador} ofreció <strong>{moneda(oferta.monto)}</strong> · {oferta.tipoPago}{oferta.tiempo && ` · ${dias(oferta.tiempo)}`}
        · {fecha(oferta.fecha)}
      </p>

      {contras.datos && contras.datos.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Origen</th>
              <th>Monto</th>
              <th>Pago</th>
              <th>Tiempo</th>
              <th>Fecha</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {contras.datos.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.origen}</td>
                <td>{moneda(c.monto)}</td>
                <td>{c.tipoPago}</td>
                <td>{dias(c.tiempo)}</td>
                <td>{fecha(c.fecha)}</td>
                <td>
                  <span className={'estado ' + c.estado}>{c.estado}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <MensajeError mensaje={contras.error || error} />

      {puedeResponder && (
        <p>
          {pendiente ? `Contraoferta #${pendiente.id} pendiente de tu respuesta: ` : 'Oferta pendiente de tu respuesta: '}
          <button onClick={() => ejecutar(api.post(`/ofertas/${oferta.id}/aceptar?por=${parte}`))}>Aceptar</button>{' '}
          <button
            className="secundario"
            onClick={() => ejecutar(api.post(`/ofertas/${oferta.id}/rechazar?por=${parte}`))}
          >
            Rechazar
          </button>
        </p>
      )}

      {abierta && (
        <form className="en-linea" onSubmit={contraofertar}>
          <input name="monto" type="number" step="0.01" placeholder="Monto" value={form.monto} onChange={cambiar} required />
          <select name="idTipoPago" value={form.idTipoPago} onChange={cambiar} required>
            <option value="">Forma de pago…</option>
            {tiposPago.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nombre}
              </option>
            ))}
          </select>
          {credito && (
            <input name="tiempo" type="number" min="1" placeholder="Días" value={form.tiempo} onChange={cambiar} required />
          )}
          <button type="submit">Contraofertar</button>
        </form>
      )}
    </div>
  )
}
