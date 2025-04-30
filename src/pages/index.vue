<script setup>

const userData = useCookie('userData')

const rol = userData.value?.rol || 'aday'

</script>

<template>
  <div>
 
    <AdayIlanListesi v-if="rol == 'aday'" />
    
  </div>
</template>
