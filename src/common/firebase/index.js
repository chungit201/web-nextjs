import firebase from "firebase/app";
import "firebase/storage";
import "firebase/messaging";
const firebaseConfig = {
  apiKey: "AIzaSyA_DUmXNT8Cppg5VbKEhMDgGZa1JroGcCA",
  authDomain: "next-notification-103f2.firebaseapp.com",
  projectId: "next-notification-103f2",
  storageBucket: "next-notification-103f2.appspot.com",
  messagingSenderId: "222450228483",
  appId: "1:222450228483:web:f0394e6d915056b7725d36",
  measurementId: "G-PNXKFS6FEM"
};
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export {firebase as default};