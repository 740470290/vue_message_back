const express = require('express');
const fs = require("fs");
const router = express.Router();
const db=require('../model/db');
const user=db.models.User;
const msg=db.models.Msg;
const md5=require('../model/myMd5').myMd5;

router.get('/delMsg/:id', function (req, res) {
    db.del(msg,{_id:db.obj(req.params.id)},function (err,r) {
        console.log(err,r)
        res.send({"status":1})
    });
});
router.post('/login', function (req, res) {
    db.find(user,{name:req.body.name},function(err, result) { // 返回集合中所有数据
        if (err) throw err;
        if(result.length===0){return res.end('{"status":0}')}
        if(result[0].pwd===md5(req.body.pwd)){
           return res.end('{"status":2}');
        }
        return res.end('{"status":1}');
    });
});
router.post('/msg', function (req, res) {
    const content={name:req.body.name,msg:req.body.msg,msgDate:(new Date()).toLocaleString()};
    db.add(msg,content,function () {
        db.find(msg,function (err,result) {
            res.send(result[result.length-1])
        })
    });
});
router.get('/msg', function (req, res) {
    console.log(req.cookies)
    console.log(req.session)
    db.find(msg,function (err,result) {
        res.send({msgs:result.reverse()})
    })
});
router.post('/regis', function (req, res) {
    db.find(user,{name:req.body.name},function (err,result) {
        if(result.length!=0){
            return res.end('{"status":0}');
        }
        var response = {
        "name": req.body.name,
        "pwd": md5(req.body.pwd),
        "rDate": (new Date()).toLocaleString()
    };
        db.add(user,response,function () {
        res.end('{"status":1}');
    });
    });
});
module.exports=router;

