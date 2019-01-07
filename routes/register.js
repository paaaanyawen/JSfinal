//firebase
var config = {
    apiKey: "AIzaSyBDM7pYJrAc2ye1D-hEvMHccc9tmh7HiGk",
    authDomain: "jsfinal-38f10.firebaseapp.com",
    databaseURL: "https://jsfinal-38f10.firebaseio.com",
    projectId: "jsfinal-38f10",
    
    storageBucket: "",
    messagingSenderId: "692214053813"
};
firebase.initializeApp(config);

function register() {
    Account = document.getElementById("account").value;
    Password = document.getElementById("pass").value;
    Name=document.getElementById("name").value;
    Phone=document.getElementById("phone").value;
    Add=document.getElementById("add").value;
    
    var database = firebase.database();
    if(Password!="")
    {
        var check=1;
        firebase.auth().createUserWithEmailAndPassword(Account, Password).catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            check=0;
            alert("Failed to register!"+errorMessage);
        });
        if(check==1){
            var createUser = database.ref('user').push();
                createUser.set({
                    "account": Account,
                    "pwd":Password,
                    "name":Name,
                    "phone":Phone,
                    "address":Add
                })
            alert("Welcome to join us.");
        }
    }
    else
    {
        alert("The password can not be empty!")
    }
    // if(Password!="" && Account!="" && Name!="" && Phone!="" && Add!="")
    // {
    //     // 撈取所有帳號
    //     var acclist;
    //     var database = firebase.database();
    //     database.ref('user').once('value',function(snapshot){
    //         var list=snapshot.val();
    //         var result=1;
    //         console.log(list);
    //         for(item in list){
    //             //比對帳號
    //             if(Account == list[item].account){                            
    //                 alert("此帳號已有人使用");
    //                 result=0;
    //             }                    
    //         }
    //         if(result==1){
    //             var createUser = database.ref('user').push();
    //                 createUser.set({
    //                     "account": Account,
    //                     "pwd":Password,
    //                     "name":Name,
    //                     "phone":Phone,
    //                     "address":Add
    //                 })
    //                 alert("註冊成功");                        
    //         }
    //     })
        
    // }
    // else
    // {
    //     alert("請填寫完整!")
    // }
}