import Api from '@/services/Api'

export default {
  fetchMcsByBCode (params) {
    return Api().get('mc/' + params.bCode, params)
  },

  // NEW
  fetchTextByMCode (params) {
    return Api().get('mcByMcode/' + params.mCode, params)
  },

  fetchBcsByMcode (params) {
    return Api().get('bcByMcode/' + params.mCode, params)
  }
}
