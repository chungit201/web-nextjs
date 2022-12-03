const axios = require("axios");
const httpStatus = require("http-status");
const {email} = require("../config")
const ApiError = require("../utils/api-error");

/**
 * Send email
 * @param {Object} mailData - Mail data
 * @param {string} mailData.receiver - Receiver
 * @param {string} mailData.subject - Subject of email
 * @param {string} mailData.content - Content of mail
 * @returns {Object}
 */
const sendEmail = async (mailData) => {
  try {
    const res = await axios({
      url: email.url,
      method: "post",
      data: {
        "secret": email.secret,
        "from": email.from,
        "to": mailData.receiver,
        "subject": mailData.subject,
        "html": mailData.content
      },
      headers: {
        "Content-Type": "application/json"
      }
    });
    return res.data;
  } catch (e) {
    console.log(e)
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Cannot send email");
  }
}

module.exports = {
  sendEmail
}

