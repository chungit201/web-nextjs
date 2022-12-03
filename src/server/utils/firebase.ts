import admin from "firebase-admin";
import type { ServiceAccount } from "firebase-admin";
import { firebaseConfig, firebaseAdminConfig } from "server/config/firebase.config";
import firebase from "firebase/app";

export const getToken = () => {
  firebase.initializeApp(firebaseConfig);
  return firebase.messaging().getToken();
}

export const sendMessage = (body, title, tokens) => {
  admin.initializeApp({
    credential: admin.credential.cert(firebaseAdminConfig as ServiceAccount),
    databaseURL: "https://igclone-2b707-default-rtdb.asia-southeast1.firebasedatabase.app/"
  });
  const arrTokens = tokens.split(",");
  //[device1,device2,....]
  const message = {
    android: {
      notification: {
        body: body,
        title: title,
      },
      //priority: "high"
    },
    apns: {
      headers: {
        "apns-priority": "10",
        "apns-expiration": "360000",
      },
      payload: {
        aps: {
          alert: {
            title: title,
            body: body,
          },
          sound: "default",
        },
        data: "some custom data",
      },
    },
    tokens: arrTokens,
  };
  console.log("Message -----" + JSON.stringify(message));
  admin
    .messaging()
    .sendMulticast(message)
    .then((batchResponse) => {
      console.log(batchResponse);

    })
    .catch((error) => {
      console.log("error", error);
    });
}

