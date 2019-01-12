var express = require('express');
var router = express.Router();
var admin = require("../service/firedata");

/* GET home page. */
router.get('/profile', function (req, res, next) {
    var data;
    admin.ref('user/'+req.cookies.status.unumber ).once('value',function(snapshot){        
        data=snapshot.val();
        console.log(data.account);
        res.render('profile', 
        { title: '會員資料',
        data :data,
        logStatus: req.cookies.status });
    })  
});

router.get('/order', function (req, res, next) {
    res.render('order', { title: '訂單查詢',logStatus: req.cookies.status }); 
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
                            '<td>'+parseInt(list[item].product[pitem].price)*parseInt(list[item].product[pitem].amount)+'</td>'+
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
            res.render('cart', { title: '購物車',logStatus: req.cookies.status,message:'',trdata:str,totalcost:totalcost });
        })
    }else{
        res.render('cart', { title: '購物車',logStatus: req.cookies.status, message:'請先登入',trdata:'',totalcost:'' });
    }
     
});

router.post('/delete_cart',function(req,res,next){
    console.log(req.body.item+"  "+req.body.pitem);
    var remove =admin.ref('cart/' + req.body.item + '/product/' + req.body.pitem);
	remove.remove();
    var totalcost=0;    
    res.render('cart', { title: '購物車',logStatus: req.cookies.status,message:'',trdata:'<meta http-equiv="refresh" content="0;url=/member/cart" />',totalcost:totalcost });
    
});

router.post('/set_order',function(req,res,next){
    var data;
    admin.ref('user/'+req.cookies.status.unumber ).once('value',function(snapshot){        
        data=snapshot.val();
        console.log(data.account);
        res.render('orderdata',{title:'訂單寄送資料',logStatus:req.cookies.status,message:'',data :data,cost: req.cookies.totalcost.cost});           
    })
    
});

router.post('/create_order',function(req,res,next){
    
    admin.ref('cart/'+req.cookies.ucart.cartNumber+'/product').once('value',function(snapshot){
        data=snapshot.val();
        console.log(data);
        for(item in data){
            var createOrder = admin.ref('order').push();
            createOrder.set({
                'account':req.cookies.uid,
                'name':req.body.name,
                'phone':req.body.phone,
                'address':req.body.address,
                'totalcost':req.cookies.totalcost.cost,
                'product':data                
            })
        }
    });
    setTimeout(function(){
        res.render('order',{title:'訂單查詢',logStatus:req.cookies.status});
    },1000)
    
});
module.exports = router;
