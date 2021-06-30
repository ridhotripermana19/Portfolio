// Register Service Worker
// Check jika browser support service worker
// jika support maka register service worker tersebut.
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/sw.js")
    .then((reg) =>
      console.log("service worker registered with scope: " + reg.scope)
    )
    .catch((err) => console.log("service worker not registered", err));
}
