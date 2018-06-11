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
  },

  fetchByBCodeMCodeSCode (params) {
    return Api().get('wc/' + params.bCode + '/' + params.mCode + '/' + params.sCode, params)
  },

  createWc (params) {
    return Api().post('wc', params)
  }
}
