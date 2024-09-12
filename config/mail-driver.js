// send mail config
var sendgrid = require('@sendgrid/mail');
sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

var nodemailer = require("nodemailer");
var transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: '31466861b7b6e7',
        pass: 'fe2b65036183ec'
    }
});

var send = (template) => {
    return new Promise((resolve, reject) => {
        sendgrid.send(template, (error, info) => {
            if (error) {
                // console.log(error);
                reject(error);
            }else if(info){
                // console.log(info);
                resolve(info);
            }
        });
    });
}

var send2 = (template) => {
    return new Promise((resolve, reject) => {
        // send mail with defined transport object
        transport.sendMail(template, function(error, success) {
            if(success) {
                resolve(success)
            }else if(error) {
                reject(error)
            }
        });
    });
}

module.exports = {
    send: send,
    send2: send2
};