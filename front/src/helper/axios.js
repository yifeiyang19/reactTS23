import axios from 'axios'
import { BASE_URL } from '../constants/constants'

const instance = axios.create()

window.axiosCancel = []

instance.interceptors.request.use(req => {
  req.withCredentials = true
  req.url = BASE_URL + req.url

  req.cancelToken = new axios.CancelToken(cancel=> {
    window.axiosCancel.push({
      cancel
    })
  })

  return req
})

instance.interceptors.response.use(res => {
  if (res.status === 200) {
    return res
  }
  return Promise.reject(res)
})

export default instance
