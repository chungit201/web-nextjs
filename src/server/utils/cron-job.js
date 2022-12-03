const util = require("util");
const CronJob = require("cron").CronJob;

/**
 * @param {string} time
 * @param {function} callback
 */
const job = (time, callback) => {
  return new CronJob(time, callback, null, true, 'Asia/Ho_Chi_Minh',
  ).start();
}

module.exports = job;