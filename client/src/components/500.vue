<template>
  <v-layout align-center justify-center fill-height flex-column>
    <div
      id="e3"
      :style=mainStyle
      class="grey lighten-3"      
    >
      <v-toolbar
        color="blue"
        dark
      >
        <v-icon>fas fa-exclamation-triangle</v-icon>
        <v-toolbar-title>500 Internal Server Error</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>

      <v-card style="height:88%">
        <v-card-title primary-title>
          <div>
            <h3 class="headline mb-0">500 Internal Server Error</h3>
            <br/><br/>
            <div> 
              <h4>
              서버 장애가 발생하였습니다.<br/><br/>
              장애로 인해 서비스가 불가한 점 사과드립니다.<br/><br/>
              조속한 조치로 서비스가 가능하도록 하겠습니다.
              </h4>
            </div>
          </div>
        </v-card-title>
      </v-card>
    </div>
  </v-layout>
</template>

<script>
const { detect } = require('detect-browser')
const browser = detect()
export default {
  data () {
    return {
      mainStyle: 'width: 500px; height: 520px; margin: auto;'
    }
  },
  mounted () {
    this.$validator.localize('ko', this.dictionary)
    // https://www.npmjs.com/package/detect-browser
    if (browser) {
      // console.log(browser.name)
      // console.log(browser.version)
      // console.log(browser.os)
      if (browser.name === 'chrome') {
        this.mainStyle = 'width: 500px; height: 520px; margin: auto;'
      } else if (browser.name === 'ie') {
        this.mainStyle = 'width: 500px; height: 520px; margin-bottom: auto;'
      }
    }
  },
  methods: {
  },
  computed: {
  }
}
</script>