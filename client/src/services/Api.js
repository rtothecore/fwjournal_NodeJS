import axios from 'axios'

export default() => {
  return axios.create({
    // baseURL: 'http://localhost:8081'
    baseURL: 'https://192.168.0.73:443'
  })
}
