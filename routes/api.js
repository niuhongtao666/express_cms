const express = require("express");

var router = express.Router();

router.get("/", (req, res) => {
  res.send("api接口");
});

router.get("/address", function (req, res, next) {
  res.send({
    success: true,
    result: [
      { name: "张三", address: "北京市" },
      { name: "李四", address: "北京市" },
      { name: "王五", address: "北京市" },
    ],
  });
});
module.exports = router;
