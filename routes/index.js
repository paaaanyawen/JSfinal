var express = require('express');
var router = express.Router();
// Initialize Firebase

/* GET home page. */
router.get('/', function(req, res, next) {
 
    // res.render('index', { title: 'hello' });
    var list={
        1:{n:'sss'},
        2:{n:'aaa'}
    };


    res.render('index', { 
        title: 'hello', 
        myName : '洧杰',
        list: list,
        tag: "<h1>hi</h1>" }
        );
});

module.exports = router;