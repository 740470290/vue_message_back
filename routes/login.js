const express = require('express');
// const mongoose=require('mongoose');
const fs = require("fs");
const router = express.Router();
// const MongoClient = require('mongodb').MongoClient;
// const url = "mongodb://localhost:27017/";
// const userModel=mongoose.model('User',User);
// const url='mongodb://localhost:27017/runoob';
// mongoose.connect(url,{useNewUrlParser:true});
const db=require('../model/db');
const user=db.models.User;
const msg=db.models.Msg;
const formidable=require('formidable');
const gm=require('gm');
const md5=require('../model/myMd5').myMd5;



router.get('/moPic', function (req, res) {
    res.render('moPic.html')
});
router.post('/moPic', function (req, res) {
    const newName=req.session.userInfo;
    const form = new formidable.IncomingForm();
    form.uploadDir='./';
    form.keepExtensions = true;
    form.parse(req, function(err, fields, files) {
        const oldPath=files.pic.path;
        const name=files.pic.name;
        const last=oldPath.slice(oldPath.lastIndexOf('.'));
        fs.rename(oldPath,'./touxiang/'+newName+last,function (err) {
            console.log(err)
            res.render('cut.html',{path:'./touxiang/'+newName+last})
        })
    })
});
router.get('/modMsg', function (req, res) {
    db.updata(msg,{_id:db.obj(req.query.id)},{msg:req.query.content},function () {
        res.redirect('/addMsg')
    })
});
router.get('/cut', function (req, res) {
    const e=req.query;
    const img=e.img;
    console.log(img)
    const x=parseInt(e.x);
    const y=parseInt(e.y);
    const w=parseInt(e.w);
    const h=parseInt(e.h);
    gm(img).crop(w, h, x, y).write(img, function (err) {
      if (!err) console.log('crazytown has arrived');
      db.updata(user,{name:req.session.userInfo},{photo:img},function () {
          res.end()
      })
    });
});
router.get('/addMsg', function (req, res) {
    console.log(req.cookies);
    db.find(msg,function (err,result) {
        db.find(user,function (err,data) {
            res.render('addMsg.html',{photos:data,msgs:result.reverse(),username:req.cookies.name,len:Math.ceil(result.length/5)})
        })
    })
});
router.get('/del', function (req, res) {
    const id=req.query.id-1;
    let data = fs.readFileSync('./db.json', 'utf8');
        data = JSON.parse(data);
        data.stus.splice(id,1)
    const len=data.stus.length;
    for(let i=id;i<len;i++){
        data.stus[i].id--
    }
    let Str_ans = JSON.stringify(data);
    fs.writeFile('./db.json', Str_ans, 'utf8', (err) => {
        if (err) throw err;
    });
    res.redirect('/admin');
});
router.get('/admin', function (req, res) {
    if(req.session.userInfo!='admin'){
        return res.send('admin用户才有权限')
    }
    fs.readFile('./db.json','utf8',function(err,data){
        var data=JSON.parse(data);
        data=data.stus;
        res.render('admin.html',{
            msgs:data,
            username:req.session.userInfo
        })
    })
});
router.get('/logout', function (req, res) {
    req.session.isLogin=false;
    req.session.userInfo=null;
    res.redirect('/login');
});
router.get('/delCom/:id', function (req, res) {
    var whereStr = {id:req.params.id};
    userModel.remove(whereStr,function () {
        res.redirect('/computer');
    })

});
router.post('/add', function (req, res) {
    const myobj=new userModel(
        req.body
    );
    myobj.save(function(err,s){
      console.log('err:',err);
      console.log('保存的数据:',s);
      res.redirect('/computer');
    })
});
router.get('/computer', function (req, res) {
    userModel.find(function (err,result) {
      console.log(err,result)
    res.render('computer.html',{msgs:result})
    })
});

module.exports=router;

