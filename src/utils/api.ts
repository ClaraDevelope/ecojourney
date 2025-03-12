const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'

interface FetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: Record<string, unknown>
  token?: string
}

export const apiFetch = async (
  endpoint: string,
  options: FetchOptions = {}
) => {
  const { method = 'GET', body, token } = options

  try {
    const res = await fetch(`${BACKEND_URL}/api${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: body ? JSON.stringify(body) : undefined
    })

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}))
      throw new Error(errorData.error || 'Error en la solicitud')
    }

    return await res.json()
  } catch (error) {
    console.error(`🚨 Error en API (${method} ${endpoint}):`, error)
    throw error
  }
}
