<script setup>
import { onMounted } from "vue";

const dtLoading = ref(false);
const dtData = ref([]);
const dtDataFiltered = ref([]);
const userData = useCookie("userData");

const editMode = ref(false);
const isModalOpen = ref(false);

const dtRecord = ref({
  tc: null,
  ad: null,
  soyad: null,
  email: null,
  sifre: null,
  dogumYili: null,
});

const fields = Object.keys(dtRecord.value).map((key) => {
  return {
    name: key,
    label: key.charAt(0).toUpperCase() + key.slice(1),
    type: "text",
  };
});

const dtHeaders = [
  { title: "TC", value: "tc" },
  { title: "Ad", value: "ad" },
  { title: "Soyad", value: "soyad" },
  { title: "E-Posta", value: "email" },
  { title: "Aksiyonlar", value: "actions", sortable: false },
];

const dtFetchData = async () => {
  dtLoading.value = true;
  try {
    const response = await useApi.get("/users/admin/v1/all");
    dtData.value = response.data;
    dtDataFiltered.value = response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    dtLoading.value = false;
  }
};

const dtSaveRecord = async () => {
  if (editMode.value) {
    try {
      await useApi.put(`/users/admin/update/${dtRecord.value.id}`, dtRecord.value);
      isModalOpen.value = false;
      alert("Admin kaydı başarıyla güncellendi.");
    } catch (error) {
      alert(error.response?.data?.error || 'Güncelleme yapılırken bir hata oluştu.');
    }
  } else {
    try {
      await useApi.post("/users/adminRegister", dtRecord.value);
      isModalOpen.value = false;
      alert("Admin kaydı başarıyla oluşturuldu.");
    } catch (error) {
      console.error("Error creating data:", error);
      alert(error.response?.data?.error || 'Kayıt oluşturulurken bir hata oluştu.');
    }
  }
  dtFetchData();
};

const dtDelete = (item) => {
  const confirmDelete = confirm(
    `Bu admin kaydını silmek istediğinize emin misiniz?`
  );
  if (confirmDelete) {
    useApi
      .delete(`/users/admin/delete/${item.id}`)
      .then(() => {
        dtData.value = dtData.value.filter((i) => i.id !== item.id);
        dtDataFiltered.value = dtDataFiltered.value.filter(
          (i) => i.id !== item.id
        );
        alert("Admin kaydı başarıyla silindi.");
      })
      .catch((error) => {
        console.error("Error deleting data:", error);
        alert(error.response?.data?.error || 'Kayıt silinirken bir hata oluştu.');

      });
  }
};

const resetForm = () => {
  dtRecord.value = {
    ad: null,
    soyad: null,
    email: null,
    sifre: null,
    tc: null,
    dogumYili: null,
  };
  editMode.value = false;
};

const openCreateModal = () => {
  resetForm();
  isModalOpen.value = true;
};

const openEditModal = (item) => {
  dtRecord.value = { ...item };
  editMode.value = true;
  isModalOpen.value = true;
};

onMounted(() => {
  dtLoading.value = true;
  dtFetchData();
});
</script>

<template>
  <v-dialog v-model="isModalOpen" max-width="600" persistent scrollable>
    <v-card>
      <v-card-title>
        <span class="text-h5">Admin Kayıt</span>
      </v-card-title>

      <v-card-text>
        <v-form ref="form" v-model="formValid">
          <v-row>
            <v-col v-for="field in fields" :key="field.name" cols="12">
              <v-text-field
                v-model="dtRecord[field.name]"
                :label="field.label"
                :type="field.type"
                :rules="[(v) => !!v || `${field.label} alanı zorunludur.`]"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="isModalOpen = false">Kapat</v-btn>
        <v-btn color="success" @click="dtSaveRecord">Kaydet</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-btn variant="text" color="primary" @click="openCreateModal">
    <v-icon start>tabler-plus</v-icon>Yeni Kayıt</v-btn
  >

  <v-data-table
    :headers="dtHeaders"
    :items="dtDataFiltered"
    :loading="dtLoading"
    class="elevation-1"
  >
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
            color="primary"
            @click="openEditModal(item)"
          >
            <v-icon> tabler-edit </v-icon>
          </v-btn>
        </template>
        Güncelle
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
            @click="dtDelete(item)"
          >
            <v-icon> tabler-trash </v-icon>
          </v-btn>
        </template>
        Sil
      </v-tooltip>
    </template>
  </v-data-table>
</template>
