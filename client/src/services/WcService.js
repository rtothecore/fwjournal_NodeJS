import Api from '@/services/Api'

export default {
  fetchTextByCode (params) {
    return Api().get('wc/getText/' + params.code, params)
  },

  fetchTextByCropCode (params) {
    return Api().get('wc/getTxtByCC/' + params.cropCode, params)
  }
}
