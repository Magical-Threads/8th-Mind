var nodemailer = require('nodemailer');

// console.log('@@@@ MAIL_HOST: ', process.env.MAIL_HOST);
// console.log('@@@@ MAIL_HOST: ', process.env.MAIL_USERNAME);
// console.log('@@@@ MAIL_HOST: ', process.env.MAIL_PASSWORD);

// MAIL_HOST=smtp.sendgrid.net
// MAIL_PORT=465
// MAIL_USERNAME=
// MAIL_PASSWORD=

var transporter = nodemailer.createTransport({
    from: '8th Mind <noreply@8thmind.com>',
    host: process.env.MAIL_HOST,
    // secureConnection: false,
    secure: true,
    // port: 587,
    // transportMethod: 'SMTP',
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD
    },
    // logger: true,
    // debug: true
});



module.exports = transporter;
/*
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

var transporter = nodemailer.createTransport(smtpTransport({
   service: 'Gmail',
   auth: {
       user: 'alexrobbio.smtp@gmail.com',
       pass: 'Robbiosmtp'
   }
}));

/*
var transporter = nodemailer.createTransport({
    from: 'alexrobbio860@gmail.com',
    service: 'Gmail',
    transportMethod: 'SMTP',
    auth: {
        user: 'alexrobbio.smtp@gmail.com',
        pass: 'Robbiosmtp'
    }
});


module.exports = transporter;
*/
