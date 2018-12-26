import Api from '@/services/Api'

export default {
  fetchUser (id) {
    return Api().get('user/' + id)
  },

  updateUserAgeSex (params) {
    return Api().put('userAgeSex/' + params.id, params)
  },

  fetchUserByEmail (params) {
    return Api().get('user/byEmail/' + params.email, params)
  },

  createNewUser (params) {
    return Api().post('addNewUser', params)
  },

  login (params) {
    return Api().put('login', params)
  },

  findPassword (params) {
    return Api().get('findPassword/' + params.id, params)
  },

  checkPasswordExpired (params) {
    return Api().get('checkPasswordExpired/' + params.id, params)
  },

  updateUserPassword (params) {
    return Api().put('updateUserPassword', params)
  }
}
