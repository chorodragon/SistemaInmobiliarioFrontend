import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { api, query, type Inmueble } from '../api'
import { moneda, useDatos, useFormulario } from '../util'
import MensajeError from '../componentes/MensajeError'

const VACIO = { direccion: '', metrajeMin: '', metrajeMax: '', precioMin: '', precioMax: '' }

export default function Buscar() {
  const [form, cambiar] = useFormulario(VACIO)
  const [filtros, setFiltros] = useState(VACIO)
  const resultados = useDatos(() => api.get<Inmueble[]>('/inmuebles' + query(filtros)), [filtros])

  const buscar = (e: FormEvent) => {
    e.preventDefault()
    setFiltros(form)
  }

  return (
    <>
      <h1>Buscar inmuebles</h1>
      <form className="tarjeta filtros" onSubmit={buscar}>
        <label>
          Dirección
          <input name="direccion" value={form.direccion} onChange={cambiar} />
        </label>
        <label>
          Metraje mín.
          <input name="metrajeMin" type="number" value={form.metrajeMin} onChange={cambiar} />
        </label>
        <label>
          Metraje máx.
          <input name="metrajeMax" type="number" value={form.metrajeMax} onChange={cambiar} />
        </label>
        <label>
          Precio mín.
          <input name="precioMin" type="number" value={form.precioMin} onChange={cambiar} />
        </label>
        <label>
          Precio máx.
          <input name="precioMax" type="number" value={form.precioMax} onChange={cambiar} />
        </label>
        <button type="submit">Buscar</button>
      </form>
      <MensajeError mensaje={resultados.error} />
      <table>
        <thead>
          <tr>
            <th>Dirección</th>
            <th>Tipo</th>
            <th>Metraje</th>
            <th>Precio</th>
            <th>Agente</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {resultados.datos?.map((i) => (
            <tr key={i.id}>
              <td>{i.direccion}</td>
              <td>{i.tipoInmueble}</td>
              <td>{i.metraje} m²</td>
              <td>{moneda(i.precio)}</td>
              <td>{i.agente}</td>
              <td>
                <Link to={`/inmuebles/${i.id}`}>Ver</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {resultados.datos?.length === 0 && <p>No hay inmuebles que coincidan.</p>}
    </>
  )
}
