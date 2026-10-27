import { useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api, type Catalogo, type Inmueble, type Sesion } from '../api'
import { esCredito, useDatos, useFormulario } from '../util'
import MensajeError from '../componentes/MensajeError'
import FichaInmueble from '../componentes/FichaInmueble'

export default function InmuebleDetalle({ sesion }: { sesion: Sesion }) {
  const { id } = useParams()
  const inmueble = useDatos(() => api.get<Inmueble>(`/inmuebles/${id}`), [id])
  const tiposPago = useDatos(() => api.get<Catalogo[]>('/tipos-pago'), [])
  const [form, cambiar] = useFormulario({ monto: '', tiempo: '', idTipoPago: '' })
  const [error, setError] = useState('')
  const navegar = useNavigate()
  const credito = esCredito(tiposPago.datos, form.idTipoPago)

  const ofertar = (e: FormEvent) => {
    e.preventDefault()
    setError('')
    api
      .post('/ofertas', { ...form, tiempo: credito ? form.tiempo : null, idComprador: sesion.id, idInmueble: id })
      .then(() => navegar('/mis-ofertas'))
      .catch((e) => setError(e.message))
  }

  if (!inmueble.datos) return <MensajeError mensaje={inmueble.error} />
  return (
    <>
      <FichaInmueble inmueble={inmueble.datos} />
      {inmueble.datos.disponibilidad === 1 && (
        <form className="tarjeta angosta" onSubmit={ofertar}>
          <h2>Hacer una oferta</h2>
          <label>
            Monto
            <input name="monto" type="number" step="0.01" value={form.monto} onChange={cambiar} required />
          </label>
          <label>
            Forma de pago
            <select name="idTipoPago" value={form.idTipoPago} onChange={cambiar} required>
              <option value="">Seleccione…</option>
              {tiposPago.datos?.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nombre}
                </option>
              ))}
            </select>
          </label>
          {credito && (
            <label>
              Tiempo (días)
              <input name="tiempo" type="number" min="1" value={form.tiempo} onChange={cambiar} required />
            </label>
          )}
          <MensajeError mensaje={error} />
          <button type="submit">Enviar oferta</button>
        </form>
      )}
    </>
  )
}
