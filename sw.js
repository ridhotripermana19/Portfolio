// Nama dari cache untuk file static.
const staticCacheName = "site-static-v3";

// Nama dari cache untuk file dynamic.
const dynamicCacheName = "site-dynamic-v3";

// List static asset yang akan di cache.
const assets = [
  "/",
  "/index.html",
  "/layout/404.html",
  "/layout/contact.html",
  "/images/1.png",
  "/images/2.png",
  "/images/3.png",
  "/images/4.png",
  "/images/5.jpg",
  "/images/6.png",
  "/images/profile.jpg",
  "/images/profile.png",
  "/images/profile-512x512.png",
  "/css/style.css",
  "/js/app.js",
];

// install event
// Menambahkan event listener pada event install di service worker.
self.addEventListener("install", (evt) => {
  console.log("service worker installed");
  // Method waitUntil digunakan untuk mengatakan ke event dispatcher
  // untuk menunggu operasi / task selesai dijalankan, dalam hal ini
  // event dispatcher akan menunggu keseluruhan static asset untuk di cache.
  // Method waitUntil juga akan membuat service worker kedalam installing phase,
  // sampai operasi didalam callback waitUntil selesai dijalankan.
  evt.waitUntil(
    // Buka cache storage dan menyimpan keseluruhan static file asset kedalam
    // cache storage dengan key yang didefinisikan pada constant variable staticCacheName.
    // method cache open mengembalikan / return sebuah promise (asyncrhonous operation),
    // untuk mendapatkan nilai dari promise, harus memanggil method then. method then sendiri
    // menerima 2 callback yaitu value, dan error callback (rejected promise). Pada caches open
    // sendiri ketika promise fullfilled (resolve) akan mengembalikan cache storage instance, yang
    // kemudian dari cache storage itu, akan ditambahkan static file yang telah dibuat didalam array
    // assets kedalam cache storage. method addAll menerima 1 buah parameter yaitu Iterable request
    // dan mengembalikan sebuah promise bertipe void.
    caches.open(staticCacheName).then((cache) => {
      console.log("caching shell assets");
      cache.addAll(assets);
    })
  );
});

// activate event
// Menambahkan event listener pada event activate di service worker.
self.addEventListener("activate", (evt) => {
  console.log("service worker activated");
  // Method waitUntil digunakan untuk mengatakan ke event dispatcher
  // untuk menunggu operasi / task selesai dijalankan. Method waitUntil
  // juga akan membuat service worker kedalam activating phase,
  // sampai operasi didalam callback waitUntil selesai dijalankan.
  evt.waitUntil(
    // ambil keseluruhan keys yang ada didalam caches storage
    // keys method mengembalikan sebuah promise dengan resolve value
    // berupa array string yang berisikan key - key yang terdapat pada cache storage.
    // untuk mengakses nilai dari keys method yang mengembalikan sebuah promise, digunakan
    // method then untuk mendapatkan value dari promise.
    caches.keys().then((keys) => {
      // Ketika keseluruhan keys yang ada di cache storage didapatkan, keys tersebut akan
      // di filter menggunakan method filter. method filter akan mengembalikan element dari
      // array jika suatu kondisi yang dispesifikasi didalam callback bernilai true, untuk kode
      // dibawah jika key yang ada dilocal storage tidak sama dengan key yang didefinisikan didalam
      // variable constant yang dibuat sebelumnya, maka key - key tersebut akan dikembalikan, kemudian
      // dari kembalian filter akan dipanggil map method yang mengembalikan sebuah array baru yang di kembalikan
      // didalam callback map, disini nilai kembalianya adalah array dari promise bertipe boolean, ini didapatkan
      // dari method caches.delete yang mengembalikan sebuah promise bertipe boolean. lalu karena kembalianya berupa
      // array promise untuk mengeksekusi keseluruhan promise tersebut, digunakanlah promise all untuk mengeksekusi
      // keseluruhan promise. method all dari promise menerima parameter sebuah array promise yang akan dieksekusi seluruhnya.
      // dan akan mengembalikan nilai tersebut dalam bentuk array.
      return Promise.all(
        keys
          .filter((key) => key !== staticCacheName && key !== dynamicCacheName)
          .map((key) => caches.delete(key))
      );
    })
  );
});

// fetch events
// Menambahkan event listener pada event fetch di service worker.
self.addEventListener("fetch", (evt) => {
  // method respondWith akan menghentikan default fetch handling dari
  // browser dan mengijinkan kita untuk memberikan promise untuk response yang dibuat.
  evt.respondWith(
    // Memeriksa setiap cache di app, jika terdapat salah satu key yang cocok dengan request
    // dikarenakan match method mengembalikan promise maka untuk mengambil value tersebut, harus
    // menggunakan method then untuk mendapatkan value dari promise tersebut.
    caches
      .match(evt.request)
      .then((cacheRes) => {
        // Jika ketemu maka kembalikan response dari cache, apabila tidak ditemukan maka fetch request
        // tersebut dan kemudian simpan fetch response tersebut kedalam cache dengan key nya berdasarkan
        // dari request url. cache yang disimpan berupa object key value pair.
        return (
          cacheRes ||
          fetch(evt.request).then(async (fetchRes) => {
            const cache = await caches.open(dynamicCacheName);
            cache.put(evt.request.url, fetchRes.clone());
            return fetchRes;
          })
        );
      })
      // Jika terdapat error maka tangkap error tersebut menggunakan
      // method catch. jika error dikarenakan request url dikarenakan
      // mengakses laman html yang tidak ada maka kembalikan cache yang
      // key nya cocok dengan /layout/404.html yaitu laman 404.html sendiri
      // yang mengatakan bahwa laman dari request url yang diberikan tidak ada.
      .catch(() => {
        if (evt.request.url.indexOf(".html") > -1) {
          return caches.match("/layout/404.html");
        }
      })
  );
});
