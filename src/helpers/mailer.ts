import nodemailer from 'nodemailer';
import User from '@/models/userModel';
import bcryptjs from 'bcryptjs';
import { connect } from '@/dbconfig/dbconfig';

connect();
export const sendEmail = async ({ email, emailType, userId }: any) => {
    try {
        const hashedToken = await bcryptjs.hash(userId.toString(), 10);
        if (emailType === 'VERIFY') {
            await User.findByIdAndUpdate(userId, { verifyToken: hashedToken, verifyTokenExpiry: Date.now() + 3600000 }, { new: true });
        } else if (emailType === 'RESET') {
            await User.findByIdAndUpdate(userId, { forgotPasswordToken: hashedToken, forgotPasswordTokenExpiry: Date.now() + 3600000 }, { new: true });
        }

        var transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: Number(process.env.MAILTRAP_PORT),
            auth: {
                user: process.env.MAILTRAP_USER,
                pass: process.env.MAILTRAP_PASS
            }
        });

        const mailOptions = {
            from: 'purusharth2@gmail.com',
            to: email,
            subject: emailType === 'VERIFY' ? 'Verify your email' : 'Reset your password',
            html: `<p>${emailType === 'VERIFY' ? 'Please verify your email by clicking the link below:' : 'Please reset your password by clicking the link below:'}</p>
            <a href="${process.env.DOMAIN}/auth/${emailType === 'VERIFY' ? 'verify' : 'reset'}?token=${hashedToken}">${emailType === 'VERIFY' ? 'Verify Email' : 'Reset Password'}</a>
            `
        };

        const mailResponse = await transport.sendMail(mailOptions);
        return mailResponse 
    } catch (error: any) {
        throw new Error(error.message);
    }
}
