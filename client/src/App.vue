<template>
  <v-app id="app" class="elevation-1" top-toolbar left-fixed-sidebar sidebar-under-toolbar>

    <v-navigation-drawer v-model="sidebar" :clipped="true" app>
      <v-list>
        <v-list-tile @click="moveTo('/')">
          <v-list-tile-action>
            <v-icon>home</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>홈</v-list-tile-title>
        </v-list-tile>        

          <v-list-group
            no-action
            sub-group
          >
            <v-list-tile slot="activator">
              <v-list-tile-title>검색</v-list-tile-title>
            </v-list-tile>

            <v-list-tile
              v-for="(search, i) in menuSearch"
              :key="i"
              @click="moveTo(search[2])"
            >
              <v-list-tile-title v-text="search[0]"></v-list-tile-title>
              <v-list-tile-action>
                <v-icon v-text="search[1]"></v-icon>
              </v-list-tile-action>
            </v-list-tile>
          </v-list-group>

          <v-list-group
            sub-group
            no-action
          >
            <v-list-tile slot="activator">
              <v-list-tile-title>예측</v-list-tile-title>
            </v-list-tile>

            <v-list-tile
              v-for="(predict, i) in menuPredict"
              :key="i"
              @click="moveTo(predict[2])"
            >
              <v-list-tile-title v-text="predict[0]"></v-list-tile-title>
              <v-list-tile-action>
                <v-icon v-text="predict[1]"></v-icon>
              </v-list-tile-action>
            </v-list-tile>
          </v-list-group>

          <v-list-group
            sub-group
            no-action
          >
            <v-list-tile slot="activator">
              <v-list-tile-title>통계</v-list-tile-title>
            </v-list-tile>

            <v-list-tile
              v-for="(stat, i) in menuStats"
              :key="i"
              @click="moveTo(stat[2])"
            >
              <v-list-tile-title v-text="stat[0]"></v-list-tile-title>
              <v-list-tile-action>
                <v-icon v-text="stat[1]"></v-icon>
              </v-list-tile-action>
            </v-list-tile>
          </v-list-group>

          <v-list-group
            sub-group
            no-action
          >
            <v-list-tile slot="activator">
              <v-list-tile-title>설정</v-list-tile-title>
            </v-list-tile>

            <v-list-tile
              v-for="(config, i) in menuConfig"
              :key="i"
              @click="moveTo(config[2])"
            >
              <v-list-tile-title v-text="config[0]"></v-list-tile-title>
              <v-list-tile-action>
                <v-icon v-text="config[1]"></v-icon>
              </v-list-tile-action>
            </v-list-tile>
          </v-list-group>
        
      </v-list>
    </v-navigation-drawer>

    <!-- https://pt.stackoverflow.com/questions/293349/background-image-com-vuetify -->
    <v-toolbar class="back" app>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-xs-only">

        <v-btn flat icon color="white" @click="logout()" v-show="btnLogOutSeen">
          <v-icon>fas fa-sign-out-alt</v-icon>
        </v-btn>

        <v-btn          
          flat
          v-for="item in menuItems"
          :key="item.title"
          :to="item.path"
          :class="item.class">
          <!--
          <v-icon left dark>{{ item.icon }}</v-icon>
          {{ item.title }}
          -->
        </v-btn>

        <v-menu open-on-hover top offset-y>
          <v-btn
            slot="activator"
            flat
            class="searchImg"
          >            
          </v-btn>

          <v-list>
            <v-list-tile
              v-for="(item, index) in searchSubMenuItems"
              :key="index"
              @click="moveTo(item.path)"
            >
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>

        <v-menu open-on-hover top offset-y>
          <v-btn
            slot="activator"
            flat
            class="predictImg"
          >            
          </v-btn>

          <v-list>
            <v-list-tile
              v-for="(item, index) in predictSubMenuItems"
              :key="index"
              @click="moveTo(item.path)"
            >
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>

        <v-menu open-on-hover top offset-y>
          <v-btn
            slot="activator"
            flat
            class="configImg"
          >            
          </v-btn>

          <v-list>
            <v-list-tile
              v-for="(item, index) in configSubMenuItems"
              :key="index"
              @click="moveTo(item.path)"
            >
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>

        <v-menu open-on-hover top offset-y>
          <v-btn
            slot="activator"
            flat
            class="statsImg"
          >           
          </v-btn>

          <v-list>
            <v-list-tile
              v-for="(item, index) in statsSubMenuItems"
              :key="index"
              @click="moveTo(item.path)"
            >
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>

      </v-toolbar-items>
    </v-toolbar>
    
    <v-content v-bind:class="{ loginBack: isBackImgActive }">
      <router-view></router-view>
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
          (690-833) 제주특별자치도 제주시 고마로88(일도2동 378-19) 향천빌딩 2층<br/>
          TEL.064-753-6677   FAX.064-753-6676   MAIL.eziceo@gmail.com<br/>
          Copyright ⓒ EZ Information technology co.,Ltd. All right Reseved.
        </v-card-actions>
      </v-card>
    </v-footer>
  </v-app>
  
</template>
<script>
  export default {
    data () {
      return {
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
      if (this.$mq === 'mobile') {  // 모바일 기기로 접속할 경우 아래 주소로 리다이렉트
        window.location.href = 'http://192.168.0.73:8084'
      }
    },
    updated () {
      if (!this.$session.exists()) {
        this.btnLogOutSeen = false
        this.isBackImgActive = true
        // console.log(this.$router.currentRoute.path)
        if (this.$router.currentRoute.path === '/suStep1' ||
            this.$router.currentRoute.path === '/suStep2' ||
            this.$router.currentRoute.path === '/suStep3' ||
            this.$router.currentRoute.path === '/suStep4') {
          // console.log('except!')
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
        // console.log(val)
        this.$router.push(val)
      }
    }
  }
</script>