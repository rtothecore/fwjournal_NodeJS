<template>  
  <!-- For Mobile -->
  <v-app>
    <v-toolbar class="backMobile" app>
      <v-spacer></v-spacer>
        <v-btn flat icon color="white" @click="logout()" v-show="btnLogOutSeen">
          <v-icon>fas fa-sign-out-alt</v-icon>
        </v-btn>
    </v-toolbar>
    <!-- <v-content class="loginBackMobile"> -->
    <v-content v-bind:class="{ loginBackMobile: isBackImgActive }">
      <router-view></router-view>
    </v-content>
  </v-app>

</template>
<script>
  export default {
    data () {
      return {
        isBackImgActive: false,
        btnLogOutSeen: false,
        appTitle: '영농일지',
        sidebar: false,
        menuItems: [
          {title: '영농일지', path: '/', icon: 'assignment_turned_in', class: 'homeImg'},
          {title: '일지검색', path: '/search', icon: 'assignment', class: 'searchImg'},
          {title: '작업예측', path: '/predict', icon: 'assignment_late', class: 'predictImg'},
          /* {title: '통계', path: '/stats', icon: 'assessment'}, */
          {title: '설정', path: '/config', icon: 'build', class: 'setImg'}
        ],
        subMenuItems: [
          { title: '작업시간', path: '/workTime' },
          { title: '환경모니터링', path: '/environment' }
        ]
      }
    },
    created () {
    },
    updated () {
      if (!this.$session.exists()) {
        this.btnLogOutSeen = false
        this.isBackImgActive = true
        if (this.$router.currentRoute.path === '/suStep1' ||
            this.$router.currentRoute.path === '/suStep2' ||
            this.$router.currentRoute.path === '/suStep3' ||
            this.$router.currentRoute.path === '/suStep4') {
        } else {
          this.$router.push('/login')
        }
      } else {
        this.btnLogOutSeen = true
        this.isBackImgActive = false
      }
    },
    methods: {
      logout: function () {
        this.$session.destroy()
        this.btnLogOutSeen = false
        this.isBackImgActive = true
        this.$router.push('/login')
      },
      moveTo: function (val) {
        console.log(val)
        this.$router.push(val)
      }
    }
  }
</script>