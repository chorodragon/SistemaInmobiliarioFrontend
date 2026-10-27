export type Rol = 'comprador' | 'vendedor' | 'agente'
export type Parte = 'comprador' | 'vendedor'
export type Estado = 'pendiente' | 'aceptado' | 'cancelado'

export interface Sesion {
  id: number
  nombre: string
  apellido: string
  rol: Rol
}

export interface Catalogo {
  id: number
  nombre: string
  descripcion: string | null
}

export interface Agente {
  id: number
  codigo: string
  nombre: string
  apellido: string
  email: string | null
}

export interface Detalle {
  idCaracteristica: number
  caracteristica: string
  descripcion: string
}

export interface Inmueble {
  id: number
  direccion: string
  precio: number
  metraje: number
  disponibilidad: number
  idTipoInmueble: number
  tipoInmueble: string
  idVendedor: number
  vendedor: string
  idAgente: number
  agente: string
  detalles: Detalle[] | null
}

export interface Oferta {
  id: number
  monto: number
  tiempo: string | null
  estado: Estado
  fecha: string
  idComprador: number
  comprador: string
  idInmueble: number
  inmueble: string
  idTipoPago: number
  tipoPago: string
}

export interface ContraOferta {
  id: number
  monto: number
  tiempo: string | null
  prioridad: number
  estado: Estado
  origen: Parte
  fecha: string
  idOferta: number
  idTipoPago: number
  tipoPago: string
}

export interface Contrato {
  id: number
  fecha: string
  monto: number
  estado: Estado
  idOferta: number
  idInmueble: number
  inmueble: string
  idComprador: number
  comprador: string
  idVendedor: number
  vendedor: string
  idAgente: number
  agente: string
  idTipoPago: number
  tipoPago: string
}

export interface Prestamo {
  id: number
  banco: string
  monto: number
  plazo: string
  intereses: number
  estado: Estado
  idContrato: number
}

export interface Venta {
  idContrato: number
  fecha: string
  monto: number
  idInmueble: number
  inmueble: string
  idComprador: number
  comprador: string
}

export interface Notificacion {
  id: number
  mensaje: string
  fecha: string
  leida: number
  idUsuario: number
  idAgente: number
}

export interface Id {
  id: number
}

async function solicitud<T>(metodo: string, ruta: string, cuerpo?: unknown): Promise<T> {
  const resp = await fetch('/api' + ruta, {
    method: metodo,
    headers: cuerpo === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: cuerpo === undefined ? undefined : JSON.stringify(cuerpo, (_, v) => (v === '' ? null : v)),
  })
  const texto = await resp.text()
  let datos = null
  try {
    datos = texto ? JSON.parse(texto) : null
  } catch {
    datos = null
  }
  if (!resp.ok) {
    throw new Error(datos?.mensaje ?? `Error ${resp.status}`)
  }
  return datos as T
}

export const api = {
  get: <T,>(ruta: string) => solicitud<T>('GET', ruta),
  post: <T,>(ruta: string, cuerpo?: unknown) => solicitud<T>('POST', ruta, cuerpo ?? {}),
  put: <T,>(ruta: string, cuerpo?: unknown) => solicitud<T>('PUT', ruta, cuerpo ?? {}),
}

export function query(params: Record<string, string | number | null | undefined>): string {
  const p = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) {
    if (v !== '' && v !== null && v !== undefined) p.append(k, String(v))
  }
  const s = p.toString()
  return s ? '?' + s : ''
}
