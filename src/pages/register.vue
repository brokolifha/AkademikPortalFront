<script setup>

import { useApi } from '@/composables/useApi'
import vuetify from '@/plugins/vuetify'
import { themeConfig } from '@themeConfig'
import { VForm } from 'vuetify/components/VForm'

definePage({
  meta: {
    layout: 'blank',
    unauthenticatedOnly: true,
  },
})

const formRef = ref()
const registerLoading = ref(false)
const router = useRouter()

const form = ref({
  tc: null,
  dogumYili: null,
  ad: null,
  soyad: null,
  email: null,
  sifre: null,
})

const showMessage = ref({
  title: null,
  message: null,
  show: false,
  type: 'error',
})

const register = async () => {

  const { valid } = await formRef.value.validate()

  if (!valid) {
    // Form geçerli değilse işlemi durdur
    return
  }

  // users/register
  registerLoading.value = true

  useApi.post('/users/register', form.value)
    .then(({ data }) => {

      showMessage.value.title = 'İşlem Başarılı'
      showMessage.value.message = data.message + ' Yönlendiriliyorsunuz..'
      showMessage.value.show = true
      showMessage.value.type = 'success'
      formRef.value.reset()

      setTimeout(() => {
        showMessage.value.show = false

        router.push({ name: 'login' })
      }, 3000)

    })
    .catch(({ response }) => {
      const { data } = response;
      // Hata durumunda yapılacak işlemler
      console.error('Kayıt hatası:', data.error)
      showMessage.value.title = 'Bir hata oluştu'
      showMessage.value.message = data.error
      showMessage.value.show = true
      showMessage.value.type = 'error'


    })
    .finally(() => {
      registerLoading.value = false
    })

  console.log('Form geçerli, kayıt işlemi başlıyor:', form.value)

}

const isPasswordVisible = ref(false)
</script>

<template>
  <VRow no-gutters class="auth-wrapper bg-surface">
    <VCol cols="12" md="12" class="auth-card-v2 d-flex align-center justify-center"
      style="background-color: rgb(var(--v-theme-surface));">
      <VCard flat class="mt-12 mt-sm-0 pa-4"
        :style="{ maxWidth: vuetify.displayBreakpoint === 'xs' ? '100%' : '500px' }">
        <VCardText>
          <h1 class="text-h1 mb-1">
            {{ themeConfig.app.title }}
          </h1>
          <h3 class="text-h3 mb-0">
            Aday Kayıt Formu
          </h3>
        </VCardText>

        <VCardText>
          <VForm ref="formRef" @submit.prevent="() => { register() }">
            <VRow>

              <VCol cols="12">
                <AppTextField v-model="form.tc" :rules="[requiredValidator]" autofocus label="TC Kimlik No"
                  placeholder="11111111111" type="number" />
              </VCol>

              <VCol cols="12">
                <AppTextField v-model="form.dogumYili" :rules="[requiredValidator]" label="Doğum Yılı"
                  placeholder="1990" type="number" />
              </VCol>



              <VCol cols="12">
                <AppTextField v-model="form.ad" :rules="[requiredValidator]" label="İsim" placeholder="İsim" />
              </VCol>


              <VCol cols="12">
                <AppTextField v-model="form.soyad" :rules="[requiredValidator]" label="Soyisim" placeholder="Soyisim" />
              </VCol>


              <VCol cols="12">
                <AppTextField v-model="form.email" :rules="[requiredValidator, emailValidator]" label="Email"
                  type="email" placeholder="aday@email.com" />
              </VCol>


              <VCol cols="12">
                <AppTextField v-model="form.sifre" :rules="[requiredValidator]" label="Parola"
                  placeholder="············" :type="isPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible" />

              </VCol>






              <VCol cols="12">

                <VAlert v-model="showMessage.show" :type="showMessage.type" class="mb-4" :title="showMessage.title"
                  closable>
                  {{ showMessage.message }}
                </VAlert>

                <VBtn block type="submit" class="mt-2" :loading="registerLoading">
                  Kayıt Ol
                </VBtn>
              </VCol>


              <VCol cols="12" class="text-center text-base">
                <span>Zaten bir hesabınız var mı?</span>
                <RouterLink class="text-primary ms-2" :to="{ name: 'login' }">
                  Giriş Yapın
                </RouterLink>
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
