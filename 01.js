const mongoose=require('mongoose');
const express=require('express');
const app=express();
app.engine('html',require('express-art-template'));
app.use('/public', express.static('public'));
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({extended: false});
app.listen(8080);
app.use(function (req,res,next) {
  res.header('Access-Control-Allow-Origin', '*')
  next()
})
app.get('/',function (req,res) {
  console.log(req.query);
  res.end(req.query.cb+'({id:1})')
});
app.get('/add',function (req,res) {
  res.end('{"id":1}')
});
app.post('/api/login',urlencodedParser,function (req,res) {
  console.log(req.body)
  res.end('{"status":200}')
});
app.get('/api/login',function (req,res) {
  res.end('{"status":200}')
});
