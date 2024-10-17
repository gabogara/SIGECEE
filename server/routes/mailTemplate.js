const nodemailer = require("nodemailer");
const Mailer = require('./mailer');
const fs = require('fs');

module.exports = {

  async emailTemplate(subject_email, to_email, Message1, Message2, Message3, Message4, Message5, Link) {

    var contents = fs.readFileSync('./templates/Correo.html', 'utf8');

    let finalText = contents;
    finalText = finalText.replace("{{Message1}}", Message1);
    finalText = finalText.replace("{{Message2}}", Message2);
    finalText = finalText.replace("{{Message3}}", Message3);
    finalText = finalText.replace("{{Message4}}", Message4);
    finalText = finalText.replace("{{Message5}}", Message5);
    finalText = finalText.replace("{{Link}}", Link);

    var body = finalText;
    var mailOptions = {
      from: '"Sistema para la Gestión de Censos, Encuestas y Estudios Facultad de Ciencias UCV" <gestion.cee.ciens.ucv@outlook.com>',
      to: "Undisclosed Recipients",
      bcc: to_email,
      subject: subject_email,
      html: body,
      attachments: [{
        filename: 'mural.jpg',
        path: './templates/mural.jpg',
        cid: 'mural@sigecee.app'
      },
      {
        filename: 'sigecee_blue.png',
        path: './templates/sigecee_blue.png',
        cid: 'sigecee_blue@sigecee.app'
      },
      {
        filename: 'ciencias.jpg',
        path: './templates/ciencias.jpg',
        cid: 'ciencias@sigecee.app'
      },
      {
        filename: 'sigecee_white.png',
        path: './templates/sigecee_white.png',
        cid: 'sigecee_white@sigecee.app'
      }]
    };

    return await Mailer.sendMails(mailOptions)

  }
}