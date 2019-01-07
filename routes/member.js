var express = require('express');
var router = express.Router();
var admin = require("firebase-admin");

/* GET home page. */
router.get('/profile', function (req, res, next) {
    res.render('profile', { title: '會員資料',data :'這是會員頁面' });

});

router.get('/login', function (req, res, next) {
    res.render('login', { title: '登入',data :'' });

});

router.get('/register', function (req, res, next) {
    res.render('register', { title: '註冊',data :'' });

});

router.get('/cart', function (req, res, next) {
    res.render('cart', { title: '購物車',data :'這購物車頁面' });

});

module.exports = router;
