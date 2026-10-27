import type { Sesion } from '../api'
import TablaVentas from '../componentes/TablaVentas'

export default function Ventas({ sesion }: { sesion: Sesion }) {
  return (
    <>
      <h1>Mis ventas</h1>
      <TablaVentas idAgente={sesion.id} />
    </>
  )
}
