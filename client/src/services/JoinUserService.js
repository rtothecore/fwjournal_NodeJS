import Api from '@/services/Api'

export default {
  checkDuplicateUser (params) {
    return Api().get('joinUser/' + params.id)
  }
}
