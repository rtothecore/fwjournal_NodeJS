<template>
  <v-layout align-center justify-center fill-height flex-column>
    <div
      id="e3"
      style="width: 95%; height: 480px; margin: auto;"
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
              재해가 발생하여 서비스 이용이 불가능합니다.<br/><br/>
              재해 복구에 힘을 쏟아 빠른시간 내에 서비스를 이용하실 수 있도록
              서비스 복구에 최선을 다하겠습니다.<br/><br/>
              이용에 불편을 드리게 되어 대단히 죄송합니다.<br/><br/><br/>
              고객센터 : 064-753-6677
              </h4>
            </div>
          </div>
        </v-card-title>
      </v-card>
    </div>
  </v-layout>
</template>

<script>
export default {
  data () {
    return {
      mainStyle: 'width: 500px; height: 520px; margin: auto;'
    }
  },
  mounted () {
    this.$validator.localize('ko', this.dictionary)
  },
  methods: {
  },
  computed: {
  }
}
</script>