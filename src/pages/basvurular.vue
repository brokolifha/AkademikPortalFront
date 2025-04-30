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

const dtGroupBy = ref([
          {
            key: 'ilanBasligi',
            order: 'asc',
          },
        ]);

const atananJuriler = ref([]);
const atananJuriModal = ref(false);

const juriAtaModal = ref(false);
const juriAtaSelected = ref([]);
const juriAtaData = ref([]); // Tüm Jüri Listesi
const juriAtaLoading = ref(false);
const juriAtaIlanId = ref(null);

const juriAtaHeaders = [
  { title: 'Ad Soyad', value: 'adSoyad' },
  { title: 'E-posta', value: 'email' },
  { title: 'TC Kimlik No', value: 'tc' },
  { title: 'Doğum Yılı', value: 'dogumYili' },
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


const juriListesi = () => {
  juriAtaLoading.value = true;
  juriAtaData.value = [];
  useApi
    .get("/juri/all")
    .then(({ data }) => {
      juriAtaData.value = data;
    })
    .catch((error) => {
      console.error("Error fetching jury list:", error);
    })
    .finally(() => {
      juriAtaLoading.value = false;
    });
}

const ilanaAtananJuriListesi = (ilanId) => {

  useApi.get(`/juri/liste/${ilanId}`)
    .then(({ data }) => {
      console.log("Jüri Listesi:", data);
      atananJuriler.value = data;
      juriAtaIlanId.value = ilanId;
      atananJuriModal.value = true;
    })
    .catch((error) => {
      console.error("Error fetching jury list:", error);
    });
}

const ilandanJuriSil = (ilanId, juriId) => {
  if (confirm("Bu jüriyi silmek istediğinize emin misiniz?")) {
    useApi.delete(`/juri/${ilanId}/${juriId}`)
      .then(({ data }) => {
        console.log("Jüri silme sonucu:", data);
        getData();
        atananJuriModal.value = false;
      })
      .catch(({response}) => {
        console.error("Error deleting jury:", response);
        alert(response.data?.error || 'Jüri silme işlemi sırasında bir hata oluştu.');
      })
      .finally(() => {
        atananJuriModal.value = false;
        juriAtaIlanId.value = null;
      });
  }
}

const ilanaJuriAtaSecim = (ilanId) => {
  juriAtaSelected.value = [];
  juriAtaIlanId.value = ilanId;
  juriAtaModal.value = true;
}

const ilanaJuriAta = () => 
{

  if(!juriAtaSelected.value.length) {
    alert("Lütfen jüri seçiniz.");
    return;
  }

  useApi.post(`/juri/atama?ilanId=${juriAtaIlanId.value}`, juriAtaSelected.value)
    .then(({ data }) => {
      console.log("Jüri atama sonucu:", data);
      juriAtaModal.value = false;
      getData();
    })
    .catch(({response}) => {
      console.log("Error during jury assignment:", response);
      alert(response?.data || 'ilanı atama işlemi sırasında bir hata oluştu.');
    });

}


onMounted(() => {
  getData();
  juriListesi();
});
</script>

<template>

  <v-dialog v-model="juriAtaModal" max-width="80%">
    <v-card>
      <v-card-title>Jüri Ata</v-card-title>
      <v-card-text>
        <v-data-table
          v-model="juriAtaSelected"
          :headers="juriAtaHeaders"
          :items="juriAtaData"
          :loading="juriAtaLoading"
          class="elevation-1"
          item-value="tc"
          show-select
        >

          <template v-slot:item.adSoyad="{ item }">
            {{ item.ad }} {{ item.soyad }}
          </template>

        </v-data-table>

      </v-card-text>
      <v-card-actions>
        <v-spacer/>
        <v-btn text @click="juriAtaModal = false" color="error">Kapat</v-btn>
        <v-btn text @click="ilanaJuriAta()">Kaydet</v-btn>

      </v-card-actions>
    </v-card>
  </v-dialog>

<v-dialog v-model="atananJuriModal" max-width="500">
    <v-card>
      <v-card-title>İlana Atanan Jüriler</v-card-title>
      <v-card-text>
        <v-list two-line>
          <v-list-item v-for="j in atananJuriler" :key="j.id">

              <v-list-item-title>{{ j.ad }} {{ j.soyad }}</v-list-item-title>
              <v-list-item-subtitle>
                {{ j.email }} — TC: {{ j.tc }} — {{ j.dogumYili }}
              </v-list-item-subtitle>

              <template v-slot:append>
                <v-btn icon @click="ilandanJuriSil(juriAtaIlanId, j.id)" variant="text" color="error">
                  <v-icon>tabler-trash</v-icon>
                </v-btn>
              </template>
          </v-list-item>
          <v-list-item v-if="!atananJuriler.length">
            <v-list-item-content>
              <v-list-item-title>Atanmış jüri yok.</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card-text>
      <v-card-actions>
        <v-spacer/>
        <v-btn text @click="atananJuriModal = false">Kapat</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-card>
    <v-card-title>Başvurular</v-card-title>
    <v-card-text>
      <v-data-table
        :headers="dtHeaders"
        :items="dtData"
        :group-by="dtGroupBy"
        :loading="dtLoading"
        class="elevation-1"
      >
      <template v-slot:group-header="{ item, columns, toggleGroup, isGroupOpen }">
      <tr>
        <td :colspan="columns.length">
          <div class="d-flex align-center">
            <v-btn
              :icon="isGroupOpen(item) ? '$expand' : '$next'"
              color="medium-emphasis"
              density="comfortable"
              size="small"
              variant="outlined"
              @click="toggleGroup(item)"
            ></v-btn>

            <span class="ms-4">İlan: {{ item.value }} </span> <v-spacer/> <span class="ms-4">Toplam Başvuru: {{ item.items.length }}</span>
          </div>
        </td>
      </tr>
    </template>
      <template v-slot:item.ilanBasligi="{ item }">
     ({{ item.ilanId }})  {{ item.ilanBasligi }}
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
              @click="ilanaJuriAtaSecim(item.ilanId)"
            >
              <v-icon>
                tabler-user-share
              </v-icon>
            </v-btn>
          </template>
          Jüri Ata
        </v-tooltip>

        <v-tooltip
          :open-delay="300"
          :close-delay="200"
          >
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              icon
              variant="text"
              @click="ilanaAtananJuriListesi(item.ilanId)"
            >
              <v-icon>
                tabler-users
              </v-icon>
            </v-btn>
          </template>
          Jürileri Görüntüle
        </v-tooltip>
      </template>
      </v-data-table>
    </v-card-text>
  </v-card>

  
</template>
