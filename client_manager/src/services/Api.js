import axios from 'axios'

export default() => {
  return axios.create({
    // baseURL: 'http://59.8.37.86:9081'
    // baseURL: 'http://192.168.0.73:9081'
    baseURL: 'http://192.168.0.73:8081'
    // baseURL: 'https://192.168.0.73:443'
  })
}
