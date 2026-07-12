const BASE_URL = 'http://localhost:5000/api'

const getToken = () => {
  try {
    const u = JSON.parse(localStorage.getItem('auth_user'))
    return u?.token || ''
  } catch {
    return ''
  }
}

const headers = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`,
})

const handle = async (res) => {
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Request failed')
  return data
}

const api = {
  get:    (path)        => fetch(`${BASE_URL}${path}`, { method: 'GET',    headers: headers() }).then(handle),
  post:   (path, body)  => fetch(`${BASE_URL}${path}`, { method: 'POST',   headers: headers(), body: JSON.stringify(body) }).then(handle),
  put:    (path, body)  => fetch(`${BASE_URL}${path}`, { method: 'PUT',    headers: headers(), body: JSON.stringify(body) }).then(handle),
  patch:  (path, body)  => fetch(`${BASE_URL}${path}`, { method: 'PATCH',  headers: headers(), body: JSON.stringify(body) }).then(handle),
  delete: (path)        => fetch(`${BASE_URL}${path}`, { method: 'DELETE', headers: headers() }).then(handle),
}

export default api
