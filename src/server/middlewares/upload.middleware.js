import { IncomingForm } from 'formidable'
import httpStatus from "http-status";
import ApiError from "../utils/api-error";
import { errorHandler } from "./index";
import { Storage } from '@google-cloud/storage';
import multer from "multer";
import {storageEngine} from 'multer-cloud-storage';

export const multerUpload = async (req, res) => {
  return new Promise(resolve => {
    try {
      const fileFilter = (req, file, cb) => {
        try {
          if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/jpg") {
            cb(null, true)
          } else {
            cb(new Error("This file is not accepted."), false);
          }
        } catch (e) {
          console.error(e);
        }
      };

      const upload = multer({
        storage: storageEngine({
          filename: function (req, file, cb) {
            cb(null, req.user._id + '-avatar-' + new Date().getTime() + '-' + file.originalname.split(".").pop());
          }
        }),
        limits: {
          // Maximum size is 2MB
          fileSize: 2 * 1024 * 1024
        },
        fileFilter: fileFilter
      }).single('file');
      upload(req, res, err => {
        console.log(err);
        if (err) throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Provided file is not accepted');
        resolve();
      });
    } catch (err) {
      errorHandler(err, req, res);
    }
  });
}

export const connectToBucket = () => {
  const gStorage = new Storage({
    projectId: process.env.GCLOUD_PROJECT_ID,
    credentials: {
      client_email: process.env.GCLOUD_CLIENT_EMAIL,
      private_key: process.env.GCLOUD_PRIVATE_KEY
    }
  });

  return gStorage.bucket("english-or-foolish");
}

export const uploadData = (req, res, extFilter = [], limitedSize = 10 * 1024 * 1024) => {
  return new Promise((resolve, reject) => {
    const bucket = connectToBucket();
    const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 1E9);

    const form = new IncomingForm();
    form.parse(req, async (err, fields, files) => {
      try {
        if (err) {
          console.log(err)
          throw new ApiError(httpStatus.BAD_REQUEST, "Failed to upload file");
        }
        req.body = fields;
        if (Object.keys(files).length <= 0 || !Object.keys(files).includes("file")) return resolve();

        const { newFilename, filepath, mimetype: rawMimetype, size } = files.file;
        const mimetype = rawMimetype.split("/")[1];
        const destFileName = `${newFilename}_${uniqueSuffix}.${mimetype}`
        // console.log("filepath", filepath);
        // console.log(destFileName);
        const gFile = await bucket.upload(filepath, {
          destination: destFileName,
        }).catch(err => console.log(err))

        if (!extFilter.includes(mimetype)) {
          throw new ApiError(httpStatus.BAD_REQUEST, "Invalid file type");
        }

        if (size > limitedSize) {
          throw new ApiError(httpStatus.BAD_REQUEST, "This file was too large to upload");
        }
        req.file = files.file;
        req.file.linkUrl = gFile[1]["mediaLink"];
        resolve();
      } catch (err) {
        errorHandler(err, req, res);
      }
    });
  });
}

export default uploadData;