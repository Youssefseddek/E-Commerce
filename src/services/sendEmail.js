import nodemailer from 'nodemailer'
import path from 'path'
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url))

export async function myEmail(dest, subject, message, attachments = []) {

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.nodemailerEmail, // generated ethereal user
            pass: process.env.nodemailerPassword, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: `"E-Commerce" <${process.env.nodemailerEmail}>`, // sender address
        to: dest, // list of receivers
        subject: subject || 'there is no subject', // Subject line
        html: message, // html body
        attachments
    });
    console.log(info);
    return info

}
