<script setup>

const userData = useCookie('userData')

const rol = userData.value?.rol || 'aday'

</script>

<template>
  <div>
 
    <AdayIlanListesi v-if="rol == 'aday'" />
    <YoneticiDashboard v-if="rol == 'yonetici'" />
    <AdminDashboard v-if="rol == 'admin'" />
    
  </div>
</template>
