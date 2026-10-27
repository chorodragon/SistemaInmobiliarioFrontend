import { useEffect, useState, type ChangeEvent } from 'react'
import type { Catalogo, Sesion } from './api'

export const LOGO = '/logo.png'

export const moneda = (n: number | null | undefined) =>
  n == null ? '' : '$' + Number(n).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export const dias = (t: string | null | undefined) => (t ? `${t} días` : '—')

export const esCredito = (tiposPago: Catalogo[] | null, idTipoPago: string) =>
  tiposPago?.find((t) => String(t.id) === idTipoPago)?.nombre === 'Credito'

export const fecha = (f: string | null | undefined) => (f ? new Date(f).toLocaleString('es') : '')

export function leerSesion(): Sesion | null {
  try {
    return JSON.parse(localStorage.getItem('sesion') ?? 'null')
  } catch {
    return null
  }
}

export function guardarSesion(s: Sesion | null) {
  if (s) localStorage.setItem('sesion', JSON.stringify(s))
  else localStorage.removeItem('sesion')
}

export function useDatos<T>(cargar: () => Promise<T>, deps: unknown[]) {
  const [datos, setDatos] = useState<T | null>(null)
  const [error, setError] = useState('')
  const [version, setVersion] = useState(0)
  useEffect(() => {
    let vigente = true
    setError('')
    cargar()
      .then((d) => vigente && setDatos(d))
      .catch((e) => vigente && setError(e.message))
    return () => {
      vigente = false
    }
  }, [...deps, version])
  return { datos, error, recargar: () => setVersion((v) => v + 1) }
}

export function useFormulario<T extends Record<string, string>>(inicial: T) {
  const [valores, setValores] = useState(inicial)
  const cambiar = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setValores((v) => ({ ...v, [e.target.name]: e.target.value }))
  return [valores, cambiar, setValores] as const
}
