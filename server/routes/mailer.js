const nodemailer = require("nodemailer");

module.exports = {
    // async..await
    async sendMails(mailOptions) {
      return new Promise((resolve,reject)=>{
        var transporter = nodemailer.createTransport({
          host: "smtp-mail.outlook.com", // hostname
          secureConnection: false, // TLS requires secureConnection to be false
          port: 587, // port for secure SMTP
          /*pool: true,
          maxConnections: Infinity,
          maxMessages: Infinity,*/
          tls: {
             ciphers:'SSLv3'
          },
          auth: {
            user: process.env.EMAILJS_EMAIL,
            pass: process.env.EMAILJS_PASSWORD
          }
      });
      // envia correos con el objeto transporter definido
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
          resolve(false); // or use rejcet(false) but then you will have to handle errors
        } else {
          console.log('Email sent: ' + info.response);
          resolve(true);
        }
      });
      })
    }
}