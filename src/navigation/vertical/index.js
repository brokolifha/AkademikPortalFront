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
