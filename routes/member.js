var express = require('express');
var router = express.Router();
var admin = require("../service/firedata");

/* GET home page. */
router.get('/profile', function (req, res, next) {
    if(req.cookies.status){
        var data;
        admin.ref('user/'+req.cookies.status.unumber ).once('value',function(snapshot){        
            data=snapshot.val();
            console.log(data.account);
            res.render('profile', 
            { title: '會員資料',
            data :data,
            logStatus: req.cookies.status,
            identity:req.cookies.status.uidentity,
            message:'會員資料' });
        })  
    }else{
        res.render('profile', 
            { title: '會員資料',
            data :data,
            logStatus: req.cookies.status,
            identity:"",
            message:'請先登入' });
    }
});

router.get('/order', function (req, res, next) {
    if(req.cookies.status){
        admin.ref('order/'+req.cookies.status.uid).once('value',function(snapshot){
            myOrder=snapshot.val();
            res.render('order', { title: '訂單查詢',
                                logStatus: req.cookies.status,
                                message:'',
                                myOrder:myOrder
                                ,identity:req.cookies.status.uidentity});
        })        
    }else{
        res.render('order', { title: '訂單查詢',
                                logStatus: req.cookies.status,
                                 message:'請先登入',
                                 identity:"" });
    } 
});

router.get('/cart', function (req, res, next) {
    if(req.cookies.status){
        var str='';
        var totalcost=0;
        admin.ref('cart').once('value',function(snapshot){
            var list=snapshot.val();
            for(item in list){
                //var key=0;
                if(list[item].account == req.cookies.status.uid){
                    console.log(list[item]);
                    //key=1;
                    for(pitem in list[item].product){
                        str+='<tr"><td>'+list[item].product[pitem].productName+'</td>'+                            
                            '<td>'+list[item].product[pitem].size+'</td>'+
                            '<td>'+list[item].product[pitem].amount+'</td>'+
                            '<td>'+list[item].product[pitem].price+'</td>'+
                            '<td><form action="delete_cart" method="post">'+
                                '<input type="hidden" value="'+item+'" name="item">'+
                                '<input type="hidden" value="'+pitem+'" name="pitem">'+
                                '<input type="submit" value="刪除"></form>'+
                            '</td></tr>'
                        totalcost+=parseInt(list[item].product[pitem].price)*parseInt(list[item].product[pitem].amount);
                    }  
                    res.cookie('ucart',{
                        'cartNumber':item
                    })  
                    console.log('cartNum:'+req.cookies.ucart);
                    res.cookie('totalcost',{
                        'cost':totalcost
                    })                                   
                }
            }
            //console.log(str);
            res.render('cart', { title: '購物車',logStatus: req.cookies.status,message:'',trdata:str,totalcost:totalcost,identity:req.cookies.status.uidentity });
        })
    }else{
        res.render('cart', { title: '購物車',logStatus: req.cookies.status, message:'請先登入',trdata:'',totalcost:'',identity:"" });
    }
     
});

router.post('/delete_cart',function(req,res,next){
    console.log(req.body.item+"  "+req.body.pitem);
    var remove =admin.ref('cart/' + req.body.item + '/product/' + req.body.pitem);
    remove.remove();
    totalcost=0;
    res.render('cart', { title: '購物車',
                        logStatus: req.cookies.status,message:'',
                        trdata:'<meta http-equiv="refresh" content="0;url=/member/cart" />',
                        totalcost:totalcost,
                        identity:req.cookies.status.uidentity });    
});

router.post('/set_order',function(req,res,next){
    var data;
    if(req.cookies.totalcost.cost == "0"){
        res.render('cart', { title: '購物車',
                            logStatus: req.cookies.status,
                            message:'購物車內沒有商品',
                            trdata:"",
                            totalcost:req.cookies.totalcost.cost,
                            identity:req.cookies.status.uidentity });
    }else{
        admin.ref('user/'+req.cookies.status.unumber ).once('value',function(snapshot){        
            data=snapshot.val();
            console.log(data.account);
            res.render('orderdata',{title:'訂單寄送資料',
                                    message:'',
                                    data :data,
                                    cost: req.cookies.totalcost.cost,
                                    logStatus: req.cookies.status,
                                    identity:req.cookies.status.uidentity});           
        })
    }
});

router.post('/create_order',function(req,res,next){
    
    admin.ref('cart/'+req.cookies.ucart.cartNumber+'/product').once('value',function(snapshot){
        data=snapshot.val();
        //console.log(data);            
        var Today=new Date();
        console.log("今天日期是 " + Today.getFullYear()+ " 年 " + (Today.getMonth()+1) + " 月 " + Today.getDate() + " 日")
        var createOrder = admin.ref('order/'+req.cookies.status.uid).push();
        createOrder.set({
            'name':req.body.name,
            'phone':req.body.phone,
            'address':req.body.address,
            'totalcost':req.cookies.totalcost.cost,
            'product':data,
            'date':Today.getFullYear()+'/'+(Today.getMonth()+1)+'/'+Today.getDate()                
        })
        var remove =admin.ref('cart/' + req.cookies.ucart.cartNumber);
        remove.remove();
        res.render('completeorder',{title:'訂單已建立',
                                    logStatus: req.cookies.status,
                                    name:req.body.name,
                                    phone:req.body.phone,
                                    address:req.body.address,
                                    cost:req.cookies.totalcost.cost,
                                    data:data,
                                    date:Today.getFullYear()+'/'+(Today.getMonth()+1)+'/'+Today.getDate(),
                                    identity:req.cookies.status.uidentity});
    });
    
    
});
module.exports = router;
