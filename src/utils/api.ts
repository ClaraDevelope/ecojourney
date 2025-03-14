const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'

interface FetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: Record<string, unknown> | FormData
  token?: string
}

export const apiFetch = async (
  endpoint: string,
  options: FetchOptions = {}
) => {
  const { method = 'GET', body, token } = options
  const isFormData = body instanceof FormData

  try {
    console.log(
      `🛂 [apiFetch] Haciendo ${method} a ${BACKEND_URL}/api${endpoint}`
    )
    console.log(`📜 [apiFetch] Token recibido:`, token)

    const res = await fetch(`${BACKEND_URL}/api${endpoint}`, {
      method,
      headers: {
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: body ? (isFormData ? body : JSON.stringify(body)) : undefined
    })

    const responseData = await res.json().catch(() => ({}))
    console.log('📩 [apiFetch] Respuesta del backend:', responseData)

    if (!res.ok) {
      throw new Error(responseData.error || 'Error en la solicitud')
    }

    return responseData
  } catch (error) {
    console.error(`🚨 Error en API (${method} ${endpoint}):`, error)
    throw error
  }
}
