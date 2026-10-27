import { useParams } from 'react-router-dom'
import { api, type Catalogo, type Inmueble, type Oferta, type Sesion } from '../api'
import { useDatos } from '../util'
import MensajeError from '../componentes/MensajeError'
import FichaInmueble from '../componentes/FichaInmueble'
import Negociacion from '../componentes/Negociacion'

export default function OfertasInmueble({ sesion }: { sesion: Sesion }) {
  const { id } = useParams()
  const inmueble = useDatos(() => api.get<Inmueble>(`/inmuebles/${id}`), [id])
  const ofertas = useDatos(() => api.get<Oferta[]>(`/inmuebles/${id}/ofertas`), [id])
  const tiposPago = useDatos(() => api.get<Catalogo[]>('/tipos-pago'), [])

  const recargar = () => {
    ofertas.recargar()
    inmueble.recargar()
  }

  return (
    <>
      {inmueble.datos && <FichaInmueble inmueble={inmueble.datos} />}
      <h2>Ofertas</h2>
      <MensajeError mensaje={inmueble.error || ofertas.error} />
      {ofertas.datos?.length === 0 && <p>Este inmueble aún no tiene ofertas.</p>}
      {ofertas.datos?.map((o) => (
        <Negociacion
          key={o.id}
          oferta={o}
          parte={sesion.rol === 'vendedor' ? 'vendedor' : null}
          tiposPago={tiposPago.datos ?? []}
          onCambio={recargar}
        />
      ))}
    </>
  )
}
