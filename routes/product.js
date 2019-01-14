var express = require('express');
var router = express.Router();
var admin = require("../service/firedata");

/* GET home page. */
router.get('/yeezy350', function (req, res, next) {
    if(req.cookies.status)
        res.render('yeezy350', { title: 'yeezy350',logStatus: req.cookies.status,message:'',identity:req.cookies.status.uidentity });
    else
        res.render('yeezy350', { title: 'yeezy350',logStatus: req.cookies.status,message:'',identity:"" });
});
router.get('/yeezy350v2', function (req, res, next) {
    if(req.cookies.status)
        res.render('yeezy350v2', { title: 'yeezy350v2',logStatus: req.cookies.status,message:'',identity:req.cookies.status.uidentity });
    else
        res.render('yeezy350v2', { title: 'yeezy350v2',logStatus: req.cookies.status,message:'',identity:"" });

});
router.get('/yeezy700', function (req, res, next) {
    if(req.cookies.status)
        res.render('yeezy700', { title: 'yeezy700',logStatus: req.cookies.status,message:'',identity:req.cookies.status.uidentity });
    else
        res.render('yeezy700', { title: 'yeezy700',logStatus: req.cookies.status,message:'',identity:"" });
});

router.post('/add_cart', function (req, res, next){
    if(req.cookies.status){
        var createCart = admin.ref('cart').push();    
        admin.ref('cart').once('value',function(snapshot){
            var list=snapshot.val();
            //console.log(list);
            var key=0;//判斷有無資料的key
            for(item in list){
                console.log(list[item].account+req.cookies.status.uid);
                //如果購物車裡已有資料
                if(list[item].account == req.cookies.status.uid){
                    key=1;
                    pkey=0;//判斷有無相同商品的key

                    //同商品&&同尺寸 加上數量
                    for(pitem in list[item].product){
                        if(list[item].product[pitem].productName == req.body.productName && list[item].product[pitem].size == req.body.size){                        
                            pkey=1;
                            //console.log("same" + pkey);
                            admin.ref('/cart/'+item+'/product/'+pitem).update({
                                "amount":parseInt(list[item].product[pitem].amount)+parseInt(req.body.amount)
                            })
                        }
                    }
                    if(pkey == 0){
                        //console.log("not same" + pkey);
                        admin.ref('/cart/'+item+'/product').push({                    
                            "productName":req.body.productName,
                            "price":req.body.price,
                            "size":req.body.size,
                            "amount":req.body.amount                    
                        }) 
                    }                             
                }
            }
            //如果購物車裡沒有東西，新建一筆資料
            if(key == 0){
                createCart.set({
                    "account":req.cookies.status.uid,
                    "product":{
                        0:{
                            "productName":req.body.productName,
                            "price":req.body.price,
                            "size":req.body.size,
                            "amount":req.body.amount
                        }
                    }
                })               
            }
        })        
        res.render(req.body.productName, { title: req.body.productName,logStatus: req.cookies.status,message:'',identity:req.cookies.status.uidentity });
    }else{
        res.render(req.body.productName, { title: '登入',logStatus: req.cookies.status, message:'請先登入',identity:req.cookies.status.uidentity });        
    }
})
module.exports = router;
