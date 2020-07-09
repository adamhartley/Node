const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const orderHelper = require('../models/utils/orderHelper')

exports.getInvoice = (req, res, next) => {
    const orderId = req.params.orderId;
    const invoiceName = 'invoice-' + orderId + '.pdf';
    const invoicePath = path.join('data', 'invoices', invoiceName);
    const baseUrl = req.baseUrl;
    let order;

    console.log('Base URL ' + baseUrl);

    orderHelper.getOrder(orderId, baseUrl)
        .then((order) => {
            if (!order) {
                next(new Error('Order not found'));
            }
            let isValidOrder;
            if (baseUrl === '/reporting/mongoose') {
                isValidOrder = order.user.userId.toString() === req.mongooseUser._id.toString();
            } else if (baseUrl === '/reporting') {
                console.log('validating user... ' + req.reportingUser._id.toString() + ' | ' + order.user.userId.toString());
                isValidOrder = order.user.userId.toString() === req.reportingUser._id.toString();
            } else {
                isValidOrder = order.user.userId.toString() === req.user.id.toString();
            }

            if (!isValidOrder) {
                return next(new Error('Unauthorized to view invoice'));
            }
            return order;
        })
        .then((order) => {
            console.log('Creating pdf...');
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"');

            const pdfDoc = new PDFDocument();
            pdfDoc.pipe(fs.createWriteStream(invoicePath));
            pdfDoc.pipe(res);

            pdfDoc.fontSize(26).text('Invoice', {
                underline: true
            });
            pdfDoc.fontSize(14).text('---------------------------------------------');

            let totalPrice = 0;
            order.items.forEach(prod => {
                totalPrice += prod.quantity * prod.product.price;
                pdfDoc.text(
                    prod.product.title +
                    ' - ' +
                    prod.quantity +
                    ' x $' +
                    prod.product.price);
            })
            pdfDoc.text('---------------------------------------------');
            pdfDoc.fontSize(20).text('Total Price: $' + totalPrice);
            pdfDoc.end();
        })
        .catch(err => {
            next(err);
        })
}