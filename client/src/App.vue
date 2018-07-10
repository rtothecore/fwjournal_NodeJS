<template>
  <v-app>
    <v-navigation-drawer v-model="sidebar" app>
      <v-list>
        <v-list-tile
          v-for="item in menuItems"
          :key="item.title"
          :to="item.path">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>{{ item.title }}</v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <v-toolbar app>
      <span class="hidden-sm-and-up">
        <v-toolbar-side-icon @click="sidebar = !sidebar">
        </v-toolbar-side-icon>
      </span>
      <v-toolbar-title>
        <router-link to="/" tag="span" style="cursor: pointer">
        {{ appTitle }}
        </router-link>

        <v-btn flat icon color="pink" @click="logout()" v-show="btnLogOutSeen">
          <v-icon>fas fa-sign-out-alt</v-icon>
        </v-btn>

      </v-toolbar-title>

      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-xs-only">
        <v-btn
          flat
          v-for="item in menuItems"
          :key="item.title"
          :to="item.path">
          <v-icon left dark>{{ item.icon }}</v-icon>
          {{ item.title }}
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    
    <v-content>
      <router-view></router-view>
    </v-content>
    
    <v-footer
      dark
      height="auto"
    >
      <v-card
        class="flex"
        flat
        tile
      >
        <v-card-actions class="grey darken-3 justify-center">
          &copy;2018 — <strong>Ezinfotech</strong>
        </v-card-actions>
      </v-card>
    </v-footer>
  </v-app>
</template>

<script>
  export default {
    data () {
      return {
        btnLogOutSeen: false,
        appTitle: '영농일지',
        sidebar: false,
        menuItems: [
          {title: '영농일지', path: '/', icon: 'assignment_turned_in'},
          {title: '일지검색', path: '/search', icon: 'assignment'},
          {title: '작업예측', path: '/predict', icon: 'assignment_late'},
          {title: '통계', path: '/stats', icon: 'assessment'},
          {title: '설정', path: '/config', icon: 'build'}
        ]
      }
    },
    created () {
    },
    updated () {
      if (!this.$session.exists()) {
        this.btnLogOutSeen = false
        this.$router.push('/login')
      } else {
        this.btnLogOutSeen = true
      }
    },
    methods: {
      logout: function () {
        this.$session.destroy()
        this.btnLogOutSeen = false
        this.$router.push('/login')
      }
    }
  }
</script>