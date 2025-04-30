<script setup>
const dtLoading = ref(false);
const dtData = ref([]);
const dtDataFiltered = ref([]);
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

const pdfDialog = ref(false);
const pdfUrl = ref(null);
const pdfBlobRef = ref(null);
const pdfBasvuru = ref(null);


const getData = () => {
  dtLoading.value = true;
  dtData.value = [];
  useApi
    .get("/basvurular/all")
    .then(({ data }) => {
      dtData.value = data;
      dtDataFiltered.value = data;
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


const basvuruDegerlendirmeListesi = ref([]);
const basvuruDegerlendirmeModal = ref(false);

const basvuruDegerlendirmeListesiGetir = (basvuruId) => {
  useApi.get(`/yonetici/basvuru/degerlendirmeler/${basvuruId}`)
    .then(({ data }) => {
      console.log("Değerlendirme Listesi:", data);

      data.map((degerlendirme) => {
        let juri = juriAtaData.value.find((j) => j.id == degerlendirme.juriUyesiId);
        console.log("Jüri:", juri);
        console.log(juriAtaData.value);
        if (juri) {
          degerlendirme.juri = juri;
        }
        else
        {
          degerlendirme.juri = {
            ad: "Bilinmiyor",
            soyad: "Bilinmiyor",
            email: "Bilinmiyor",
            dogumYili: "Bilinmiyor",
          };
        }
      });

      console.log(data);
      basvuruDegerlendirmeListesi.value = data;
      basvuruDegerlendirmeModal.value = true;
    })
    .catch((error) => {
      console.error("Error fetching evaluation list:", error);
    });
}

const nihaiKararModal = ref(false);
const nihaiKararForm = ref({
  basvuruId: null,
  karar: null,
  aciklama: null,
});

const nihaiKararEkraniniAc = (basvuruId) => {
  nihaiKararForm.value.basvuruId = basvuruId;
  nihaiKararModal.value = true;
}

const nihaiKararVer = () => {
  if (!nihaiKararForm.value.karar) {
    alert("Lütfen nihai kararı seçiniz.");
    return;
  }

  useApi.post
  (`/degerlendirme/nihai-karar?basvuruId=${nihaiKararForm.value.basvuruId}&karar=${nihaiKararForm.value.karar}&aciklama=${nihaiKararForm.value.aciklama}` )
    .then(({ data }) => {
      console.log("Nihai karar sonucu:", data);
      nihaiKararModal.value = false;
      getData();
    })
    .catch((error) => {
      console.error("Error during final decision:", error);
      alert(error?.response?.data?.error || 'Nihai karar verme işlemi sırasında bir hata oluştu.');
    });
}


const pdfIndir = () => {
  if (pdfBlobRef.value) {
    const blob = new Blob([pdfBlobRef.value], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${pdfBasvuru.value.ilanBasligi} - ${pdfBasvuru.value.adayAdi} ${pdfBasvuru.value.adaySoyadi}.pdf`;
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } else {
    alert("PDF dosyası oluşturulmadı.");
  }
}

const basvuruBelgeOlustur = (basvuru) => {
  useApi.get('/pdf/tablo5/' + basvuru.id, { responseType: 'blob' })
    .then(({ data }) => {
      console.log("Belge oluşturma sonucu:", data);
      if (data) {
        pdfBlobRef.value = data;
        const blob = new Blob([data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        pdfUrl.value = url;
        pdfDialog.value = true;
        pdfBasvuru.value = basvuru;
      } else {
        alert("Belge oluşturulamadı.");
      }
    })
    .catch((error) => {
      console.error("Error creating document:", error);
      alert(error?.response?.data?.error || 'Belge oluşturma işlemi sırasında bir hata oluştu.');
    });

}

const basvuruDurumuChipColor = (durum) => {
  if(durum == 'KABUL_EDILDI') {
    return 'success';
  }
  else if(durum == 'RED_EDILDI') {
    return 'error';
  }
  else {
    return 'primary';
  }
}

const basvuruDurumuFiltre = ref(null);
const basvuruDurumlari = [
  { text: 'Beklemede', value: 'BEKLEMEDE'},
  { text: 'Kabul Edildi', value: 'KABUL_EDILDI' },
  { text: 'Red Edildi', value: 'RED_EDILDI' },
  { text: 'Jüri Değerlendirmesinde', value: 'JURI_DEGERLENDIRMESINDE' },
  { text: 'Değerlendirme Tamamlandı', value: 'DEGERLENDIRME_TAMAMLANDI' },

];

// watch basvuruDurumuFiltre
watch(basvuruDurumuFiltre, (newValue) => {
  if (newValue) {
    dtDataFiltered.value = dtData.value.filter((item) => item.basvuruDurumu === newValue);
  } else {
    dtDataFiltered.value = dtData.value;
  }
});

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

  <v-dialog v-model="basvuruDegerlendirmeModal" max-width="70%">
    <v-card>
      <v-card-title>Başvuruyu Değerlendiren Jüriler</v-card-title>
      <v-card-text>
        <v-list three-line>
          <template  v-for="b in basvuruDegerlendirmeListesi" :key="b.id">
          <v-list-item>
              <v-list-item-title>{{ b.juri.ad }} {{ b.juri.soyad }} <v-spacer />  </v-list-item-title>
              <v-list-item-subtitle>
                {{ formatDate(b.degerlendirmeTarihi) }} - Puan: <strong>{{ b.puan }}</strong>
              </v-list-item-subtitle>
              <v-list-item-subtitle>
                {{ b.yorum }}
              </v-list-item-subtitle>
          </v-list-item>
          <v-divider />
        </template>
          <v-list-item v-if="!basvuruDegerlendirmeListesi.length">
            <v-list-item-content>
              <v-list-item-title>Kayıtlı değerlendirme yok.</v-list-item-title>
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

  <v-dialog v-model="nihaiKararModal" max-width="500">
    <v-card>
      <v-card-title>Nihai Karar Ver</v-card-title>
      <v-card-text>
        <v-select
          v-model="nihaiKararForm.karar"
          :items="['KABUL_EDILDI', 'RED_EDILDI']"
          label="Nihai Karar"
          class="mb-4"
        ></v-select>

        <v-textarea
          v-model="nihaiKararForm.aciklama"
          label="Açıklama"
          rows="3"
        ></v-textarea>
      </v-card-text>
      <v-card-actions>
        <v-spacer/>
        <v-btn text @click="nihaiKararModal = false">Kapat</v-btn>
        <v-btn text @click="nihaiKararVer()">Kaydet</v-btn>

      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="pdfDialog" max-width="80%">
      <v-card>
        <v-card-title class="text-h6 d-flex justify-space-between">
          Başvuru PDF
          <v-btn icon @click="pdfDialog = false" variant="text">
            <v-icon>tabler-x</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <iframe
            v-if="pdfUrl"
            :src="pdfUrl"
            width="100%"
            height="600"
            style="border: none;"
          ></iframe>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="pdfDialog = false">Kapat</v-btn>
          <v-btn color="primary" @click="pdfIndir">PDF İndir</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  
 
  <v-card>
    <v-card-title>Başvurular</v-card-title>
    <v-card-text>
    <v-row>
    <v-col cols="12" md="4">
      <v-select
        v-model="basvuruDurumuFiltre"
        :items="basvuruDurumlari"
        item-title="text"
        item-value="value"
        label="Başvuru Durumu"
        clearable
        hide-details
      ></v-select>
    </v-col>

    <v-col cols="12" md="8">
    </v-col>
  </v-row>
</v-card-text>


    <v-card-text>
      <v-btn @click="getData()" color="primary" variant="text">
        <v-icon start>tabler-refresh</v-icon>
        Yenile</v-btn>

      <v-data-table
        :headers="dtHeaders"
        :items="dtDataFiltered"
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

      <template v-slot:item.basvuruDurumu="{ item }">
        <v-chip
          :color="basvuruDurumuChipColor(item.basvuruDurumu)"
          text-color="white"
        >
          {{ item.basvuruDurumu }}
        </v-chip>
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
              color="success"
              @click="basvuruBelgeOlustur(item)"
            >
              <v-icon>
                tabler-file-text-spark
              </v-icon>
            </v-btn>
          </template>
          Belge Oluştur
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

        <v-tooltip
          :open-delay="300"
          :close-delay="200"
          >
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              icon
              variant="text"
              @click="basvuruDegerlendirmeListesiGetir(item.id)"
            >
              <v-icon>
                tabler-message-user
              </v-icon>
            </v-btn>
          </template>
          Değerlendirmeler
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
              color="error"
              @click="nihaiKararEkraniniAc(item.id)"
            >
              <v-icon>
                tabler-gavel
              </v-icon>
            </v-btn>
          </template>
          Nihai Karar Ver
        </v-tooltip>
      </template>
      </v-data-table>
    </v-card-text>
  </v-card>

  
</template>
