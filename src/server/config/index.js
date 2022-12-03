const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.join(__dirname, '../../../.env.local') });

module.exports = {
  env: process.env.NODE_ENV,
  mongoose: {
    url: process.env.MONGODB_URL,/*((process.env.NODE_ENV === 'development') ? process.env.MONGODB_URL + "_dev" : process.env.MONGODB_URL),*/
    options: {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true
    },
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    accessExpirationMinutes: process.env.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: process.env.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: process.env.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: process.env.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
  },
  cookie: {
    httpOnly: true,
    sameSite: true,
    signed: true,
    secure: true,
  },
  email: {
    url: process.env.EMAIL_SERVER_URL,
    secret: process.env.EMAIL_SERVER_SECRET,
    from: `\"NorthStudio\'s Mailer\" ${process.env.EMAIL_SERVER_SENDER}`
  },
  gitLab: {
    privateToken: process.env.GITLAB_PRIVATE_TOKEN,
    apiUrl: process.env.GITLAB_API_URL
  },
  gCloud: {
    projectId: "english-or-foolish",
    clientEmail: "english-or-foolish@appspot.gserviceaccount.com",
    privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCtimZU0dvFB1lL\nbjBFOr0mjEkBzUi6r5KwzTiRL/gilXf8dNqqxsY6Mocy0ZdPqdq2Lj4g6xzVWwPR\n5QJY8AcrNSLu4uUtsMef9b20DrPbIaT8KnPnYj5YlXcAq7XvHIGM7MeyCgJHTUw2\njKiusA6Ghpan2WSl8HOzOHGDEn6mVZNvZqYfELUUoVKdKOZNYUemgqarpuUkgXaR\nkgFKQUWjAoovkfarE/8Qbf404UqZKFDaEMVXXa3RqUFFSOaHtTHa1rVVOE925epv\nIiA8cZFoVmAPUntQdZFydv+2elnAYc8CWl7uaEYD+lFL3cbswI1Y5dpQXuLolc78\nMePQ/PbXAgMBAAECggEAGCCkMOoVy7ia10bpmnvGgo6B3qiY565eDwtpRZ5NZG7d\nhhGvuTX2Uhm7pvrG4ReKG0bQnSkIaDga5DAaeceyvMogIjsU2/ELwBdIGbmVk0OD\n5F9On/6OZn3ZVBQ2MO6zVabcmMnqyS5bs0CDz03A/JPHwcG9dui4XVQyoU43944M\nEuoDYBYIC4p/+dJ0ZIEyqkGy3g8AffIi5892+figPA9I32vcw3f3txlcqzuhreyJ\nyg8S7fEhSmOSBpMSu9z2YGCKZSl0wRtmi32N2S6tyTkJhxDMP2YPBO4woi40yS7j\njb1ivnB1e4A8xFyzSHFcbXVO+NaOEdko8SB6FVGhCQKBgQDommetgThm4YS22ib0\nQOuSb2F+iAykI9E2j99AfZ7ttoBs8WLqkVSpXz9R9N+iQU0zYFmqhcU65MV+QVB+\nHsjdElGGlebUYNop6NHGBGD0bORpMjS0Hx6jMda28bmuVdHJIsoqPg1QBTYZv2AU\nGdLG8fRl/wwR7FR1zrnBfLbOawKBgQC+/x5a/v+SBpLqNwzSafSfFO+ezdRgzJ5b\nbf9R/u1yfh1MgiVNW6Feuk1LYw1iqMQOdwDPUyJpZ66LxACv/ZFvM9urA6bNBqBV\nKgQoBOWb1UIuJ0oh9J2nqEGmpSY34nKFNGoahvblI4h34+JR2g5x24Bk2fnsdg29\n/wZBdxL8RQKBgEefY9VVONzVDFyRh/UmGGOa0FZ55gqUzNMUMhZVmB5yV9Ez8tVv\nsrYEkibWVBZOLUtom7OaRUUBNJ7P1c1ABXGtNlVOyykSOZs2CYIDzyb0cNDDmN7t\nxi1SJ19lx1sbKeHZSI8BVHATark66IbH/NMtpafShRDvyIIOCby+fjvJAoGAHGB5\nGRnzzLVPVJ8TN5vobU5F/7kjCbK9AGaKXZtbmfwkzD413pVzl0hkvYOc9ICQiHmj\n1CnM3g46f6eCVqN83SG+TF1Bhgqq/Zw9e9imaI25xHOv7vWSCtvTzTeSQxFQ5HuS\nHBjbS9YIq49fC7wzEzWCkPlVyY0Mo6LlQgq39mUCgYA2mElnKmNOMFv9BX5Rd5Yn\nphP7Ajqm7qkWHMdWgdG7hP115Aj3/dAB8TLwQT4yPkWmuYIvKbV/d8bpwF9JeYlC\n03EKDSSDCYWwxPQerly5zU7ynEFenXJYV0LpLivV2imhx4vF82kr92zhMmWNlL3g\n6cL7GvN+E5+V6jJLWEXvjw==\n-----END PRIVATE KEY-----",
    baseUrl: "https://storage.googleapis.com/"
  }
};
