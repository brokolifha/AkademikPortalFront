<script setup>


const router = useRouter()
const logout = () => {

  useCookie('userData').value = null
useCookie('accessToken').value = null

  router.push('/login')
}

onMounted(() => {
  setTimeout(() => {
    logout()
  }, 500)
})



</script>

<template>
  <VCard>
    <VCardTitle class="text-h5 font-weight-bold">
      Çıkış Yapıyorsunuz
    </VCardTitle>

    <VCardText>
      Kısa süre içinde çıkış yapacaksınız. Lütfen bekleyin...
    </VCardText>
  </VCard>
</template>
