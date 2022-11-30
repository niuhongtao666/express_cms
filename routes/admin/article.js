const express = require("express");
var router = express.Router();
const ArticleCateModel = require("../../model/articleCateModel");
const ArticleModel = require("../../model/articleModel");
const { multer,getUnix } = require("../../model/tools");

router.get("/", async (req, res) => {

    var page = req.query.page || 1;

    var pageSize = 8;

    var json = {}

    // var result =await ArticleModel.find({}).skip((page-1)*pageSize).limit(pageSize);

    var result = await ArticleModel.aggregate([
        {
            $lookup: {
                from: "article_cate",
                localField: "cid",
                foreignField: "_id",
                as: "cate"
            }
        },
        {
            $match: json
        },
        {
            $sort: { "add_time": -1 }
        }, 
        {
            $skip: (page - 1) * pageSize
        }, 
        {
            $limit: pageSize
        }

    ])

    var count = await ArticleModel.count({})

    res.render("admin/article/index.html", {
        list: result,
        totalPages: Math.ceil(count / pageSize),
        page: page
    })
})
router.get("/add", async (req, res) => {

    var result = await ArticleCateModel.aggregate([
        {
            $lookup: {
                from: "article_cate",
                localField: "_id",
                foreignField: "pid",
                as: "items"
            }
        },
        {
            $match: {
                pid: "0"
            }
        }
    ])

    res.render("admin/article/add.html", {
        articleCate: result
    })
})


router.post("/doAdd", multer().single('article_img'), async (req, res) => {

    var imgSrc = req.file ? req.file.path.substr(7) : "";
    var result = new ArticleModel(Object.assign(req.body, { "article_img": imgSrc },{ "add_time": getUnix() }))
    await result.save()

    res.redirect(`/${req.app.locals.adminPath}/article`);
})


router.get("/edit", async (req, res) => {
    //获取要修改的数据
    var id = req.query.id;
    var articleResult = await ArticleModel.find({ "_id": id });

    //获取分类信息
    var cateResult = await ArticleCateModel.aggregate([
        {
            $lookup: {
                from: "article_cate",
                localField: "_id",
                foreignField: "pid",
                as: "items"
            }
        },
        {
            $match: {
                pid: "0"
            }
        }
    ])

    res.render("admin/article/edit.html", {
        articleCate: cateResult,
        list: articleResult[0]
    })
})

router.post("/doEdit", multer().single('article_img'), async (req, res) => {

    try {
        if (req.file) {
            var imgSrc = req.file ? req.file.path.substr(7) : "";
            await ArticleModel.updateOne({ "_id": req.body.id }, Object.assign(req.body, { "article_img": imgSrc }))
        } else {
            await ArticleModel.updateOne({ "_id": req.body.id }, req.body)
        }
        res.redirect(`/${req.app.locals.adminPath}/article`);
    } catch (error) {
        res.render("admin/public/error.html", {
            "redirectUrl": `/${req.app.locals.adminPath}/article/edit?id=${req.body.id}`,
            "message": "修改数据失败"
        })
    }

})

//富文本编辑器上传图片
router.post("/doUploadImage", multer().single('file'), (req, res) => {

    var imgSrc = req.file ? req.file.path.substr(7) : "";

    // {link: 'path/to/image.jpg'}.
    res.send({
        link: "/" + imgSrc
    })
})

router.get("/delete", async (req, res) => {
    var id = req.query.id;  
    await ArticleModel.deleteOne({ "_id": id }); 
    res.render("admin/public/success.html", {
        "redirectUrl": `/${req.app.locals.adminPath}/article`,
        "message": "删除数据成功"
    })

})
module.exports = router