const express = require("express");
const router = express.Router();
const adminreport = require("../controller/AdminReportDownload");

router.get("/admin/reportpdf", adminreport.downloadReport);

module.exports = router;
