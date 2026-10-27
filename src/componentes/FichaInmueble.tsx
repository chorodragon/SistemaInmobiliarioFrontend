import type { Inmueble } from '../api'
import { moneda } from '../util'

export default function FichaInmueble({ inmueble: i }: { inmueble: Inmueble }) {
  return (
    <div className="tarjeta">
      <h2>{i.direccion}</h2>
      <dl>
        <dt>Tipo</dt>
        <dd>{i.tipoInmueble}</dd>
        <dt>Precio</dt>
        <dd>{moneda(i.precio)}</dd>
        <dt>Metraje</dt>
        <dd>{i.metraje} m²</dd>
        <dt>Disponible</dt>
        <dd>{i.disponibilidad === 1 ? 'Sí' : 'No'}</dd>
        <dt>Agente</dt>
        <dd>{i.agente}</dd>
        <dt>Vendedor</dt>
        <dd>{i.vendedor}</dd>
        {i.detalles?.map((d) => (
          <div key={d.idCaracteristica} style={{ display: 'contents' }}>
            <dt>{d.caracteristica}</dt>
            <dd>{d.descripcion}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
