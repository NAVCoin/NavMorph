module.exports = {
  "app": {
    "static": "STRING",
    "apiUri": "STRING",
    "catchAllUri": "STRING"
  },

  "serverPort": "PORT",

  "sslCert": {
    "days": "NUMBER",
    "selfSigned": "BOOLEAN"
  },

  "mongoDBUrl": "STRING",

  "version": "STRING",

  "navClient": {
    "username": "STRING",
    "password": "STRING",
    "port": "PORT",
    "host": "STRING"
  },
  "changellyApiEndPoints": {
    "getCurrencies": "STRING",
    "getMinAmount": "STRING",
    "getExchangeAmount": "STRING",
    "generateAddress": "STRING",
    "getTransaction": "STRING",
    "getExchangeStatus": "STRING"
  },
  "changellyUrl": "STRING",
  "changellyKey": "STRING",
  "changellySecretKey": "STRING",
  "mailSettings": {
    "smtp": {
      "user": "STRING",
      "pass": "STRING",
      "server": "STRING"
    },
    "clientId": "STRING",
    "clientSecret": "STRING",
    "refreshToken": "STRING",
    "notificationEmail": "STRING",
    "authCode": "STRING"
  },
  "validOrderStatuses": "ARRAY",

  "timeConsts": {
    "changelly": "ARRAY",
    "navTech": "ARRAY"
  },
  "basicAuth": {
    "name": "STRING",
    "pass": "STRING"
  }
}
