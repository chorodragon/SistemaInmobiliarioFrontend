import { api, type Catalogo, type Oferta, type Sesion } from '../api'
import { useDatos } from '../util'
import MensajeError from '../componentes/MensajeError'
import Negociacion from '../componentes/Negociacion'

export default function MisOfertas({ sesion }: { sesion: Sesion }) {
  const ofertas = useDatos(() => api.get<Oferta[]>(`/compradores/${sesion.id}/ofertas`), [sesion.id])
  const tiposPago = useDatos(() => api.get<Catalogo[]>('/tipos-pago'), [])

  return (
    <>
      <h1>Mis ofertas</h1>
      <MensajeError mensaje={ofertas.error} />
      {ofertas.datos?.length === 0 && <p>Aún no has hecho ofertas.</p>}
      {ofertas.datos?.map((o) => (
        <Negociacion
          key={o.id}
          oferta={o}
          parte="comprador"
          tiposPago={tiposPago.datos ?? []}
          onCambio={ofertas.recargar}
        />
      ))}
    </>
  )
}
