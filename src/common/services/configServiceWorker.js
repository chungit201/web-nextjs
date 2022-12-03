import {removeData} from "./StorageService";

export const unregisterServiceWorker = async () => {
  // await removeData("REFRESH_TOKEN");
  // await removeData("ACCESS_TOKEN");
  await navigator.serviceWorker.getRegistrations().then(function (registrations) {
    for (let registration of registrations) {
      registration.unregister()
    }
  })

}