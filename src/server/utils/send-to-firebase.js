import fetch from 'node-fetch';
const requestFireBase = async (notification_body) => {
  await fetch('https://fcm.googleapis.com/fcm/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `key=${process.env.SERVER_KEY_FIREBASE}`,
    },
    body: JSON.stringify(notification_body)
  })
}
module.exports = {
  requestFireBase
}