<template>
    <div id="calendar" style="height:900px; width:900px;">
	    <full-calendar :config="config" :events="events"/>
      <journalModal></journalModal>
    </div>
</template>

<script>
    // import moment from 'moment'
    import {bus} from '../main'
    import JournalService from '@/services/JournalService'
    import WcService from '@/services/WcService'
    import ScService from '@/services/ScService'
    import LandService from '@/services/LandService'
    export default {
  created () {
        // this.$refs.calendar.fireMethod('changeView', view)
        this.getJournal()
  },
  data () {
        return {
          userId: '5af4fa281a1ee4261039149f',
          events: [
            /*
            {
              title: 'test',
              allDay: true,
              start: moment(),
              end: moment().add(1, 'd'),
              url: 'http://www.daum.net'
            },
            {
              title: 'another test',
              start: moment().add(2, 'd'),
              end: moment().add(2, 'd').add(2, 'h')
            }
            */
          ],
          config: {
            // height: 500,
            aspectRatio: 1.5,
            locale: 'ko',
            defaultView: 'month',
            eventRender: function (event, element) {
              // console.log(event)
            },
            dayClick (date, event, view) {
              // console.log(date.format())
              bus.$emit('dialog', date.format())
            }
          }
        }
  },
  mounted () {
        bus.$on('toJournal', function (value) {
          location.reload()
        })
  },
  methods: {
        async getJournal () {
          const response = await JournalService.fetchJournals({
            userId: this.userId
          })
          for (var i = 0; i < response.data.length; i++) {
            var tmpEvent = {}
            const response2 = await WcService.fetchTextByCode({
              code: response.data[i].workCode
            })
            const response3 = await ScService.fetchCropNameByCropCode({
              cropCode: response.data[i].workCode.substring(0, 11)
            })
            const response4 = await LandService.fetchNameByLandId({
              landId: response.data[i].landId
            })
            tmpEvent.title = response4.data[0].name + ' - ' + response3.data[0].text + '\n' + response2.data[0].text + ' - ' + response.data[i].workContent
            tmpEvent.start = response.data[i].date
            tmpEvent.end = response.data[i].date
            this.events.push(tmpEvent)
          }
        }
  }
}
</script>
