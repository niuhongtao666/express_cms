const express = require("express");
const router = express.Router()
const url = require("url")

//判断用户有没有登录
router.use((req, res, next) => {    

    console.log(req.url)
    var pathname=url.parse(req.url).pathname
    if (req.session.userinfo && req.session.userinfo.username) {
        next()
    }else{
        if (pathname=="/login" || pathname=="/login/doLogin" ||  pathname=="/login/verify"){
            next()
        }else{
            res.redirect(`/${req.app.locals.adminPath}/login`)
        }  
        // next()   
    }
})

//引入模块
const main = require("./admin/main")
const user = require("./admin/user")
const login = require("./admin/login")
const nav = require("./admin/nav")
const manager = require("./admin/manager")
const focus = require("./admin/focus")
const articleCate = require("./admin/articleCate")
const article = require("./admin/article")
const setting = require("./admin/setting")

//挂载路由
router.use("/", main)
router.use("/user", user)
router.use("/login", login)
router.use("/nav", nav)
router.use("/manager", manager)
router.use("/focus", focus)
router.use("/articleCate", articleCate)
router.use("/article", article)
router.use("/setting", setting)

module.exports = router