import Api from '@/services/Api'

export default {
  fetchJournalsBy4 (params) {
    return Api().get('journals/searchBy4/' + params.startDate + '/' + params.endDate + '/' + params.workType + '/' + params.workContent, params)
  },

  fetchJournalsByDate (params) {
    return Api().get('journals/' + params.startDate + '/' + params.endDate, params)
  },

  fetchJournals (params) {
    return Api().get('journals/' + params.userId, params)
  },

  createJournals (params) {
    return Api().post('journals', params)
  }
}
