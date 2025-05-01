<script setup>
import { useApi } from "@/composables/useApi";
import { useDropZone, useFileDialog, useObjectUrl } from "@vueuse/core";

const dropZoneRef = ref();
const fileData = ref([]);
const { open, onChange } = useFileDialog({ accept: "application/pdf" });
function onDrop(DroppedFiles) {
  DroppedFiles?.forEach((file) => {
    if (file.type.slice(0, 4) !== "pdf/") {
      // eslint-disable-next-line no-alert
      alert("Only image files are allowed");

      return;
    }
    fileData.value.push({
      file,
      url: useObjectUrl(file).value ?? "",
    });
  });
}
onChange((selectedFiles) => {
  if (!selectedFiles) return;
  for (const file of selectedFiles) {
    fileData.value.push({
      file,
      url: useObjectUrl(file).value ?? "",
    });
  }
});
useDropZone(dropZoneRef, onDrop);

const uploadToServer = async (file) => {
  new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("file", file);

    useApi
      .post("/dosya/pdf-kaydet", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        resolve(success);
        console.log("File uploaded successfully:", response.data);
      })
      .catch((error) => {
        reject(error);
        console.error("Error uploading file:", error);
      });
  });
};

const loadingUploadFiles = ref(false);

const uploadFiles = () => {
 
  loadingUploadFiles.value = true;
  let PromiseArray = [];

  fileData.value.forEach((file) => {
    const formData = new FormData();
    formData.append("file", file.file);
    PromiseArray.push(uploadToServer(file.file));
  });

  Promise.all(PromiseArray)
    .then((responses) => {
      console.log("All files uploaded successfully:", responses);
    })
    .catch((error) => {
      console.error("Error uploading files:", error);
    })
    .finally(() => {
      loadingUploadFiles.value = false;
      fileData.value = [];
      alert("Dosyalar başarıyla yüklendi");
    });


};
</script>

<template>
  <div class="flex">
    <div class="w-full h-auto relative">
      <div ref="dropZoneRef" class="cursor-pointer" @click="() => open()">
        <div
          v-if="fileData.length === 0"
          class="d-flex flex-column justify-center align-center gap-y-2 pa-12 drop-zone rounded"
        >
          <IconBtn variant="tonal" class="rounded-sm">
            <VIcon icon="tabler-upload" />
          </IconBtn>
          <h4 class="text-h4">PDF Dosyalarınızı Buraya Sürükleyin</h4>
          <span class="text-disabled">or</span>

          <VBtn variant="tonal" size="small"> Dosya Seç </VBtn>
        </div>

        <div
          v-else
          class="d-flex justify-center align-center gap-3 pa-8 drop-zone flex-wrap"
        >
          <VRow class="match-height w-100">
            <template v-for="(item, index) in fileData" :key="index">
              <VCol cols="12" sm="4">
                <VCard :ripple="false">
                  <VCardText class="d-flex flex-column" @click.stop>
                    <VImg
                      :src="item.url"
                      width="200px"
                      height="150px"
                      class="w-100 mx-auto"
                    />
                    <div class="mt-2">
                      <span class="clamp-text text-wrap">
                        {{ item.file.name }}
                      </span>
                      <span> {{ item.file.size / 1000 }} KB </span>
                    </div>
                  </VCardText>
                  <VCardActions>
                    <VBtn
                      variant="text"
                      block
                      @click.stop="fileData.splice(index, 1)"
                    >
                      Dosyayı Kaldır
                    </VBtn>
                  </VCardActions>
                </VCard>
              </VCol>
            </template>
          </VRow>
        </div>
      </div>
      <div class="mt-4 d-flex justify-end mb-4 pr-4">
        <VBtn
          color="success"
          variant="flat"
          @click="uploadFiles"
          :disabled="fileData.length == 0"
          >Yükle</VBtn
        >
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.drop-zone {
  border: 1px dashed rgba(var(--v-theme-on-surface), var(--v-border-opacity));
}
</style>
