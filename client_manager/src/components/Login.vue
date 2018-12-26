<template>
  <v-layout align-center justify-center fill-height>
    <div
      id="e3"
      style="width: 400px; margin: auto;"
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

      <v-card>
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
                  counter
                  v-on:keyup.enter="login"
                ></v-text-field>                                
              </form>
            </v-flex>

            <v-flex xs12>
              <v-btn block color="success" @click="login()">로그인</v-btn>              
              <p style="cursor:pointer" class="text-lg-right" @click="findPw()">비밀번호 찾기</p>              
            </v-flex>
          
            <v-flex xs12>
              <v-btn block color="warning" @click="goToRegister()">회원가입</v-btn>
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
  methods: {
    async getUserByIdNPw () {
      try {
        const response = await UserService.login({
          id: this.id,
          password: this.password
        })
        switch (response.status) {
          case 200 :
            if (response.data[0].level === '1' || response.data[0].level === '10') {
              this.$swal({
                type: 'success',
                title: '로그인 성공',
                showConfirmButton: false,
                timer: 777
              }).then((result) => {
                this.$session.start()
                this.$session.set('userId', response.data[0]._id)
                this.$session.set('userLevel', response.data[0].level)
                this.$router.push('/')
              })
            } else {
              this.$swal({
                type: 'warning',
                title: '권한없음 - 일반사용자는 접근할 수 없습니다',
                showConfirmButton: false,
                timer: 777
              }).then((result) => {
              })
            }
            break
          case 201 :
            this.$swal({
              type: 'warning',
              title: '로그인 실패 - 존재하지 않는 이메일입니다',
              showConfirmButton: false,
              timer: 777
            }).then((result) => {
            })
            break
          case 202 :
            this.$swal({
              type: 'warning',
              title: '로그인 실패 - 비밀번호가 올바르지 않습니다',
              showConfirmButton: false,
              timer: 777
            }).then((result) => {
            })
            break
          default :
            break
        }
      } catch (e) {
        alert(e)
      }
    },
    async findPassword () {
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
    },
    async checkPwExpired () {
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
          this.$router.push('/changePw')
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
    },
    login () {
      this.$validator.validateAll().then((result) => {
        if (!result) {
          return
        }
        this.getUserByIdNPw()
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