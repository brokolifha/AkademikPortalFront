<script setup>
const items = ref([]);
const loadingItems = ref(true);

const headers = [
  { title: "ID", value: "id" },
  { title: "Ad", value: "ad" },
  { title: "Soyad", value: "soyad" },
  { title: "Email", value: "email" },
  { title: "Doğum Tarihi", value: "dogum_yili" },
  { title: "Rol", value: "rol" },
];

const getItems = () => {
  loadingItems.value = true;

  $api.get("/users").then(({ data }) => {
    console.log(data);
    items.value = data;
    loadingItems.value = false;
  });
};

onMounted(() => {
  //getItems();

  items.value = [
    {
      "id": 1,
      "ad": "Ahmet Barış",
      "soyad": "Yardımcı",
      "email": "baris.yrd30@gmail.com",
      "sifre": "ivad310rb",
      "rol": "aday",
      "tc": "68656141546",
      "dogum_yili": 1997
    },
    {
      "id": 2,
      "ad": "Yiğit",
      "soyad": "Yardımcı",
      "email": "yigityardimci0@gmail.com",
      "sifre": "ivad310rb",
      "rol": "aday",
      "tc": "25550579110",
      "dogum_yili": 2003
    },
    {
      "id": 3,
      "ad": "Kerim",
      "soyad": "Yardımcı",
      "email": "kerimyrd@gmail.com",
      "sifre": "ivad310rb",
      "rol": "aday",
      "tc": "25556578902",
      "dogum_yili": 2002
    },
    {
      "id": 4,
      "ad": "Emrullah",
      "soyad": "Donsak",
      "email": "deneme@gmail.com",
      "sifre": "ivad310rb",
      "rol": "aday",
      "tc": "21184707516",
      "dogum_yili": 2001
    },
    {
      "id": 5,
      "ad": "Muhammet Ali",
      "soyad": "Kalyas",
      "email": "deneme1@gmail.com",
      "sifre": "ivad310rb",
      "rol": "aday",
      "tc": "44329200598",
      "dogum_yili": 2001
    },
    {
      "id": 6,
      "ad": "Taha Rıdvan",
      "soyad": "Öztürk",
      "email": "deneme2@gmail.com",
      "sifre": "ivad310rb",
      "rol": "aday",
      "tc": "53377684014",
      "dogum_yili": 2000
    },
    {
      "id": 7,
      "ad": "Anıl Eren",
      "soyad": "Candan",
      "email": "deneme5gmail.com",
      "sifre": "1234",
      "rol": "aday",
      "tc": "30181536388",
      "dogum_yili": 2002
    },
    {
      "id": 8,
      "ad": "Rıza Alper",
      "soyad": "Vural",
      "email": "deneme31gmail.com",
      "sifre": "1234",
      "rol": "aday",
      "tc": "27199068574",
      "dogum_yili": 1998
    }
  ];
  loadingItems.value = false;
});
</script>
<template>
  <h4>Kullanıcı Listesi</h4>
  <br>

  <v-btn prepend-icon="tabler-plus">
    Yeni
  </v-btn>
  <v-sheet border rounded class="mt-3">
    <v-data-table :items="items" :loading="loadingItems" :headers="headers">
      <template v-slot:loading>
        <v-skeleton-loader type="table-tbody"></v-skeleton-loader>
      </template>

      <template v-slot:item.dogum_yili="{ item }">
        {{ item.dogum_yili }}( {{ new Date().getFullYear() - item.dogum_yili }} YAŞ )


      </template>
    </v-data-table>
  </v-sheet>
</template>
