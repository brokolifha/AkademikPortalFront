<template>
  <div>
    <v-card>
      <v-card-title class="d-flex justify-between">
        <span>İlan Listesi</span>
      </v-card-title>

      <v-btn color="primary" @click="openCreateModal" variant="text" class="ml-2"><v-icon start>tabler-plus</v-icon>Yeni İlan</v-btn>

      <v-data-table
        :headers="headers"
        :items="ilanlar"
        :loading="loading"
        class="elevation-1"
        loading-text="Yükleniyor..."
      >
        <template #item.actions="{ item }">
          <v-btn icon variant="text" @click="editIlan(item)">
            <v-icon icon="tabler-pencil" />
          </v-btn>
          <v-btn icon variant="text" @click="deleteIlan(item.id)">
            <v-icon icon="tabler-trash" color="red" />
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- Modal -->
    <v-dialog v-model="isModalOpen" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ editMode ? 'İlan Güncelle' : 'Yeni İlan Ekle' }}</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="ilanForm" v-model="formValid">
            <v-text-field v-model="form.baslik" label="Başlık" required class="mb-3" />
            <v-text-field v-model="form.aciklama" label="Açıklama" required class="mb-3" />
            <v-text-field v-model="form.pozisyon" label="Pozisyon" required class="mb-3" />
            <v-text-field v-model="form.baslangicTarihi" label="Başlangıç Tarihi" type="date" required class="mb-3" />
            <v-text-field v-model="form.bitisTarihi" label="Bitiş Tarihi" type="date" required class="mb-3" />
            <v-text-field v-model="form.kriterler" label="Kriterler" required class="mb-3" />
            <v-select
              v-model="form.ilanTuru"
              :items="['DR_OGR_UYESI', 'DOCENT', 'PROFESOR']"
              label="İlan Türü"
              required
            />
          </v-form>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn variant="text" @click="isModalOpen = false">İptal</v-btn>
          <v-btn :disabled="!formValid" variant="text" @click="saveIlan">
            {{ editMode ? 'Güncelle' : 'Kaydet' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
const ilanlar = ref([])
const loading = ref(false)

const headers = [
  { title: 'Başlık', value: 'baslik' },
  { title: 'Pozisyon', value: 'pozisyon' },
  { title: 'Başlangıç', value: 'baslangicTarihi' },
  { title: 'Bitiş', value: 'bitisTarihi' },
  { title: 'Yönetici', value: 'yoneticiAdi' },
  { title: 'İlan Türü', value: 'ilanTuru' },
  { title: 'Aksiyonlar', value: 'actions', sortable: false },
]

const isModalOpen = ref(false)
const editMode = ref(false)
const formValid = ref(false)
const ilanForm = ref(null)
const selectedId = ref(null)

const form = ref({
  baslik: '',
  aciklama: '',
  pozisyon: '',
  baslangicTarihi: '',
  bitisTarihi: '',
  ilanTuru: '',
  kriterler: '',
})

const fetchIlanlar = async () => {
  loading.value = true

  useApi.get('/ilanlar/all').then((response) => {
    ilanlar.value = response.data
  }).catch((error) => {
    console.error('Error fetching ilanlar:', error)
  }).finally(() => {
    loading.value = false
  })
}

const openCreateModal = () => {
  resetForm()
  editMode.value = false
  isModalOpen.value = true
}

const editIlan = (ilan) => {
  Object.assign(form.value, ilan)
  selectedId.value = ilan.id
  editMode.value = true
  isModalOpen.value = true
}

const saveIlan = async () => {
  if (!(await ilanForm.value.validate())) return

  delete form.value.id;

  if (editMode.value) {
    await useApi.put(`/ilanlar/admin/update/${selectedId.value}`, form.value)
  } else {
    await useApi.post('/ilanlar/admin/createIlan', form.value)
  }
  isModalOpen.value = false
  fetchIlanlar()
}

const deleteIlan = async (id) => {
  if (confirm('Bu ilanı silmek istediğinizden emin misiniz?')) {
    await useApi.delete(`/ilanlar/admin/delete/${id}`)
    fetchIlanlar()
  }
}

const resetForm = () => {
  form.value = {
    baslik: '',
    aciklama: '',
    pozisyon: '',
    baslangicTarihi: '',
    bitisTarihi: '',
    ilanTuru: '',
    kriterler: '',
  }
  selectedId.value = null
}

onMounted(fetchIlanlar)
</script>
