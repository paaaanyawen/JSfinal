// 輸入 database 網址
var admin = require("firebase-admin");

var serviceAccount = require("./jsfinal-38f10-firebase-adminsdk-caitr-d74a067775");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://jsfinal-38f10.firebaseio.com"
});

module.exports = admin.database();