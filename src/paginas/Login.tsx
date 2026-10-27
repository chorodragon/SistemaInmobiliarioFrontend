import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api, type Sesion } from '../api'
import { LOGO, useFormulario } from '../util'
import MensajeError from '../componentes/MensajeError'

export default function Login({ onLogin }: { onLogin: (s: Sesion) => void }) {
  const [form, cambiar] = useFormulario({ usuario: '', pass: '', tipo: 'comprador' })
  const [error, setError] = useState('')
  const navegar = useNavigate()

  const enviar = (e: FormEvent) => {
    e.preventDefault()
    setError('')
    api
      .post<Sesion>('/login', form)
      .then((s) => {
        onLogin(s)
        navegar('/')
      })
      .catch((e) => setError(e.message))
  }

  return (
    <form className="tarjeta angosta" onSubmit={enviar}>
      <img className="logo-login" src={LOGO} alt="Sistema Inmobiliario" />
      <h1>Iniciar sesión</h1>
      <label>
        Usuario
        <input name="usuario" value={form.usuario} onChange={cambiar} required />
      </label>
      <label>
        Contraseña
        <input name="pass" type="password" value={form.pass} onChange={cambiar} required />
      </label>
      <label>
        Ingresar como
        <select name="tipo" value={form.tipo} onChange={cambiar}>
          <option value="comprador">Comprador</option>
          <option value="vendedor">Vendedor</option>
          <option value="agente">Agente</option>
        </select>
      </label>
      <MensajeError mensaje={error} />
      <button type="submit">Ingresar</button>
      <p>
        ¿Eres cliente nuevo? <Link to="/registro">Regístrate</Link>
      </p>
    </form>
  )
}
