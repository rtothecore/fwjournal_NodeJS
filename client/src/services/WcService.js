import Api from '@/services/Api'

export default {
  fetchWorkCodeById (params) {
    return Api().get('wc/getWCById/' + params.id, params)
  },

  fetchIdByWorkCode (params) {
    return Api().get('wc/getIdByWC/' + params.code, params)
  },

  fetchTextByCode (params) {
    return Api().get('wc/getText/' + params.code, params)
  },

  fetchTextByCropCode (params) {
    return Api().get('wc/getTxtByCC/' + params.cropCode, params)
  }
}
