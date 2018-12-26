import Api from '@/services/Api'

export default {
  fetchItemsByWcode (params) {
    return Api().get('itemsByWcode/' + params.userId + '/' + params.wCode, params)
  },

  createItem (params) {
    return Api().post('item', params)
  },

  fetchItems (params) {
    return Api().get('items/' + params.userId, params)
  },

  fetchItem (params) {
    return Api().get('item/' + params.id, params)
  },

  updateItem (params) {
    return Api().put('item/' + params.id, params)
  },

  deleteItem (id) {
    return Api().delete('item/' + id)
  },

  fetchItemsBy3 (params) {
    return Api().get('items/searchBy3/' + params.startDate + '/' + params.endDate + '/' + params.item, params)
  },

  fetchItemsByDateNUserId (params) {
    return Api().get('items/' + params.startDate + '/' + params.endDate + '/' + params.userId, params)
  },

  fetchItemsByYMUserId (params) {
    return Api().get('items/searchByYMUserId/' + params.ym + '/' + params.userId, params)
  }
}
