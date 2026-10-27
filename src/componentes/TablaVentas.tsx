import { api, type Venta } from '../api'
import { fecha, moneda, useDatos } from '../util'
import MensajeError from './MensajeError'

export default function TablaVentas({ idAgente }: { idAgente: number }) {
  const ventas = useDatos(() => api.get<Venta[]>(`/agentes/${idAgente}/ventas`), [idAgente])

  return (
    <>
      <MensajeError mensaje={ventas.error} />
      <table>
        <thead>
          <tr>
            <th>Contrato</th>
            <th>Fecha</th>
            <th>Inmueble</th>
            <th>Comprador</th>
            <th>Monto</th>
          </tr>
        </thead>
        <tbody>
          {ventas.datos?.map((v) => (
            <tr key={v.idContrato}>
              <td>#{v.idContrato}</td>
              <td>{fecha(v.fecha)}</td>
              <td>{v.inmueble}</td>
              <td>{v.comprador}</td>
              <td>{moneda(v.monto)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {ventas.datos?.length === 0 && <p>Sin ventas registradas.</p>}
    </>
  )
}
