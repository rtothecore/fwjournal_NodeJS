<template>
  <v-app id="app" class="elevation-1" top-toolbar>

    <!-- https://pt.stackoverflow.com/questions/293349/background-image-com-vuetify -->
    <!-- <v-toolbar class="back" app> -->
    <v-toolbar app>
      <h2 style="color:#ffffff"><strong>{{ mainTitle }}</strong></h2>
      <v-spacer></v-spacer>
      <!-- <v-toolbar-items class="hidden-xs-only"> -->
        <v-toolbar-items>

        <v-btn flat icon color="white" @click="moveTo0('/configPrivate', 0)" v-show="btnLogOutSeen">
          <v-icon>fas fa-user-circle</v-icon>
        </v-btn>

        <v-btn flat icon color="white" @click="moveTo0('/configLand', 0)" v-show="btnLogOutSeen">
          <v-icon>fas fa-hands</v-icon>
        </v-btn>

        <v-btn flat icon color="white" @click="logout()" v-show="btnLogOutSeen">
          <v-icon>fas fa-sign-out-alt</v-icon>
        </v-btn>

      </v-toolbar-items>
    </v-toolbar>
    
    <v-content v-bind:class="{ loginBack: isBackImgActive }">
      <router-view style="width: 100%;"></router-view>
    </v-content>        

    <v-footer
      dark
      height="auto">
      <v-card
        class="flex"
        flat
        tile
      >
        <v-card-actions class="grey darken-3 justify-center">
          (690-833) 제주특별자치도 제주시 고마로88 향천빌딩 2층<br/>
          TEL.064-753-6677   FAX.064-753-6676   MAIL.eziceo@gmail.com<br/>
          Copyright ⓒ EZ Information technology co.,Ltd. All right Reseved.
        </v-card-actions>
      </v-card>
    </v-footer>
  </v-app>
  
