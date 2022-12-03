const CF = require("cloudflare");
const CloudflareConfig = require("../config/cloudflare.config");

const Cloudflare = CF({
  email: CloudflareConfig.email,
  key: CloudflareConfig.key
});

module.exports = Cloudflare;
