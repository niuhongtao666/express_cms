const express = require("express");
const router = express.Router();
const ManagerModel = require("../../model/managerModel");
const { md5,getUnix } = require("../../model/tools");

router.get("/", async (req, res) => {

    //获取管理员数据
    let result = await ManagerModel.find({})

    res.render("admin/manager/index.html", {
        list: result
    })
})

router.get("/add", (req, res) => {

    res.render("admin/manager/add.html")
})
router.post("/doAdd", async (req, res) => {
    //1、获取表单提交的数据
    var username = req.body.username;
    var password = req.body.password;
    var rpassword = req.body.rpassword;
    var email = req.body.email;
    var mobile = req.body.mobile;
    var status = req.body.status;
    //2、验证数据是否合法
    if (username == "") {
        res.render("admin/public/error.html", {
            "redirectUrl": "/admin/manager/add",
            "message": "用户名不能为空"
        })
        return;
    }
    if (password.length < 6) {
        res.render('admin/public/error', {
            message: '密码长度不能小于6位',
            redirectUrl: `/${req.app.locals.adminPath}/manager/add`
        })
        return;
    }
    if (password != rpassword) {
        res.render('admin/public/error', {
            message: "密码和确认密码不一致",
            redirectUrl:  `/${req.app.locals.adminPath}/manager/add`
        })
        return;
    }
     //3、判断数据库里面有没有我们要增加的数据
     let result = await ManagerModel.find({"username": username});
     if (result.length>0){
        res.render('admin/public/error', {
            message: "当前用户已经存在，请换一个用户",
            redirectUrl: `/${req.app.locals.adminPath}/manager/add`
        })
        return;
     }else{
        //4、执行增加操作
        var addResult=new ManagerModel({
            username,
            password:md5(password),
            email,
            mobile,
            status,
            addtime:getUnix()
        })

        await addResult.save()
        res.redirect(`/${req.app.locals.adminPath}/manager`)

     }

})



router.get("/edit", async (req, res) => {

    //获取要修改数据的id
    var id = req.query.id;
    var result = await ManagerModel.find({"_id":id});
    console.log(result);
    if (result.length>0){
        res.render("admin/manager/edit.html",{
            list:result[0]
        })
    }else{
        res.redirect("/admin/manager")
    }

})




router.post("/doEdit", async (req, res) => {
    
    var id = req.body.id;    
    var password = req.body.password;
    var rpassword = req.body.rpassword;
    var email = req.body.email;
    var mobile = req.body.mobile;
    var status = req.body.status;

    if (password.length>0){ //修改密码
        if (password.length < 6) {
            res.render('admin/public/error', {
                message: '密码长度不能小于6位',
                redirectUrl: `/${req.app.locals.adminPath}/manager/edit?id=${id}`
            })
            return;
        }
        if (password != rpassword) {
            res.render('admin/public/error', {
                message: "密码和确认密码不一致",
                redirectUrl: `/${req.app.locals.adminPath}/manager/edit?id=${id}`
            })
            return;
        }
        await ManagerModel.updateOne({"_id":id},  {          
            "email": email,
            "mobile": mobile,
            "password":md5(password),
            "status":status
        })
       
    }else{  //不修改密码，只修改其他信息

        await ManagerModel.updateOne({"_id":id},  {          
            "email": email,
            "mobile": mobile,
            "status":status
        })
    }
    res.redirect(`/${req.app.locals.adminPath}/manager`)

})

router.get("/delete", async (req, res) => {    
    var id = req.query.id;
    var result = await ManagerModel.deleteOne({"_id":id});
    console.log(result)
    res.render('admin/public/success.html', {
        message: "删除数据成功",
        redirectUrl:`/${req.app.locals.adminPath}/manager`
    })
})

module.exports = router