import fs from 'fs';
import handlebars from 'handlebars';
import nodemailer from 'nodemailer';
import Userschema from '../models/newuser.js';

const Forgotpass = async (req, res, next) => {
    const mail = req.params.mail;
    try {
        const mailcheck = await Userschema.findOne({ email: mail });
        if (mailcheck) {
            const email = mail;
            const otp = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
            console.log(email);
            console.log(otp);
            
            // Read the HTML email template
            const source = fs.readFileSync('public/mail_templates/otpEmail.hbs', 'utf8');
            const template = handlebars.compile(source);

            // Render the template with OTP
            const html = template({ otp });

            // Create Nodemailer transporter
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'venkatasaigangadharsgk@gmail.com',
                    pass: 'kaic blts bxmb ydqh'
                }
            });

            // Email options
            var mailOptions = {
                from: 'venkatasaigangadharsgk@gmail.com',
                to: email,
                subject: 'Welcome To DORA',
                html: html // Use HTML instead of text
            };

            // Send email
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
            
            return res.status(200).json(otp);
        } else {
            return res.status(200).json(false);
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export default Forgotpass;
