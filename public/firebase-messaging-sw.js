importScripts('https://www.gstatic.com/firebasejs/4.6.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.6.0/firebase-messaging.js');

firebase.initializeApp({
  'messagingSenderId': "222450228483",
});
const messaging = firebase.messaging();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", async function () {
    await Notification.requestPermission()
      .then(permission => {
        if (permission === 'granted') {
          //If notification is allowed
          navigator.serviceWorker.ready.then(p => {
            p.pushManager.getSubscription().then(subscription => {
              if (subscription === null) {
                console.log('granted!!!!!');
                //If there is no notification subscription, register.
                let re = p.pushManager.subscribe({
                  userVisibleOnly: true
                })
              }
            })
          })
        }
      })
  })
}

