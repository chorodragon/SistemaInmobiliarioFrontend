import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { api, query, type Agente, type Catalogo, type Sesion } from '../api'
import { useDatos, useFormulario } from '../util'
import MensajeError from '../componentes/MensajeError'

export default function NuevoInmueble({ sesion }: { sesion: Sesion }) {
  const tipos = useDatos(() => api.get<Catalogo[]>('/tipos-inmueble'), [])
  const caracteristicas = useDatos(() => api.get<Catalogo[]>('/caracteristicas'), [])
  const [form, cambiar] = useFormulario({ direccion: '', precio: '', metraje: '', idTipoInmueble: '', idAgente: '' })
  const [detalles, setDetalles] = useState<Record<number, string>>({})
  const [q, setQ] = useState('')
  const agentes = useDatos(() => api.get<Agente[]>('/agentes' + query({ q })), [q])
  const [error, setError] = useState('')
  const navegar = useNavigate()

  const guardar = (e: FormEvent) => {
    e.preventDefault()
    setError('')
    api
      .post('/inmuebles', {
        ...form,
        idVendedor: sesion.id,
        detalles: Object.entries(detalles)
          .filter(([, v]) => v.trim() !== '')
          .map(([idCaracteristica, descripcion]) => ({ idCaracteristica, descripcion })),
      })
      .then(() => navegar('/mis-inmuebles'))
      .catch((e) => setError(e.message))
  }

  return (
    <form className="tarjeta angosta" onSubmit={guardar}>
      <h1>Nuevo inmueble</h1>
      <label>
        Dirección
        <input name="direccion" value={form.direccion} onChange={cambiar} required />
      </label>
      <label>
        Tipo
        <select name="idTipoInmueble" value={form.idTipoInmueble} onChange={cambiar} required>
          <option value="">Seleccione…</option>
          {tipos.datos?.map((t) => (
            <option key={t.id} value={t.id}>
              {t.nombre}
            </option>
          ))}
        </select>
      </label>
      <label>
        Precio
        <input name="precio" type="number" step="0.01" value={form.precio} onChange={cambiar} required />
      </label>
      <label>
        Metraje (m²)
        <input name="metraje" type="number" step="0.01" value={form.metraje} onChange={cambiar} required />
      </label>

      <fieldset>
        <legend>Agente</legend>
        <input placeholder="Buscar por nombre o código" value={q} onChange={(e) => setQ(e.target.value)} />
        <select name="idAgente" value={form.idAgente} onChange={cambiar} required size={5}>
          <option value="">Seleccione…</option>
          {agentes.datos?.map((a) => (
            <option key={a.id} value={a.id}>
              {a.codigo} · {a.nombre} {a.apellido}
            </option>
          ))}
        </select>
      </fieldset>

      <fieldset>
        <legend>Características</legend>
        {caracteristicas.datos?.map((c) => (
          <label key={c.id}>
            {c.nombre}
            <input
              value={detalles[c.id] ?? ''}
              onChange={(e) => setDetalles({ ...detalles, [c.id]: e.target.value })}
            />
          </label>
        ))}
      </fieldset>

      <MensajeError mensaje={error || tipos.error || caracteristicas.error || agentes.error} />
      <button type="submit">Guardar</button>
    </form>
  )
}
