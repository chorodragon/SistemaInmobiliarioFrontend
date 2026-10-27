export default function MensajeError({ mensaje }: { mensaje: string }) {
  return mensaje ? <p className="error">{mensaje}</p> : null
}
