// // const {google} = require("googleapis");
// const {email} = require("../config");
//
// const getGmailAuthUrl = () => {
//   return new Promise(async (resolve, reject) => {
//     const oauth2Client = new google.auth.OAuth2(
//       email.auth.clientId, email.auth.clientSecret, email.auth.redirectUrl
//     );
//
//     const scopes = [
//       'https://mail.google.com/',
//       'https://www.googleapis.com/auth/blogger',
//       'https://www.googleapis.com/auth/calendar'
//     ];
//
//     const url = oauth2Client.generateAuthUrl({
//       access_type: 'offline',
//       scope: scopes
//     });
//     console.log(url);
//
//     resolve({oauth2Client, url});
//   });
// }
//
// const getGmailTokens = (oauth2Client, code) => {
//   return new Promise(async (resolve, reject) => {
//     const {tokens} = await oauth2Client.getToken(code).catch(e => {
//       reject(e);
//     });
//
//     oauth2Client.on('tokens', (tokens) => {
//       if (tokens.refresh_token) {
//         // store the refresh_token in my database!
//         console.log("refresh_token", tokens.refresh_token);
//       }
//       console.log("access_token", tokens.access_token);
//     });
//     resolve(tokens);
//   });
// }
//
// module.exports = {
//   getGmailAuthUrl,
//   getGmailTokens
// }