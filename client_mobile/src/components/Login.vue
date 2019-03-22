<template>
  <v-layout align-center justify-center fill-height mb-5>
    <div
      id="e3"
      style="width: 95%; height: 480px; margin: auto;"
      class="grey lighten-3"
    >
      <v-toolbar
        color="blue"
        dark
      >
        <v-icon>fas fa-key</v-icon>
        <v-toolbar-title>로그인</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>

      <v-card style="height:88%">
        <v-container
          fluid
          grid-list-lg
        >
          <v-layout row wrap justify-center>

            <v-flex xs12>
              <form>
                <v-text-field
                  prepend-icon="fas fa-id-badge"
                  v-validate="'required'"
                  v-model="id"
                  :error-messages="errors.collect('id')"
                  label="아이디"
                  data-vv-name="id"
                ></v-text-field>

                <v-text-field
                  prepend-icon="fas fa-lock"
                  v-validate="'required'"
                  v-model="password"
                  :error-messages="errors.collect('password')"
                  :type="'password'"
                  label="비밀번호"
                  data-vv-name="password"                  
                  v-on:keyup.enter="login"
                ></v-text-field>                                
              </form>
            </v-flex>

            <v-flex xs12>
              <v-btn block color="primary" @click="login()">로그인</v-btn>              
              <p style="cursor:pointer" class="text-lg-right" @click="findPw()">비밀번호 찾기</p>              
            </v-flex>

            <v-flex xs12 style="height:97px"/>
          
            <v-flex xs12>
              <v-btn block outline color="indigo" @click="goToRegister()">회원가입</v-btn>
            </v-flex>

          </v-layout>
        </v-container>
      </v-card>

      <registerModal></registerModal>      

    </div>
  </v-layout>
</template>

<script>
// import {bus} from '../main'
// import moment from 'moment'
import UserService from '@/services/UserService'
import DBService from '@/services/DBService'
import LogService from '@/services/LogService'
export default {
  $_veeValidate: {
    validator: 'new'
  },
  data () {
    return {
      password: '',
      id: '',
      dictionary: {
        custom: {
          id: {
            required: () => '아이디를 입력해주세요'
          },
          password: {
            required: () => '비밀번호를 입력해주세요'
          }
        }
      }
    }
  },
  mounted () {
    this.$validator.localize('ko', this.dictionary)
  },
  created: function () {
    this.checkDB()
  },
  methods: {
    async checkDB () {
      try {
        await DBService.checkDB({})
      } catch (e) {
        this.$router.push('/500')
        return false
      }
      return true
    },
    async logError (page, funcName, message) {
      await LogService.logError({
        errorPage: page,
        funcName: funcName,
        message: message
      })
    },
    async getUserByIdNPw () {
      try {
        const response = await UserService.login({
          id: this.id,
          password: this.password
        })
        if (response.data[0]._id) {
          this.$swal({
            type: 'success',
            title: '로그인 성공',
            showConfirmButton: false,
            timer: 777
          }).then((result) => {
            this.$session.start()
            this.$session.set('userId', response.data[0].id)
            this.runLoginProcess()
            this.$router.push('/')
          })
        } else {
          this.$swal({
            type: 'warning',
            title: '로그인 실패',
            showConfirmButton: false,
            timer: 777
          }).then((result) => {
          })
        }
      } catch (e) {
        // alert(e)
        this.logError('Login.vue', 'getUserByIdNPw', e.toString())
        this.$router.push('/500')
      }
    },
    async findPassword () {
      try {
        const response = await UserService.findPassword({
          id: this.id
        })
        if (response.status === 200) {
          this.$swal({
            type: 'success',
            title: '임시비밀번호 발송',
            showConfirmButton: false,
            timer: 777
          }).then((result) => {
          })
        } else if (response.status === 201) {
          this.$swal({
            type: 'warning',
            title: '존재하지않는 아이디입니다',
            showConfirmButton: false,
            timer: 777
          }).then((result) => {
          })
        }
      } catch (e) {
        this.logError('Login.vue', 'findPassword', e.toString())
        this.$router.push('/500')
      }
    },
    async checkPwExpired () {
      try {
        const response = await UserService.checkPasswordExpired({
          id: this.id
        })
        if (response.status === 200) {
          // 로그인 성공
        } else if (response.status === 201 || response.status === 203) {
          // 비번 수정 창으로 이동
          this.$swal({
            type: 'warning',
            title: '비밀번호를 변경해주세요',
            showConfirmButton: false,
            timer: 1444
          }).then((result) => {
            // this.$router.push('/changePw')
            // https://router.vuejs.org/guide/essentials/navigation.html
            // https://www.thepolyglotdeveloper.com/2017/11/pass-data-between-routes-vuejs-web-application/
            // 임시비밀번호 발급받아 로그인하는 경우 비밀번호 변경 창을 띄운다
            this.$router.push({ name: 'nameConfigPrivate', params: { callFrom: 'login' } })
          })
        } else if (response.status === 202) {
          // 임시비번 재발급 창으로 이동
          this.$swal({
            type: 'warning',
            title: '비밀번호 찾기로 임시비밀번호를 재발급 받으세요',
            showConfirmButton: false,
            timer: 1444
          }).then((result) => {
            this.$session.destroy()
            this.btnLogOutSeen = false
            this.isBackImgActive = true
            this.$router.push('/login')
          })
        }
      } catch (e) {
        this.logError('Login.vue', 'checkPwExpired', e.toString())
        this.$router.push('/500')
      }
    },
    login () {
      this.$validator.validateAll().then((result) => {
        if (!result) {
          return
        }
        if (this.checkDB()) {
          this.getUserByIdNPw()
        }
      }).catch(() => {})
    },
    goToRegister () {
      // bus.$emit('dialogForRegister')
      this.$router.push('/suStep1')
    },
    findPw () {
      if (this.id.length > 0) {
        this.findPassword()
      } else {
        this.$swal({
          type: 'warning',
          title: '아이디를 입력해주세요',
          showConfirmButton: false,
          timer: 777
        }).then((result) => {
        })
      }
    },
    runLoginProcess () {
      this.checkPwExpired()
    }
  },
  computed: {
  }
}
</script>