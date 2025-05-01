<script setup>
const ilanListesi = ref([]);
const ilanYukleniyor = ref(false);
const userData = useCookie('userData');
const basvurular = ref({});

const loadingBasvuru = ref({
  loading: false,
  ilanId: null
});

const basvurulanIlanlar = async () => {
  ilanYukleniyor.value = true;
  useApi.get(`/basvurular/aday/${userData.value?.id}`).then(({ data }) => {
    data.forEach((item) => {
      basvurular.value[item.ilanId] = {
        durum: item.basvuruDurumu,
        id: item.ilanId,
        basvuruTarihi: item.basvuruTarihi
      };
    });
  }).catch((error) => {
    console.error("Başvurulan ilanları getirirken hata oluştu:", error);
  }).finally(() => {
    ilanlariGetir();
  });
}

const ilanlariGetir = () => {
  ilanYukleniyor.value = true;

  useApi
    .get("/ilanlar/all")
    .then(({ data }) => {
      ilanListesi.value = data;
    })
    .catch((error) => {
      console.error("İlanları getirirken hata oluştu:", error);
    })
    .finally(() => {
      setTimeout(() => {
        ilanYukleniyor.value = false;
      }, 300);
    });
};


const ilanBasvur = async (ilanId) => {

  loadingBasvuru.value.loading = true;
  loadingBasvuru.value.ilanId = ilanId;

  useApi
    .post(`/basvurular?adayId=${userData.value?.id}&ilanId=${ilanId}`)
    .then(({ data }) => {
      console.log(data);
    })
    .catch((error) => {
      console.error("İlan başvurusunda hata oluştu:", error);
    })
    .finally(() => {
      loadingBasvuru.value.loading = false;
      loadingBasvuru.value.ilanId = null;
      basvurulanIlanlar();
    });
};

const formatTarih = (tarih) => {
  return new Date(tarih).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}


const adayBelgeleri = ref(null);



onMounted(() => {
  basvurulanIlanlar();
});
</script>

<template>
  
  <VCard title="İlan Listesi"> </VCard>

  <VCard title="Belgelerinizi Yükleyin" class="mt-2">
    <DropZone>
    </DropZone>
  </VCard>


  <VRow class="mt-4">
    <VCol cols="12" class="d-flex justify-center" v-if="ilanYukleniyor"
    >
      <v-progress-circular
        :size="70"
        :width="7"
        color="purple"
        indeterminate
      ></v-progress-circular>
    </VCol>

    <VCol cols="12" md="6" v-for="(ilan, index) in ilanListesi" :key="index">
      <v-card class="pa-4 rounded-2xl shadow-md" elevation="3">
    <v-card-title class="text-h5 font-weight-bold text-primary d-flex justify-space-between">
      <div>{{ ilan.baslik }} </div>
      <div>
        <v-btn color="warning" variant="flat" size="small" :disabled="true" v-if="!!basvurular[ilan.id]">{{basvurular[ilan.id].durum}}</v-btn>
      </div>

    </v-card-title>

    <v-card-subtitle class="text-medium-emphasis mb-2 d-flex justify-space-between">
      
      <div> {{ ilan.pozisyon }}</div>
      <div>{{ formatTarih(ilan.baslangicTarihi) }} - {{ formatTarih(ilan.bitisTarihi) }}</div>
      
    </v-card-subtitle>

    <v-divider class="mb-4" />

    <v-card-text>
      <v-row dense>
        <v-col cols="12" >
          <strong>Açıklama:</strong>
          <div>{{ ilan.aciklama }}</div>
        </v-col>

        <v-col cols="12" >
          <strong>Kriterler:</strong>
          <div>{{ ilan.kriterler }}</div>
        </v-col>

        <v-col cols="12" >
          <strong>İlan Türü:</strong>
          <div>{{ ilan.ilanTuru }}</div>
        </v-col>

        <v-col cols="12" v-if="!!basvurular[ilan.id]" >
          <strong>Başvuru Tarihi:</strong>
          <div>{{ formatTarih(basvurular[ilan.id].basvuruTarihi) }}</div>
        </v-col>

        <v-col cols="12" sm="6" v-if="userData?.rol == 'yonetici'">
          <strong>Yönetici Adı:</strong>
          <div>{{ ilan.yoneticiAdi }}</div>
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-btn color="primary" variant="flat" @click="ilanBasvur(ilan.id)" :loading="(loadingBasvuru.ilanId == ilan.id ? loadingBasvuru.loading : false)" v-if="!basvurular[ilan.id]">Başvur</v-btn>
    </v-card-actions>
  </v-card>
    </VCol>
  </VRow>
</template>
