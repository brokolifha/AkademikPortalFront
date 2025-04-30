import { useCookie } from "@/@core/composable/useCookie";

import adayMenu from "./aday-menu.js";
import adminMenu from "./admin-menu.js";
import juriMenu from "./juri-menu.js";
import yoneticiMenu from "./yonetici-menu.js";
const userData = useCookie("userData");


let list = [
  {
    title: "Anasayfa",
    to: { name: "root" },
    icon: { icon: "tabler-smart-home" },
  },
];

if (userData && userData.value.rol == "aday") {
  list = [...list, ...adayMenu];
}

if (userData && userData.value.rol == "juri") {
  list = [...list, ...juriMenu];
}

if (userData && userData.value.rol == "yonetici") {
  list = [...list, ...yoneticiMenu];
}

if (userData && userData.value.rol == "admin") {
  list = [...list, ...adminMenu];
}

console.log([...list]);
export default [...list]

/*

export default [
  {
    title: "Anasayfa",
    to: { name: "root" },
    icon: { icon: "tabler-smart-home" },
  },
  {
    title: "Kullanıcılar",
    icon: { icon: "tabler-file" },
    children: [
      {
        title: "Kullanıcı Listesi",
        to: { name: "users" },
      },
    ],
  },
];
*/
