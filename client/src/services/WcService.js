import Api from '@/services/Api'

export default {
  fetchDistinctBCPText (params) {
    return Api().get('wc/getBCP', params)
  },

  fetchBCPDataByText (params) {
    return Api().get('wc/getBCPDetail/' + params.bcpText, params)
  },

  fetchDistinctBALText (params) {
    return Api().get('wc/getBAL', params)
  },

  fetchBALDataByText (params) {
    return Api().get('wc/getBALDetail/' + params.balText, params)
  },

  createWc (params) {
    return Api().post('wc', params)
  },

  // NEW
  fetchTextByCropCode (params) {
    return Api().get('wc/getTxtByCC2/' + params.cropCode, params)
  },

  fetchTextByCropCodeAsItem (params) {
    return Api().get('wc/getTxtByCC3/' + params.cropCode, params)
  },

  fetchTextByCcode (params) {
    return Api().get('wc/getTextByCcode/' + params.code, params)
  },

  fetchOneTextByCcode (params) {
    return Api().get('wc/getOneTextByCcode/' + params.code, params)
  },

  fetchWorkCodesAsItem (params) {
    return Api().get('wc/getWCsAsItem', params)
  },

  fetchMaxWcs (params) {
    return Api().get('wc/getMaxWcs', params)
  },

  fetchSameWc (params) {
    return Api().get('wc/getSameWc/' + params.workTypeText, params)
  }
}
