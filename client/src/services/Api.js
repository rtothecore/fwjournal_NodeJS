import axios from 'axios'

export default() => {
  return axios.create({
    // baseURL: 'http://192.168.0.73:8081'
    baseURL: 'http://192.168.66.20:8081'
    // baseURL: 'https://192.168.0.73:443'
  })
}
