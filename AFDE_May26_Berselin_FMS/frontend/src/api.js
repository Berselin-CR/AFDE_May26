import axios from 'axios'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
})

api.interceptors.request.use(config => {
  const role = sessionStorage.getItem('role') || ''
  config.headers['X-Role'] = role
  return config
})

export default api
