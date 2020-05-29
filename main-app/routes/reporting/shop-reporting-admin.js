const express = require('express');
const path = require('path');

const shopReportingController = require('../../controllers/reporting/admin-reporting')

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', shopReportingController.getAddProduct);

module.exports = router;