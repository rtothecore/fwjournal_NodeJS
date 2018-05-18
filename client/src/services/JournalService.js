import Api from '@/services/Api'

export default {
  updateJournal (params) {
    return Api().put('journals/' + params.id, params)
  },

  deleteJournal (id) {
    return Api().delete('journals/' + id)
  },

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
