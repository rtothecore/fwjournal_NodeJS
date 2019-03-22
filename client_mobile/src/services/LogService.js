import Api from '@/services/Api'

export default {
  logError (params) {
    return Api().post('logError', params)
  }
}
