const express = require('express');
const app = express();
app.engine('html',require('express-art-template'));
// 创建 application/x-www-form-urlencoded 编码解析
const apiRouter = require('./routes/api');
const loginRouter = require('./routes/login');
const session = require('express-session');
const cookieParser=require('cookie-parser');
const bodyParser = require('body-parser');
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(function (req,res,next) {
  res.header('Access-Control-Allow-Origin', 'http://172.17.14.250:8080');
  // res.header('Access-Control-Allow-Credentials','true');
  // res.header("Access-Control-Allow-Headers", "Content-Type,username");
  next()
});
//中间件
// app.use('/',function (req,res,next) {
//     next();
// });
app.use('/public', express.static('public'));
app.use('/touxiang', express.static('touxiang'));
app.use(session({
    secret:'qwerty',
    resave:false,
    saveUninitialized:true
}));
// app.use(function (req,res,next) {
//     console.log(req.session);
//     if(req.url!='/login'&&req.url!='/stu/create'&&!req.session.isLogin){
//         return res.redirect('/login');
//     }
//     next();
// });
app.use('/api',apiRouter);
app.use('/',loginRouter);

var server = app.listen(80, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("应用实例，访问地址为 http://%s:%s", host, port)
});
