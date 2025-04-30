<script setup>
import { useCookie } from '@/@core/composable/useCookie'
import vuetify from '@/plugins/vuetify'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'

definePage({
  meta: {
    layout: 'blank',
    unauthenticatedOnly: true,
  },
})

const formRef = ref()
const form = ref({
  tc: '',
  sifre: '',
})



const loginLoading = ref(false)
const router = useRouter()
const showMessage = ref({
  title: null,
  message: null,
  show: false,
  type: 'error',
})

const login = async () => {
  const { valid } = await formRef.value.validate()

  if (!valid) {
    // Form geçerli değilse işlemi durdur
    return
  }

  // users/login

  loginLoading.value = true
  useApi.post('/users/login', form.value)
    .then(({ data }) => {
      showMessage.value.title = 'İşlem Başarılı'
      showMessage.value.message = data.message + ', yönlendiriliyorsunuz..'
      showMessage.value.show = true
      showMessage.value.type = 'success'
      formRef.value.reset()

      console.log(data);

      const { user, token } = data

      useCookie('userData').value = user
      useCookie('accessToken').value = token



      setTimeout(() => {
        showMessage.value.show = false

        router.push('/')
      }, 1000)
    })
    .catch((err) => {
      console.log(err)

      showMessage.value.title = 'İşlem Başarısız'
      showMessage.value.message = 'TC kimlik numarası veya parola hatalı'
      showMessage.value.show = true
      showMessage.value.type = 'error'
    })
    .finally(() => {
      loginLoading.value = false
    })
}


const isPasswordVisible = ref(false)
</script>

<template>
  <a href="javascript:void(0)">
    <div class="auth-logo d-flex align-center gap-x-3">
      <VNodeRenderer :nodes="themeConfig.app.logo" />
      <h1 class="auth-title">
        {{ themeConfig.app.title }}
      </h1>
    </div>
  </a>

  <VRow no-gutters class="auth-wrapper bg-surface">

    <VCol cols="12" md="12" class="auth-card-v2 d-flex align-center justify-center">
      <VCard flat class="mt-12 mt-sm-0 pa-6"
        :style="{ maxWidth: vuetify.displayBreakpoint === 'xs' ? '100%' : '500px' }">
        <VCardText>
          <h4 class="text-h4 mb-1">
            <span class="text-capitalize">{{ themeConfig.app.title }}</span> Giriş Paneli
          </h4>
          <p class="mb-0">
            Lütfen TC Kimlik Numaranız ve parolanız ile giriş yapınız.
          </p>
        </VCardText>
        <VCardText>
          <VForm ref="formRef" @submit.prevent="() => { login() }">
            <VRow>
              <!-- email -->
              <VCol cols="12">
                <AppTextField v-model="form.tc" :rules="[requiredValidator]" autofocus label="TC Kimlik No"
                  type="number" placeholder="1111111111" />
              </VCol>

              <!-- password -->
              <VCol cols="12">
                <AppTextField v-model="form.sifre" :rules="[requiredValidator]" label="Parola"
                  placeholder="············" :type="isPasswordVisible ? 'text' : 'password'" autocomplete="password"
                  :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible" />


                <VAlert v-model="showMessage.show" :type="showMessage.type" class="mt-8" :title="showMessage.title"
                  closable>
                  {{ showMessage.message }}
                </VAlert>


                <VBtn block type="submit" :loading="loginLoading" class="mt-8">
                  Giriş Yap
                </VBtn>
              </VCol>

              <!-- create account -->
              <VCol cols="12" class="text-body-1 text-center">
                <span class="d-inline-block">
                  Aday mısınız?
                </span>
                <a class="text-primary ms-1 d-inline-block text-body-1" href="/register">
                  Başvuru Formu
                </a>
              </VCol>

            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth";
</style>
