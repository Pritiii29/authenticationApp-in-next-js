import nodemailer from 'nodemailer';
import User from '@/models/UserModel';
import bcryptjs from 'bcryptjs';


export const sendEmail = async ({ email, emailType, userId }: any) => {
    try {
        //create hashed token
        const hashedToken = await bcryptjs.hash(userId.toString(), 10)

        if (emailType === 'VERIFY') {
            await User.findByIdAndUpdate(userId,
                {
                    verifyToken: hashedToken,
                    verifyTokenExpiry: Date.now() + 3600000
                })
        } else if (emailType === 'RESET') {
            await User.findByIdAndUpdate(userId,
                {
                    forgotPasswordToken: hashedToken,
                    forgotPasswordTokenExpiry: Date.now() + 3600000
                })
        }

        // Looking to send emails in production? Check out our Email API/SMTP product!
        var transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "9efb1189cb01e9",
                pass: "9fee9e3c9d968c"

                //TODO: add these credentials tp .env file
            }
        });

        const mailOptioons = {
            form: 'pritibandewar52@gmail.com',
            to: email,
            subject: emailType === 'VERIFY' ? 'Verify your email address' : 'Reset your password',
            html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">Verify Email</a>to ${emailType === 'VERIFY' ? 'verify your email address' : 'reset your password'}
             or copy and paste this link in your browser: <br>
             ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
            </p>  `
        }

        const mailresponse = await transport.sendMail(mailOptioons)
        return mailOptioons;
    } catch (error: any) {
        throw new Error(error.message);
    }
}