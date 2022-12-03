module.exports = {
  reactStrictMode: true,
  webpack5: true,
  webpack: (config) => {
    config.resolve.fallback = {
      child_process:false,
      constants:false,
      fs: false,
      crypto: false,
      stream: false,
      path: false,
      http: false,
      zlib: false,
      os: false,
      net: false,
      tls: false,
      // assert: false,
      // buffer: false,
      // console: false,
      // constants: false,
      // domain: false,
      // events: false,
      https: false,
      // punycode: false,
      // process: false,
      // querystring: false,
      // string_decoder: false,
      // sys: false,
      // timers: false,
      // tty: false,
      // url: false,
      // util: false,
      // vm: false,
    };

    return config;
  },
}
