import Api from '@/services/Api'

export default {
  fetchCropNameByCropCode (params) {
    return Api().get('sc/getCN/' + params.cropCode, params)
  },

  // NEW
  fetchSByM (params) {
    return Api().get('scByMcode/' + params.mCode, params)
  },

  fetchMcsByScode (params) {
    return Api().get('mcByScode/' + params.sCode, params)
  },

  fetchTextBySCode (params) {
    return Api().get('scByScode/' + params.sCode, params)
  }
}
