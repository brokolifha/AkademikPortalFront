<script setup>
import { onMounted } from 'vue'


const ilanlar = ref(0)
const basvurular = ref(0)
const juriler = ref(0)
const loading = ref(true)
const router = useRouter()


const getAll =  () => {

  loading.value = true
   Promise.all([
    useApi.get('/ilanlar/all'),
    useApi.get('/basvurular/all'),
    useApi.get('/juri/all')
  ]).then(([ilanlarResponse, basvurularResponse, jurilerResponse]) => {
    ilanlar.value = ilanlarResponse?.data?.length || 0
    basvurular.value = basvurularResponse?.data?.length || 0
    juriler.value = jurilerResponse?.data?.length || 0
  }).catch((error) => {
    console.error('Error fetching data:', error)
  })
  .finally(() => {
    loading.value = false
  })
}

onMounted(() => {
  loading.value = true
  getAll()
})

</script>

<template>

  <VCard v-if="loading">

    <VCardText class="d-flex justify-center align-center">
      <VProgressCircular
        indeterminate
        color="primary"
        size="64"
        width="6"
        class="mx-auto"
      ></VProgressCircular>
    </VCardText>
  </VCard>

  <VCard v-else>
    <VCardTitle class="text-h5">Yönetici Dashboard</VCardTitle>
    <VCardText>
      <VRow>
        <VCol cols="12" md="4">
          <VCard>
            <VCardTitle>İlan Sayısı</VCardTitle>
            <VCardText>{{ ilanlar }}</VCardText>
            <VCardActions>
              <VBtn color="primary" @click="router.push('/ilanlar')">İlanları Görüntüle</VBtn>
            </VCardActions>
          </VCard>
        </VCol>
        <VCol cols="12" md="4">
          <VCard>
            <VCardTitle>Başvuru Sayısı</VCardTitle>
            <VCardText>{{ basvurular }}</VCardText>
            <VCardActions>
              <VBtn color="primary" @click="router.push('/basvurular')">Başvuruları Görüntüle</VBtn>
            </VCardActions>
          </VCard>
        </VCol>
        <VCol cols="12" md="4">
          <VCard>
            <VCardTitle>Jüri Sayısı</VCardTitle>
            <VCardText>{{ juriler }}</VCardText>
            <VCardActions>
              <VBtn color="primary" @click="router.push('/juriler')">Jüri Üyelerini Görüntüle</VBtn>
            </VCardActions>
          </VCard>
        </VCol>
      </VRow>
    </VCardText>
    <VCardActions>
      <VBtn color="primary" @click="getAll">Verileri Yenile</VBtn>
    </VCardActions>
  </VCard>
  
  </template>

