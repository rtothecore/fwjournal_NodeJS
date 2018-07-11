import Api from '@/services/Api'

export default {
  fetchUser (id) {
    return Api().get('user/' + id)
  },

  createNewUser (params) {
    return Api().post('user', params)
  },

  updateUserAgeSex (params) {
    return Api().put('userAgeSex/' + params.id, params)
  },

  updateUserPassword (params) {
    return Api().put('userPassword/' + params.id, params)
  },

  fetchUserByEmail (params) {
    return Api().get('user/byEmail/' + params.email, params)
  },

  fetchUserByEmailNPw (params) {
    return Api().get('user/' + params.email + '/' + params.pw, params)
  }
}
