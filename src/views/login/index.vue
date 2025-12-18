<template>
  <div class="login_container">
    <el-row>
      <!-- 每行设置的span一共是24，所以12，12就是占一半，
           :xs就是在像素小于768时，:span为0就是右侧为0，左侧为24因为一共就是24所以左侧就占满 -->
      <el-col :span="12" :xs="0">
        占位的位子
      </el-col>
      <el-col :span="12" :xs="24">
        <el-form class="login_form" ref="loginFroms" :rules="rules" v-model="loginFrom">
          <h1>hello</h1>
          <h2>欢迎来到硅谷甄选</h2>
          <el-form-item prop="username">
            <el-input placeholder="请输入用户名" v-model="loginFrom.username">
              <!-- 利用插槽就可以搭配placeholder，不会让让div里面只有placeholder的内容 -->
              <template #prefix>
                <el-icon>
                  <User />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input placeholder="请输入密码" type="password" v-model="loginFrom.password" show-password>
              <template #prefix>
                <el-icon>
                  <Lock />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="login-button" style="width: 100%;" @click="login">登录</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
// 登录页面组件
import { Lock, User } from "@element-plus/icons-vue";
import { ref, reactive } from "vue"
import useUserStore from "@/stores/modules/user.ts"
import { useRoute, useRouter } from "vue-router";
import type { LocationQueryRaw } from "vue-router";
import { ElNotification } from "element-plus";
import { getHour } from "@/utils/getHour";
import type { LoginParams } from "@/api/user/type";

// 创建store实例
const userStore = useUserStore()

// 登录表单数据类型定义
const loginFrom = ref<LoginParams>({ username: 'admin', password: '111111' })
const route = useRoute()
const router = useRouter()
const loading = ref<boolean>(false)
const loginFroms = ref()
// 登录函数
const login = async (): Promise<void> => {
  //加载效果：开始加载
  await loginFroms.value.validate()
  loading.value = true;
  try {
    await userStore.userLogin(loginFrom.value)

    // 类型安全的处理重定向
    const redirect = route.query.redirect as string | undefined;
    const redirectPath: string = redirect || '/';

    router.push({
      path: redirectPath
    })

    // 成功通知
    ElNotification({
      type: 'success',
      message: '欢迎回来',
      title: `hi,${getHour()}好`
    })
  } catch (error) {
    // 错误处理
    const errorMessage = error instanceof Error
      ? error.message
      : '登录失败，请稍后重试';

    ElNotification({
      type: 'error',
      message: errorMessage
    })
  } finally {
    // 无论成功失败都关闭加载
    loading.value = false;
  }
}
const ruleUserName = (rule: Record<string, any>, value: string | undefined, callback: (error?: Error | null) => void) => {
  if (!value || value.length < 5) {
    callback(new Error('账号长度至少五位'))
  } else {
    callback();
  }
}
const rulePassword = (rule: Record<string, any>, value: string | undefined, callback: (error?: Error | null) => void) => {
  if (!value || value.length < 6) {
    callback(new Error('密码长度至少六位'))
  } else {
    callback();
  }
}
const rules = {
  //规则对象属性:
  //required,代表这个字段务必要校验的
  //min:文本长度至少多少位
  //max:文本长度最多多少位
  //message:错误的提示信息
  //trigger:触发校验表单的时机 change->文本发生变化触发校验,blur:失去焦点的时候触发校验规则
  username: [
    // { required: true, min: 6, max: 10, message: '账号长度至少六位', trigger: 'change' }
    { trigger: 'change', validator: ruleUserName }
  ],
  password: [
    // { required: true, min: 6, max: 15, message: '密码长度至少六位', trigger: 'change' }
    { trigger: 'change', validator: rulePassword }
  ],
}
</script>

<style lang="scss" scoped>
.login_container {
  width: 100%;
  height: 100vh;
  background: url('@/assets/images/background.jpg') no-repeat;
  background-size: cover;
}

.login_form {
  position: relative;
  width: 80%;
  top: 30vh;
  background: url('@/assets/images/login_form.png');

  h1 {
    color: white;
    font-size: 40px;
  }

  h2 {
    font-size: 20px;
    color: white;
  }

  .login-button {
    background-color: #409eff;
    border-color: #409eff;
    color: white;
    font-size: 16px;
    padding: 10px;
  }
}
</style>
