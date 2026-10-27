import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import { useFormulario } from '../util'
import MensajeError from '../componentes/MensajeError'

const CAMPOS: [string, string, string?][] = [
  ['nombre', 'Nombre'],
  ['apellido', 'Apellido'],
  ['direccion', 'Dirección'],
  ['telefono', 'Teléfono'],
  ['estadoCivil', 'Estado civil'],
  ['nacionalidad', 'Nacionalidad'],
  ['edad', 'Edad', 'number'],
  ['email', 'Email', 'email'],
  ['usuario', 'Usuario'],
  ['pass', 'Contraseña', 'password'],
]

export default function Registro() {
  const [form, cambiar] = useFormulario(Object.fromEntries(CAMPOS.map(([c]) => [c, ''])))
  const [error, setError] = useState('')
  const [listo, setListo] = useState(false)

  const enviar = (e: FormEvent) => {
    e.preventDefault()
    setError('')
    api
      .post('/clientes', form)
      .then(() => setListo(true))
      .catch((e) => setError(e.message))
  }

  if (listo) {
    return (
      <div className="tarjeta angosta">
        <h1>Registro completado</h1>
        <p>
          Ya puedes <Link to="/login">iniciar sesión</Link> como comprador.
        </p>
      </div>
    )
  }

  return (
    <form className="tarjeta angosta" onSubmit={enviar}>
      <h1>Registro de cliente</h1>
      {CAMPOS.map(([campo, texto, tipo]) => (
        <label key={campo}>
          {texto}
          <input
            name={campo}
            type={tipo ?? 'text'}
            value={form[campo]}
            onChange={cambiar}
            required={campo === 'usuario' || campo === 'pass'}
          />
        </label>
      ))}
      <MensajeError mensaje={error} />
      <button type="submit">Registrarme</button>
      <p>
        <Link to="/login">Volver al inicio de sesión</Link>
      </p>
    </form>
  )
}
