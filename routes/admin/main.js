const express = require("express");
const FocusModel = require("../../model/focusModel");
const NavModel = require("../../model/navModel");
const ManagerModel = require("../../model/managerModel");
const ArticleCateModel = require("../../model/articleCateModel");
const ArticleModel = require("../../model/articleModel");
//配置所有的Model
var appModel = {
    FocusModel: FocusModel,
    NavModel,
    ManagerModel,
    ArticleCateModel,
    ArticleModel
}
// appModel.FocusModel
// appModel["FocusModel"]  appModel["NavModel"]=NavModel

var router = express.Router()

router.get("/", (req, res) => {
    res.render("admin/main/index.html")
})
router.get("/welcome", (req, res) => {
    res.send("欢迎来到后台管理中心")
})

router.get("/changeStatus", async (req, res) => {
    //1、获取要修改数据的id
    //2、我们需要查询当前数据的状态 
    //3、修改状态   0 修改成 1    1修改成0

    // es6里面的属性名表达式
    // var aaa="username"
    // var obj={
    //     [aaa]:"张三"
    // }
    // console.log(obj)

    let id = req.query.id;
    let model = req.query.model + "Model";   //FocusModel NavModel 要操作的数据模型  也就修改的表对应的model名称 Focus
    let field = req.query.field;   //要修改的字段   status   hot
    let json;  //要更新的数据
    var result = await appModel[model].find({ "_id": id });
    if (result.length > 0) {
        var tempField = result[0][field];
        tempField == 1 ? json = { [field]: 0 } : json = { [field]: 1 };  //es6里面的属性名表达式
        await appModel[model].updateOne({ "_id": id }, json);
        res.send({
            success: true,
            message: '修改状态成功'
        });
    } else {
        res.send({
            success: false,
            message: '修改状态失败'
        });
    }


})

router.get("/changeNum", async (req, res) => {
    try {
        let id = req.query.id;
        let model = req.query.model + "Model";   //FocusModel NavModel 要操作的数据模型  也就修改的表对应的model名称 Focus
        let field = req.query.field;   //要修改的字段   sort
        let num = req.query.num;
        var result = await appModel[model].find({ "_id": id });
        if (result.length > 0) {
            let json = {
                [field]: num
            }
            await appModel[model].updateOne({ "_id": id }, json);
            res.send({
                success: true,
                message: '修改状态成功'
            });
        } else {
            res.send({
                success: false,
                message: '修改数量失败'
            });
        }
    } catch (error) {
        res.send({
            success: false,
            message: '修改数量失败'
        });
    }
})
module.exports = router