var express = require("express")
var bodyParser = require("body-parser")
var mongoose = require("mongoose")
const { message } = require("statuses")
const { validationResult } = require('express-validator')
const app = express()

app.use(bodyParser.json())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({
    extended:true
}))

mongoose.connect('mongodb://localhost:27017/Membership',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

var db = mongoose.connection;

db.on('error',()=>console.log("Error in Connecting to Database"));
db.once('open',()=>console.log("Connected to Database"))

app.post("/sign_up",(req,res)=>{
    var name = req.body.Name;
    var email = req.body.email;
    var password = req.body.pwd;
    var gender = req.body.gender;
    var course = req.body.c;
    var City = req.body.City;

    var data = {
        "name": name,
        "email" : email ,
        "password" : password,
        "gender": gender,
        "City": City


    }
    
    db.collection('registrations').insertOne(data,(err,collection)=>{
        if(err){
            throw err;

        }
        ("Record Inserted Successfully");
        res.redirect('/login.html');
        return;
    });
})
const mysql= require('mysql')

var mysqlcon=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'vihaan10',
    database:'project',
    port:3306

});
mysqlcon.connect((err)=>{
    if(!err)
    console.log('Connection established!');
    else
    console.log('Connection failed!')+JSON.stringify(err,undefined);
});

app.post("/contact",(req,res)=>{
    let name = req.body.cfname;
    let email = req.body.cfemail;
    let feedback=req.body.cfmessage;
    let a=[[name,email,feedback]];
    var sql="INSERT INTO feedback(name,email,feedback) values ?";
    mysqlcon.query(sql,[a],(err,results,rows)=>{
        if(!err)
        {
            console.log("Thank you for your feedback!")
            res.redirect('index.html')
            return;
        }
        else
        console.log(err.message);
    })
})

app.get("/login", function (req, res) {
    return res.redirect('/login.html');
});


//Handling user login
app.post("/login", function (req, res) {
    var email = req.body.email;
    var password = req.body.password;
    var query9={"email" : { $eq : email}};
    db.collection("registrations").find(query9,{projection:{_id:0,password:1}}).toArray(function(err,result){
            if (err) throw err;
            if(result.length == 0)
            {
                console.log("User not found!!");
                return res.redirect('unsucessful.html');
            }
            else
            {
                if (result[0].password == password)
                {
                    return res.redirect('login_success.html');
                }
                else
                {
                    console.log("Password not matching")
                    return res.redirect('unsucessful.html');
                }
            }
    });
});
 
//Handling user logout
app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect("/login");
}


app.get("/",(req,res)=>{
    res.set({
        "Allow-access-Allow-Origin": '*'
    })
    return res.redirect('index.html');
}).listen(3000);


console.log("Listening on PORT 3000");