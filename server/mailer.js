var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    from: '8th Mind <postmaster@mg.8thmind.com>',
    host: 'smtp.sendgrid.org',
    secureConnection: true,
    port: 465,
    transportMethod: 'SMTP',
    auth: {
        user: 'apikey',
        pass: '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'
    }
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
