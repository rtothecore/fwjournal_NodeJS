import Api from '@/services/Api'

export default {
  fetchTodayWeather (params) {
    return Api().get('ForecastGrib/' + params.nx + '/' + params.ny, params)
  },
  fetchWeatherForecast (params) {
    return Api().get('ForecastSpaceData/' + params.nx + '/' + params.ny, params)
  },
  fetchAirData (params) {
    return Api().get('Airdata/' + params.tmX + '/' + params.tmY, params)
  }
}
