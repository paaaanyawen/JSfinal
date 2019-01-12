var express = require('express');
var router = express.Router();
var admin = require('../service/firedata')
var logStatus = false;
/* GET home page. */
router.get('/register', function(req, res, next) {
    res.render('register', { title: '註冊',message :'',logStatus: req.cookies.status });
})
router.post('/do_register', function(req, res, next) {
    console.log(req.body.uid)
    //寫到firebase    
    if(req.body.pwd!="" && req.body.uid!="" && req.body.name!="" && req.body.phone!="" && req.body.address!="")
        {
            // 撈取所有帳號
            var acclist;
            //var database = firebase.database();
            admin.ref('user').once('value',function(snapshot){
                var list=snapshot.val();
                var result=1;
                console.log(list);
                for(item in list){
                    //比對帳號
                    if(req.body.uid == list[item].account){                            
                        res.render('register',{title: '註冊',message: '此帳號已有人使用',logStatus: req.cookies.status});
                    
                        result=0;
                    }                    
                }
                if(result==1){
                    var createUser = admin.ref('user').push();
                    createUser.set({
                        "account": req.body.uid,
                        "pwd":req.body.pwd,
                        "name":req.body.name,
                        "phone":req.body.phone,
                        "address":req.body.address
                    })
                    //傳到登入頁面
                    res.render('login', { title: '登入',message :'',logStatus: req.cookies.status });                       
                }
            })
            
        }
        else
        {           
            //傳到他要去的頁面
            res.render('register', { title: '註冊',message:'請填寫完整!',logStatus: req.cookies.status });
        }
    
})
router.get('/login', function (req, res, next) {
    res.render('login', { title: '登入',message :'',logStatus: req.cookies.status });

});
router.post('/do_login', function(req, res, next){
     admin.ref('user').once('value',function(snapshot){
        var list=snapshot.val();
        var accCheck=0;        
        for(item in list){
            if(req.body.account == list[item].account){
                accCheck=1;
                if(req.body.pwd == list[item].pwd){                    
                    console.log("登入成功"+req.body.account+list[item].name+item);
                    logStatus = true;
                    res.cookie('status', {
                        'uid': req.body.account,
                        'uname': list[item].name,
                        'unumber':item
                    })
                    console.log(req.cookies.status);
                    res.render('index', { title: '首頁', logStatus: logStatus});
                }else{
                    res.render('login', { title: '登入',message :'密碼錯誤' ,logStatus: req.cookies.status});
                }
            }
        }
        if(accCheck==0){
            res.render('login', { title: '登入',message :'無此帳號' ,logStatus: req.cookies.status});
        }
    })
    
})
router.get('/', function(req, res, next) {
    res.render('index',{title: '首頁',logStatus: req.cookies.status})
});


router.get('/do_logout', function (req, res, next) {
    res.cookie('status', "")
    logStatus = false;
    res.render('login',
                { title: '登出成功' ,
                    logStatus: logStatus,
                    message: ''});
    
});

module.exports = router;