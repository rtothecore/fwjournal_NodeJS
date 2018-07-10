import Api from '@/services/Api'

export default {
  fetchUser (id) {
    return Api().get('user/' + id)
  },

  updateUserAgeSex (params) {
    return Api().put('userAgeSex/' + params.id, params)
  },

  updateUserPassword (params) {
    return Api().put('userPassword/' + params.id, params)
  },

  fetchUserByEmailNPw (params) {
    return Api().get('user/' + params.email + '/' + params.pw, params)
  }
}
