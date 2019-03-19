import Api from '@/services/Api'

export default {
  fetchCropNameByCropCode (params) {
    return Api().get('dc/getCN/' + params.cropCode, params)
  },

  fetchDcsByScode (params) {
    return Api().get('dcByScode/' + params.sCode, params)
  },

  fetchScsByDcode (params) {
    return Api().get('scByDcode/' + params.dCode, params)
  }
}
