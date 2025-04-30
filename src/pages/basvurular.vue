<script setup>
const dtLoading = ref(false);
const dtData = ref([]);
const dtHeaders = [
{ title: 'İlan Başlığı', value: 'ilanBasligi' },
  { title: 'Ad Soyad', value: 'adayAdi' },
  { title: 'Başvuru Tarihi', value: 'basvuruTarihi' },
  { title: 'Başvuru Durumu', value: 'basvuruDurumu' },
  { title: 'Puan', value: 'puan' },
  { title: 'Aksiyonlar', value: 'actions', sortable: false },
]
const getData = () => {
  dtLoading.value = true;
  dtData.value = [];
  useApi
    .get("/basvurular/all")
    .then(({ data }) => {
      dtData.value = data;
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    })
    .finally(() => {
      dtLoading.value = false;
    });
};



onMounted(() => {
  getData();
});
</script>

<template>
  <v-card>
    <v-card-title>Başvurular</v-card-title>
    <v-card-text>
      <v-data-table
        :headers="dtHeaders"
        :items="dtData"
        :loading="dtLoading"
        class="elevation-1"
      >
      <template v-slot:item.ilanBasligi="{ item }">
       {{ item.ilanBasligi }}
      </template>

      <template v-slot:item.adayAdi="{ item }">
       {{ item.adayAdi }} {{ item.adaySoyadi }}
      </template>

      <template v-slot:item.basvuruTarihi="{ item }">
       {{ formatDate(item.basvuruTarihi) }}
      </template>

      <template v-slot:item.actions="{ item }">
        <v-tooltip
          :open-delay="300"
          :close-delay="200"
          >
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              icon
              variant="text"
            >
              <v-icon>
                tabler-users
              </v-icon>
            </v-btn>
          </template>
          Jüri Ata
        </v-tooltip>
      </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>
