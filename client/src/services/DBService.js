import Api from '@/services/Api'

export default {
  checkDB (params) {
    return Api().get('checkDB', params)
  }
}
