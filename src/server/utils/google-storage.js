// Instantiate a storage client
import {Storage} from "@google-cloud/storage";
import {gCloud} from "server/config";

const gStorage = new Storage({
  projectId: gCloud.projectId,
  credentials: {
    client_email: gCloud.clientEmail,
    private_key: gCloud.privateKey
  }
});

const bucket = gStorage.bucket("english-or-foolish");

/**
 * @param {string} filepath
 * @return {Promise}
 */
const deleteFile = (filepath) => {
  return new Promise(async (resolve) => {
    await bucket.file(filepath.split("/").pop().split("?")[0]).delete();
    resolve("Delete previous file successfully");
  });
}

/**
 * @param {string} filepath
 * @param {Object} options
 * @return {Promise}
 */
const uploadFile = (filepath, options) => {
  return new Promise(async (resolve) => {
    const gFile = await bucket.upload(filepath, options);
    resolve(gFile);
  });
}

export {
  deleteFile,
  uploadFile
}
