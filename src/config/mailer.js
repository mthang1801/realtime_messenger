import nodemailer from "nodemailer";

/**
 * Config admin send mail
 */

const mailHost = process.env.MAIL_HOST;
const mailPort = process.env.MAIL_PORT;
const mailUser = process.env.MAIL_USER;
const mailPass = process.env.MAIL_PASS;

let sendEmail = (to, subject, htmlContent) =>{
  let transporter = nodemailer.createTransport({
    host : mailHost,
    port : mailPort,
    secure : false ,
    auth : {
      user : mailUser,
      pass : mailPass
    }
  })

  let options = {
    from : mailUser,
    to : to,
    subject : subject,
    html : htmlContent
  }

  return transporter.sendMail(options);
}

module.exports = sendEmail;