</template>
<script>
import LandService from '@/services/LandService'
export default {
  data () {
    return {
      mainTitle: '영농일지',
      landItems: [],
      userId: '',
      current4: -1,
      current3: -1,
      current2: -1,
      current: -1,
      groupConfigOpen: false,
      groupStatsOpen: false,
      groupPredictOpen: false,
      groupSearchOpen: false,
      menuSearch: [
        ['작업검색', 'search', '/search'],
        ['자재검색', 'find_in_page', '/searchItem']
      ],
      menuPredict: [
        ['농작업일정', 'work', '/predict'],
        ['자재구입일정', 'shopping_basket', '/predictItem']
      ],
      menuStats: [
        ['수입/지출 분석', 'assessment', '/account'],
        ['작업시간', 'alarm', '/workTime'],
        ['환경모니터링', 'settings_input_antenna', '/environment']
      ],
      menuConfig: [
        ['개인정보', 'face', '/configPrivate'],
        ['농장정보', 'landscape', '/configLand']
      ],
      //
      isBackImgActive: false,
      btnLogOutSeen: false,
      appTitle: '영농일지',
      sidebar: true,
      menuItems: [
        {title: '영농일지', path: '/', icon: 'assignment_turned_in', class: 'homeImg'}
        /* {title: '일지검색', path: '/search', icon: 'assignment', class: 'searchImg'}, */
        /* {title: '자재검색', path: '/searchItem', icon: 'assignment', class: 'searchImg'} */
        /* {title: '작업예측', path: '/predict', icon: 'assignment_late', class: 'predictImg'} */
        /* {title: '통계', path: '/stats', icon: 'assessment'}, */
        /* {title: '설정', path: '/config', icon: 'build', class: 'setImg'} */
      ],
      searchSubMenuItems: [
        { title: '일지검색', path: '/search' },
        { title: '자재검색', path: '/searchItem' }
      ],
      predictSubMenuItems: [
        { title: '농작업일정', path: '/predict' },
        { title: '자재구입일정', path: '/predictItem' }
      ],
      configSubMenuItems: [
        { title: '개인정보', path: '/configPrivate' },
        { title: '농장정보', path: '/configLand' }
      ],
      statsSubMenuItems: [
        { title: '수입/지출분석', path: '/account' },
        { title: '작업시간', path: '/workTime' },
        { title: '환경모니터링', path: '/environment' }
      ]
    }
  },
  created () {
    // https://www.npmjs.com/package/vue-mq
    /*
    if (this.$mq === 'mobile') {  // 모바일 기기로 접속할 경우 아래 주소로 리다이렉트
      window.location.href = 'http://192.168.0.73:8084'
    }
    */
  },
  updated () {
    if (!this.$session.exists()) {
      this.btnLogOutSeen = false
      this.isBackImgActive = true
      // console.log(this.$router.currentRoute.path)
      if (this.$router.currentRoute.path === '/suStep1' ||
          this.$router.currentRoute.path === '/suStep2' ||
          this.$router.currentRoute.path === '/suStep3' ||
          this.$router.currentRoute.path === '/suStep4' ||
          this.$router.currentRoute.path === '/500') {
        // console.log('except!')
      } else {
        this.$router.push('/login')
      }
    } else {
      this.btnLogOutSeen = true
      this.isBackImgActive = false
      // console.log('i am in move')
      this.userId = this.$session.get('userId')
      if (this.$router.currentRoute.path !== '/configLand') {
        this.fetchMyLandData()
      }
      // alert('농장정보가 없습니다')
      // 각 페이지에 따라 메인타이틀이 바뀜
      switch (this.$router.currentRoute.path) {
        case '/' :
          this.mainTitle = '영농일지'
          break
        case '/search' :
          this.mainTitle = '작업일지 검색'
          break
        case '/searchItem' :
          this.mainTitle = '자재관리 검색'
          break
        case '/predict' :
          this.mainTitle = '농작업일정 예측'
          break
        case '/predictItem' :
          this.mainTitle = '자재구입일정 예측'
          break
        case '/account' :
          this.mainTitle = '수입/지출 분석'
          break
        case '/workTime' :
          this.mainTitle = '작업시간'
          break
        case '/environment' :
          this.mainTitle = '환경모니터링'
          break
        case '/configPrivate' :
          this.mainTitle = '개인정보'
          break
        case '/configLand' :
          this.mainTitle = '농장정보'
          break
      }
    }
  },
  methods: {
    async fetchMyLandData () {
      const response = await LandService.fetchLands({
        userId: this.userId
      })
      this.landItems = response.data.lands
      if (this.landItems.length > 0) {
      } else {
        this.$swal({
          title: '농장정보 입력페이지로 이동하시겠습니까?',
          text: '농장정보를 입력해야 정상적인 일지작성이 가능합니다.',
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: '네, 이동합니다',
          cancelButtonText: '취소합니다'
        }).then((result) => {
          if (result.value) {
            this.$router.push('/configLand')
            /*
            this.deleteJournal(item._id)
            this.journals.splice(index, 1)
            this.$swal(
              '삭제했습니다!',
              '일지가 삭제되었습니다',
              'success'
            )
            */
          }
        })
      }
    },
    logout: function () {
      this.$session.destroy()
      this.btnLogOutSeen = false
      this.isBackImgActive = true
      this.$router.push('/login')
    },
    moveTo0: function (val, idx) {
      if (val === '/') {
        this.groupConfigOpen = false
        this.groupStatsOpen = false
        this.groupPredictOpen = false
        this.groupSearchOpen = false
      }
      this.current = -1
      this.current2 = -1
      this.current3 = -1
      this.current4 = -1
      this.$router.push(val)
    },
    moveTo: function (val, idx) {
      this.current = idx
      this.current2 = -1
      this.current3 = -1
      this.current4 = -1
      this.$router.push(val)
    },
    moveTo2: function (val, idx) {
      this.current = -1
      this.current2 = idx
      this.current3 = -1
      this.current4 = -1
      this.$router.push(val)
    },
    moveTo3: function (val, idx) {
      this.current = -1
      this.current2 = -1
      this.current3 = idx
      this.current4 = -1
      this.$router.push(val)
    },
    moveTo4: function (val, idx) {
      this.current = -1
      this.current2 = -1
      this.current3 = -1
      this.current4 = idx
      this.$router.push(val)
    }
  }
}
</script>