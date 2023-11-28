var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var fs = require('fs');
var cookieParser = require('cookie-parser');
var jwt = require('jsonwebtoken');
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());

app.get('/',function(req,res){
    res.sendFile(__dirname+'/login.html')
})
app.get('/register',function(req,res){
    res.sendFile(__dirname+'/register.html')
})
app.get('/login',function(req,res){
    res.sendFile(__dirname+'/login.html')
})
app.post('/authenticate',function(req,res){
    // console.log(req.body.email)
    var validate = JSON.parse(fs.readFileSync('register.txt'));
    // console.log(validate)
    var filterdata = validate.filter((user)=>{
        if(user.email === req.body.email && user.password === req.body.password){
            return true
        }
    })
    if(filterdata.length!=0){
        var token = jwt.sign({email:req.body.email,password:req.body.password},"srinath");
        res.cookie('token',token);
        // res.sendFile(__dirname+"/dashboard.html");
        res.redirect('/workout')
    }
    else{
        res.sendFile(__dirname+"/login1.html")
    }
})
app.post('/',function(req,res){
    var details = JSON.parse(fs.readFileSync("register.txt").toString());
    details.push(req.body);
    fs.writeFileSync('register.txt',JSON.stringify(details))
    res.sendFile(__dirname+'/login.html')
})
app.get('/workout',function(req,res){
    var loginedUser = jwt.decode(req.cookies.token);
    // console.log(loginedUser.email)
    var workoutdetails = JSON.parse(fs.readFileSync('workoutdetails.txt'));
    // console.log(workoutdetails)
    res.render('workout',{alldeatils:workoutdetails,username:loginedUser.email});
})
app.get('/report',function(req,res){
    var loginedUser = jwt.decode(req.cookies.token);
    var reportdetails = JSON.parse(fs.readFileSync('report.txt'));
    // console.log(reportdetails)
    res.render('report',{allreportdetails:reportdetails,username:loginedUser.email});
})
app.get("/workoutdata/:Day",function(req,res){
    var loginedUser = jwt.decode(req.cookies.token);
    var data = JSON.parse(fs.readFileSync("daywiselist.txt").toString())
    var filterdata = data.filter((data)=>{
        if(data.Day == req.params.Day){
            return true
        }
    })
    res.render('workoutdetails',{alldata:filterdata,username:loginedUser.email,Day:req.params.Day})
})
app.post('/reportdata/:Day',function(req,res){
    var User = jwt.decode(req.cookies.token);
    var data1 = JSON.parse(fs.readFileSync("daywiselist.txt").toString())
    var filterdata = data1.filter((data)=>{
        if(data.Day == req.params.Day){
            return true
        }
    })
    var x = filterdata[0];
    var Date = req.body.date;
    var report = JSON.parse(fs.readFileSync("report.txt").toString())
    report.push({...x,Date,User:User.email});
    fs.writeFileSync('report.txt',JSON.stringify(report))
    res.redirect('/report')
})
app.listen(3500,()=>{console.log("Server running on 3500")})